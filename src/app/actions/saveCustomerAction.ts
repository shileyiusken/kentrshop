"use server";

import { db } from "@/db";
import { customers } from "@/db/schema";
import { actionClient } from "@/lib/safe-action";
import { getAuditChanges, writeAuditEvent } from "@/lib/audit";
import {
  insertCustomerSchema,
  type insertCustomerSchemaType,
} from "@/zod-schemas/customer";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";
import { requireManager } from "@/lib/staff";

export const saveCustomerAction = actionClient
  .metadata({ actionName: "saveCustomerAction" })
  .schema(insertCustomerSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: customer,
    }: {
      parsedInput: insertCustomerSchemaType;
    }) => {
      const { isAuthenticated } = getKindeServerSession();

      const isAuth = await isAuthenticated();

      if (!isAuth) redirect("/login");
      const { user } = await requireManager();
      const actorEmail = user?.email;
      if (!actorEmail) throw new Error("Could not identify the signed-in user for the audit record.");

      const values = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address1: customer.address1,
        address2: customer.address2?.trim() || null,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
        notes: customer.notes?.trim() || null,
        active: customer.id === 0 ? true : (customer.active ?? true),
      };
      const labels = {
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        phone: "Phone",
        address1: "Address line 1",
        address2: "Address line 2",
        city: "City",
        state: "State",
        zip: "ZIP code",
        notes: "Notes",
        active: "Active status",
      } as const;

      // New Customer
      // All new customers are active by default - no need to set active to true
      // createdAt and updatedAt are set by the database
      if (customer.id === 0) {
        const result = await db
          .insert(customers)
          .values(values)
          .returning();

        const created = result[0];
        await writeAuditEvent({
          actorId: user?.id ?? null,
          actorEmail,
          action: "created",
          entityType: "customer",
          entityId: created.id,
          summary: `Created customer ${created.firstName} ${created.lastName}`,
          changes: getAuditChanges(null, values, labels),
        });

        return {
          message: `Customer ID #${created.id} created successfully!`,
        };
      }

      // existing customer
      const [existing] = await db
        .select()
        .from(customers)
        .where(eq(customers.id, customer.id!))
        .limit(1);
      if (!existing) throw new Error(`Customer ID #${customer.id} was not found.`);

      const result = await db
        .update(customers)
        .set(values)
        .where(eq(customers.id, customer.id!))
        .returning();

      const updated = result[0];
      const changes = getAuditChanges(
        {
          firstName: existing.firstName,
          lastName: existing.lastName,
          email: existing.email,
          phone: existing.phone,
          address1: existing.address1,
          address2: existing.address2,
          city: existing.city,
          state: existing.state,
          zip: existing.zip,
          notes: existing.notes,
          active: existing.active,
        },
        values,
        labels,
      );
      if (Object.keys(changes).length) {
        await writeAuditEvent({
          actorId: user?.id ?? null,
          actorEmail,
          action: "updated",
          entityType: "customer",
          entityId: updated.id,
          summary: `Updated customer ${updated.firstName} ${updated.lastName}`,
          changes,
        });
      }

      return {
        message: `Customer ID #${updated.id} updated successfully!`,
      };
    }
  );
