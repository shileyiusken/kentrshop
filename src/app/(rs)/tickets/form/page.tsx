import { BackButton } from "@/components/BackButton";
import { getCustomer } from "@/lib/queries/getCustomer";
import { getTicket } from "@/lib/queries/getTicket";
import * as Sentry from "@sentry/nextjs";
import TicketForm from "./TicketForm";

import { getCurrentStaff } from "@/lib/staff";
import { listKindeUsers } from "@/lib/kinde-users";
import { db } from "@/db";
import { staffRoles } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId, ticketId } = await searchParams;

  if (!customerId && !ticketId)
    return {
      title: "Missing Customer ID or Ticket ID",
    };

  if (customerId)
    return {
      title: `New Ticket - Customer ID: ${customerId}`,
    };

  if (ticketId)
    return {
      title: `Ticket Details - Ticket ID: ${ticketId}`,
    };
}

export default async function TicketFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { customerId, ticketId } = await searchParams;

    if (!customerId && !ticketId) {
      return (
        <>
          <h2 className="text-2xl mb-2">
            Ticket ID or Customer ID required to load ticket form
          </h2>
          <BackButton title="Go Back" variant="default" />
        </>
      );
    }

    const staff = await getCurrentStaff();
    const isManager = staff?.role === "manager";

    // New ticket form
    if (customerId) {
      const customer = await getCustomer(parseInt(customerId));

      if (!customer) {
        return (
          <>
            <h2 className="text-2xl mb-2">
              Customer ID #{customerId} not found
            </h2>
            <BackButton title="Go Back" variant="default" />
          </>
        );
      }

      if (!customer.active) {
        return (
          <>
            <h2 className="text-2xl mb-2">
              Customer ID #{customerId} is not active.
            </h2>
            <BackButton title="Go Back" variant="default" />
          </>
        );
      }

      if (!isManager) {
        return <><h2 className="mb-2 text-2xl">Manager access is required to create a ticket.</h2><BackButton title="Go Back" variant="default" /></>;
      }

      if (isManager) {
        const users = await listKindeUsers();
        const roleAssignments = await db
          .select({ email: staffRoles.email })
          .from(staffRoles)
          .where(eq(staffRoles.role, "technician"));
        const technicianEmails = new Set(roleAssignments.map((item) => item.email.toLowerCase()));
        const techs = users
          ? users
              .filter((user): user is typeof user & { email: string } =>
                typeof user.email === "string" && technicianEmails.has(user.email.toLowerCase()),
              )
              .map((user) => ({ id: user.email.toLowerCase(), description: user.email.toLowerCase() }))
          : [];

        return (
          <TicketForm customer={customer} techs={techs} isManager={isManager} />
        );
      } else {
        return <TicketForm customer={customer} />;
      }
    }

    if (ticketId) {
      if (!staff) {
        return <><h2 className="mb-2 text-2xl">A staff role is required to open this ticket.</h2><BackButton title="Go Back" variant="default" /></>;
      }
      const ticket = await getTicket(parseInt(ticketId));

      if (!ticket) {
        <>
          <h2 className="text-2xl mb-2">Ticket ID #{ticketId} not found.</h2>
          <BackButton title="Go Back" variant="default" />
        </>;
      }

      const customer = await getCustomer(ticket.customerId);

      if (isManager) {
        const users = await listKindeUsers();
        const roleAssignments = await db
          .select({ email: staffRoles.email })
          .from(staffRoles)
          .where(eq(staffRoles.role, "technician"));
        const technicianEmails = new Set(roleAssignments.map((item) => item.email.toLowerCase()));
        const techs = users
          ? users
              .filter(
                (user): user is { email: string } =>
                  typeof user.email === "string" && technicianEmails.has(user.email.toLowerCase())
              )
              .map((user) => ({
                id: user.email?.toLowerCase(),
                description: user.email?.toLowerCase(),
              }))
          : [];

        return (
          <TicketForm
            customer={customer}
            ticket={ticket}
            techs={techs}
            isManager={isManager}
          />
        );
      } else {
        const isEditable =
          staff.role === "technician" && staff.user.email?.toLowerCase() === ticket.tech.toLowerCase();
        return (
          <TicketForm
            customer={customer}
            ticket={ticket}
            isEditable={isEditable}
          />
        );
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(e);
      throw e;
    }
  }
}
