import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ArrowUpRight, ClipboardClock, FileClock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { getCurrentStaff } from "@/lib/staff";

export const metadata = { title: "Audit trail" };

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const staff = await getCurrentStaff();
  if (staff?.role !== "manager") {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm">
        <ShieldCheck className="mx-auto size-9 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-semibold">Manager access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">Audit history is available to managers.</p>
        <Button asChild variant="outline" className="mt-5 rounded-xl"><Link href="/tickets">Back to tickets</Link></Button>
      </section>
    );
  }

  const { type } = await searchParams;
  const entityType = type === "customer" || type === "ticket" || type === "staff" ? type : undefined;
  const entries = await db
    .select()
    .from(auditLogs)
    .where(entityType ? eq(auditLogs.entityType, entityType) : undefined)
    .orderBy(desc(auditLogs.createdAt))
    .limit(100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-primary"><ClipboardClock className="size-4" /> Accountability</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-[2.1rem]">Audit trail</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Review who changed customer and ticket records, when the change happened, and which fields were updated.</p>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Filter audit events">
          {[{ label: "All activity", value: "all" }, { label: "Tickets", value: "ticket" }, { label: "Customers", value: "customer" }, { label: "Staff roles", value: "staff" }].map((filter) => {
            const active = (entityType ?? "all") === filter.value;
            const href = filter.value === "all" ? "/audit" : `/audit?type=${filter.value}`;
            return <Button key={filter.value} asChild variant={active ? "default" : "outline"} size="sm" className="rounded-xl"><Link href={href}>{filter.label}</Link></Button>;
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm">
        <span className="grid size-11 place-items-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300"><FileClock className="size-5" /></span>
        <div><p className="text-sm text-muted-foreground">Recent events</p><p className="mt-0.5 text-2xl font-semibold tracking-tight">{entries.length}</p></div>
        <span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">Latest 100</span>
      </div>

      {entries.length ? (
        <ol className="space-y-3">
          {entries.map((entry) => {
            const href = entry.entityType === "ticket" ? `/tickets/form?ticketId=${entry.entityId}` : entry.entityType === "customer" ? `/customers/form?customerId=${entry.entityId}` : "/roles";
            const changes = Object.entries(entry.changes ?? {});
            return (
              <li key={entry.id} className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold">{entry.summary}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{entry.actorEmail} <span aria-hidden="true">·</span> {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(entry.createdAt)}</p>
                  </div>
                  <Button asChild size="sm" variant="outline" className="shrink-0 rounded-xl"><Link href={href}>Open {entry.entityType === "staff" ? "staff roles" : entry.entityType} <ArrowUpRight className="size-3.5" /></Link></Button>
                </div>
                {changes.length ? (
                  <dl className="mt-4 grid gap-2 border-t pt-4 sm:grid-cols-2 xl:grid-cols-3">
                    {changes.map(([field, change]) => (
                      <div key={field} className="min-w-0 rounded-xl bg-muted/50 px-3 py-2.5">
                        <dt className="text-xs font-medium text-muted-foreground">{field}</dt>
                        <dd className="mt-1 break-words text-sm"><span className="text-muted-foreground">{displayValue(change.before)}</span><span className="px-2 text-muted-foreground" aria-label="changed to">→</span><span className="font-medium">{displayValue(change.after)}</span></dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed bg-card px-6 py-10 text-center">
          <div><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><ClipboardClock className="size-5" /></span><h2 className="mt-4 font-semibold">No activity recorded yet</h2><p className="mt-1 text-sm text-muted-foreground">New and updated records will appear here after the audit migration is applied.</p></div>
        </div>
      )}
    </div>
  );
}
