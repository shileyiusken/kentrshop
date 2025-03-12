import { getOpenTickets } from "@/lib/queries/getOpenTickets";
import TicketSearch from "./TicketSearch";
import { getTicketSearchResults } from "@/lib/queries/getTicketSearchResults";
import TicketTable from "./TicketTable";

export const metadata = {
  title: "Ticket Search",
};

const Tickets = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { searchText } = await searchParams;

  if (!searchText) {
    const results = await getOpenTickets();
    return (
      <>
        <TicketSearch />
        {results.length ? <TicketTable data={results} /> : (
          <p className="mt-4">No Open Ticket Found</p>
        )}
      </>
    );
  }

  const results = await getTicketSearchResults(searchText);

  return (
    <>
      <TicketSearch />
      {results.length ? <TicketTable data={results} /> : (
        <p className="mt-4">No Results Found</p>
      )}
    </>
  );
};
export default Tickets;
