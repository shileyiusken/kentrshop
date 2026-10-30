import { getOpenTickets } from "@/lib/queries/getOpenTickets";
import TicketSearch from "./TicketSearch";
import { getTicketSearchResults } from "@/lib/queries/getTicketSearchResults";
import TicketTable from "./TicketTable";
import Link from "next/link";
import { ArrowUpRight, ClipboardList, Plus, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Ticket Search",
};

const Tickets = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { searchText } = await searchParams;

  const results = searchText
    ? await getTicketSearchResults(searchText)
    : await getOpenTickets();
  const technicianCount = new Set(results.map((ticket) => ticket.tech).filter(Boolean)).size;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-primary">
            <ClipboardList className="size-4" /> Workshop operations
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-[2.1rem]">
            {searchText ? "Ticket search" : "Open tickets"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {searchText
              ? `Results matching “${searchText}”. Select a ticket to review or update its status.`
              : "Keep today’s repairs moving. Review open work, find a ticket, or start with a customer."}
          </p>
        </div>
        <Button asChild className="h-10 shrink-0 rounded-xl px-4 shadow-sm">
          <Link href="/customers/form"><Plus className="size-4" /> Add customer</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm">
          <span className="grid size-11 place-items-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
            <ClipboardList className="size-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">{searchText ? "Matching tickets" : "Open work orders"}</p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight">{results.length}</p>
          </div>
          <span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">Live list</span>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm">
          <span className="grid size-11 place-items-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            <UsersRound className="size-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">Technicians assigned</p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight">{technicianCount}</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"><ArrowUpRight className="size-3.5" /> In this list</span>
        </div>
      </div>

      <TicketSearch />

      {results.length ? (
        <TicketTable data={results} />
      ) : (
        <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed bg-card px-6 py-10 text-center">
          <div>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><ClipboardList className="size-5" /></span>
            <h2 className="mt-4 font-semibold">{searchText ? "No tickets found" : "You’re all caught up"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{searchText ? "Try another name, ticket title, email, or technician." : "There are no open repair tickets right now."}</p>
            {searchText ? <Button asChild variant="link" className="mt-2"><Link href="/tickets">Clear search</Link></Button> : null}
          </div>
        </div>
      )}
    </div>
  );
};
export default Tickets;
