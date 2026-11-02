"use server";

import { db } from "@/db";
import { tickets } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { getAuditChanges, writeAuditEvent } from "@/lib/audit";
import {
  insertTicketSchema,
  type insertTicketSchemaType,
} from "@/zod-schemas/ticket";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";
import { getCurrentStaff } from "@/lib/staff";

export const saveTicketAction = actionClient
  .metadata({ actionName: "saveTicketAction" })
  .schema(insertTicketSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: ticket,
    }: {
      parsedInput: insertTicketSchemaType;
    }) => {
      const { isAuthenticated } = getKindeServerSession();

      const isAuth = await isAuthenticated();

      if (!isAuth) redirect("/login");
      const staff = await getCurrentStaff();
      if (!staff) throw new Error("A manager or technician role is required to update tickets.");
      const { user } = staff;
      const actorEmail = user?.email;
      if (!actorEmail) throw new Error("Could not identify the signed-in user for the audit record.");

      const values = {
        customerId: ticket.customerId,
        title: ticket.title,
        description: ticket.description ?? null,
        completed: ticket.completed ?? false,
        tech: ticket.tech,
      };
      const labels = {
        customerId: "Customer",
        title: "Title",
        description: "Description",
        completed: "Completed",
        tech: "Technician",
      } as const;

      //   new customer
      if (ticket.id === "(New)") {
        if (staff.role !== "manager") {
          throw new Error("Only managers can create tickets.");
        }
        const result = await db
          .insert(tickets)
          .values(values)
          .returning();

        const created = result[0];
        await writeAuditEvent({
          actorId: user?.id ?? null,
          actorEmail,
          action: "created",
          entityType: "ticket",
          entityId: created.id,
          summary: `Created ticket “${created.title}”`,
          changes: getAuditChanges(null, values, labels),
        });

        return {
          message: `Ticket ID #${created.id} was created successfully`,
        };
      }

      //   updating a ticket
      const [existing] = await db
        .select()
        .from(tickets)
        .where(eq(tickets.id, ticket.id))
        .limit(1);
      if (!existing) throw new Error(`Ticket ID #${ticket.id} was not found.`);

      if (
        staff.role !== "manager" &&
        (staff.role !== "technician" || existing.tech.toLowerCase() !== actorEmail.toLowerCase())
      ) {
        throw new Error("You can only update tickets assigned to you.");
      }

      if (staff.role === "technician") {
        values.customerId = existing.customerId;
        values.tech = existing.tech;
      }

      const result = await db
        .update(tickets)
        .set(values)
        .where(eq(tickets.id, ticket.id))
        .returning();

      const updated = result[0];
      const changes = getAuditChanges(
        {
          customerId: existing.customerId,
          title: existing.title,
          description: existing.description,
          completed: existing.completed,
          tech: existing.tech,
        },
        values,
        labels,
      );
      if (Object.keys(changes).length) {
        await writeAuditEvent({
          actorId: user?.id ?? null,
          actorEmail,
          action: "updated",
          entityType: "ticket",
          entityId: updated.id,
          summary: `Updated ticket “${updated.title}”`,
          changes,
        });
      }

      return {
        message: `Ticket ID #${updated.id} updated successfully`,
      };
    }
  );
