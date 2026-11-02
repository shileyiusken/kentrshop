import Link from "next/link";
import { ArrowUpRight, ShieldCheck, UserRoundCog, UsersRound, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { staffRoles } from "@/db/schema";
import { listKindeUsers } from "@/lib/kinde-users";
import { getCurrentStaff } from "@/lib/staff";
import { setStaffRole } from "@/app/actions/staffRoleActions";

export const metadata = { title: "Team & roles" };

export default async function StaffRolesPage() {
  const staff = await getCurrentStaff();
  if (staff?.role !== "manager") {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm">
        <ShieldCheck className="mx-auto size-9 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-semibold">Manager access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">Only managers can assign team roles.</p>
        <Button asChild variant="outline" className="mt-5 rounded-xl"><Link href="/tickets">Back to tickets</Link></Button>
      </section>
    );
  }

  const [users, assignments] = await Promise.all([
    listKindeUsers(),
    db.select().from(staffRoles),
  ]);
  const assignedById = new Map(assignments.map((assignment) => [assignment.userId, assignment]));
  const team = users
    .filter((user): user is typeof user & { id: string; email: string } => Boolean(user.id && user.email))
    .sort((a, b) => `${a.last_name ?? ""} ${a.first_name ?? ""}`.localeCompare(`${b.last_name ?? ""} ${b.first_name ?? ""}`));
  const currentAssignment = assignedById.get(staff.user.id);
  const hasLegacyManager = staff.role === "manager" && !currentAssignment;
  const managerCount = assignments.filter((assignment) => assignment.role === "manager").length + Number(hasLegacyManager);
  const technicianCount = assignments.filter((assignment) => assignment.role === "technician").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-primary"><UserRoundCog className="size-4" /> Workspace access</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-[2.1rem]">Team & roles</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Assign a role to each Kinde user. Managers manage records and staff; technicians can update tickets assigned to them.</p>
        </div>
        <Button asChild variant="outline" className="h-10 rounded-xl"><Link href="/audit">View role history <ArrowUpRight className="size-4" /></Link></Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm">
          <span className="grid size-11 place-items-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"><ShieldCheck className="size-5" /></span>
          <div><p className="text-sm text-muted-foreground">Managers</p><p className="mt-0.5 text-2xl font-semibold tracking-tight">{managerCount}</p></div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm">
          <span className="grid size-11 place-items-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300"><Wrench className="size-5" /></span>
          <div><p className="text-sm text-muted-foreground">Technicians</p><p className="mt-0.5 text-2xl font-semibold tracking-tight">{technicianCount}</p></div>
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground"><UsersRound className="size-3.5" /> {team.length} Kinde users</span>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="font-semibold">Staff directory</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose a role and save. Users without a role cannot access the workshop workspace.</p>
        </div>
        {team.length ? (
          <ul className="divide-y">
            {team.map((user) => {
              const assignment = assignedById.get(user.id);
              const displayRole = assignment?.role ?? (user.id === staff.user.id && hasLegacyManager ? "manager" : "");
              const isLastManager = displayRole === "manager" && managerCount <= 1;
              const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
              return (
                <li key={user.id} className="grid min-w-0 gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_18rem] sm:items-center sm:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-sm font-semibold text-muted-foreground">{(user.first_name?.[0] ?? user.email[0]).toUpperCase()}</span>
                    <div className="min-w-0"><p className="truncate text-sm font-medium">{fullName || user.email}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div>
                    {user.is_suspended ? <span className="rounded-full bg-destructive/10 px-2 py-1 text-[11px] font-medium text-destructive">Suspended</span> : null}
                  </div>
                  <div className="min-w-0 sm:w-72">
                    <form action={setStaffRole} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                      <input type="hidden" name="userId" value={user.id} />
                      <input type="hidden" name="email" value={user.email} />
                      <label className="sr-only" htmlFor={`role-${user.id}`}>Role for {user.email}</label>
                      <select id={`role-${user.id}`} name="role" defaultValue={displayRole} className="h-10 w-full min-w-0 rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="" disabled={isLastManager}>No role</option>
                        <option value="manager">Manager</option>
                        <option value="technician" disabled={isLastManager}>Technician</option>
                      </select>
                      <Button type="submit" variant="outline" className="h-10 rounded-xl px-4" disabled={isLastManager}>Save</Button>
                    </form>
                    {isLastManager ? <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-right">Assign another manager before changing this role.</p> : null}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-6 py-12 text-center"><h3 className="font-semibold">No Kinde users found</h3><p className="mt-1 text-sm text-muted-foreground">Add staff accounts in Kinde, then refresh this directory.</p></div>
        )}
      </section>
    </div>
  );
}
