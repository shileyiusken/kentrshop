"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { auditLogs, staffRoles } from "@/db/schema";
import { listKindeUsers } from "@/lib/kinde-users";
import { requireManager } from "@/lib/staff";

export async function setStaffRole(formData: FormData) {
  const manager = await requireManager();
  const userId = String(formData.get("userId") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const selectedRole = String(formData.get("role") ?? "");

  if (!userId || !email || !["", "manager", "technician"].includes(selectedRole)) {
    throw new Error("Choose a valid staff member and role.");
  }

  const directoryUser = (await listKindeUsers()).find(
    (user) => user.id === userId && user.email?.toLowerCase() === email,
  );
  if (!directoryUser) throw new Error("That user could not be verified with Kinde.");

  const [existing] = await db
    .select()
    .from(staffRoles)
    .where(eq(staffRoles.userId, userId))
    .limit(1);
  const nextRole = selectedRole === "" ? null : (selectedRole as "manager" | "technician");

  if (
    nextRole !== "manager" &&
    (existing?.role === "manager" || (manager.user.id === userId && manager.role === "manager"))
  ) {
    const managers = await db
      .select({ userId: staffRoles.userId })
      .from(staffRoles)
      .where(eq(staffRoles.role, "manager"));
    if (managers.length <= 1) {
      throw new Error("Assign another manager before removing the last manager role.");
    }
  }

  if (existing?.role === nextRole) return;

  let auditEntityId: number;
  let action: "created" | "updated";
  if (nextRole) {
    const [saved] = await db
      .insert(staffRoles)
      .values({ userId, email, role: nextRole })
      .onConflictDoUpdate({
        target: staffRoles.userId,
        set: { email, role: nextRole, updatedAt: new Date() },
      })
      .returning({ id: staffRoles.id });
    auditEntityId = saved.id;
    action = existing ? "updated" : "created";
  } else {
    if (!existing) return;
    await db.delete(staffRoles).where(eq(staffRoles.userId, userId));
    auditEntityId = existing.id;
    action = "updated";
  }

  await db.insert(auditLogs).values({
    actorId: manager.user.id,
    actorEmail: manager.user.email!,
    action,
    entityType: "staff",
    entityId: auditEntityId,
    summary: nextRole
      ? `Assigned ${nextRole} role to ${email}`
      : `Removed staff role from ${email}`,
    changes: {
      Role: { before: existing?.role ?? null, after: nextRole },
    },
  });

  revalidatePath("/roles");
  revalidatePath("/", "layout");
  revalidatePath("/audit");
}
