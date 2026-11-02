import { db } from "@/db";
import { auditLogs } from "@/db/schema";

export type AuditValue = string | number | boolean | null;
export type AuditChanges = Record<
  string,
  { before: AuditValue; after: AuditValue }
>;

export async function writeAuditEvent({
  actorId,
  actorEmail,
  action,
  entityType,
  entityId,
  summary,
  changes,
}: {
  actorId: string | null;
  actorEmail: string;
  action: "created" | "updated";
  entityType: "ticket" | "customer" | "staff";
  entityId: number;
  summary: string;
  changes: AuditChanges;
}) {
  await db.insert(auditLogs).values({
    actorId,
    actorEmail,
    action,
    entityType,
    entityId,
    summary,
    changes,
  });
}

export function getAuditChanges<T extends Record<string, AuditValue>>(
  before: T | null,
  after: T,
  labels: Partial<Record<keyof T, string>>,
): AuditChanges {
  const changes: AuditChanges = {};

  for (const key of Object.keys(after) as (keyof T)[]) {
    const oldValue = before ? before[key] : null;
    const newValue = after[key];
    if (oldValue !== newValue) {
      changes[String(labels[key] ?? key)] = {
        before: oldValue,
        after: newValue,
      };
    }
  }

  return changes;
}
