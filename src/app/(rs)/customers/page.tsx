import { getCustomerSearchResult } from "@/lib/queries/getCustomerSearchResult";
import CustomerSearch from "./CustomerSearch";
import * as Sentry from '@sentry/nextjs'
import CustomerTable from "./CustomerTable";

export const metadata = {
  title: "Customer Search",
};

const Customers = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { searchText } = await searchParams;

  if (!searchText) return <CustomerSearch />;

  const span = Sentry.startInactiveSpan({
    name: 'getCustomerSearchResult-2',
  })
  const results = await getCustomerSearchResult(searchText);
  span.end()

  return (
    <>
      <CustomerSearch />
      {results.length ? <CustomerTable data={results} /> : (
        <p className="mt-4">No Results Found</p>
      )}
    </>
  );
};
export default Customers;
