import { eq } from "drizzle-orm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";
import { staffRoles } from "@/db/schema";

export type StaffRole = "manager" | "technician";

export async function getCurrentStaff() {
  const session = getKindeServerSession();
  const [user, managerPermission] = await Promise.all([
    session.getUser(),
    session.getPermission("manager"),
  ]);

  if (!user?.id || !user.email) return null;

  const [assignment] = await db
    .select({ role: staffRoles.role })
    .from(staffRoles)
    .where(eq(staffRoles.userId, user.id))
    .limit(1);

  const role: StaffRole | null = assignment?.role ?? (managerPermission?.isGranted ? "manager" : null);
  return { user, role };
}

export async function requireManager() {
  const staff = await getCurrentStaff();
  if (!staff || staff.role !== "manager") {
    throw new Error("Manager access is required for this action.");
  }
  return staff;
}
