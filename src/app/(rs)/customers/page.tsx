import { getCustomerSearchResult } from "@/lib/queries/getCustomerSearchResult";
import CustomerSearch from "./CustomerSearch";
import * as Sentry from '@sentry/nextjs'
import CustomerTable from "./CustomerTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserRoundPlus, UsersRound } from "lucide-react";

export const metadata = {
  title: "Customer Search",
};

const Customers = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { searchText } = await searchParams;

  const results = searchText ? await (async () => {
    const span = Sentry.startInactiveSpan({ name: "getCustomerSearchResult" });
    try {
      return await getCustomerSearchResult(searchText);
    } finally {
      span.end();
    }
  })() : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-primary"><UsersRound className="size-4" /> Customer directory</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-[2.1rem]">Customers</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Find customer records, review contact details, and create a repair ticket from their profile.</p>
        </div>
        <Button asChild className="h-10 shrink-0 rounded-xl px-4 shadow-sm"><Link href="/customers/form"><UserRoundPlus className="size-4" /> Add customer</Link></Button>
      </div>

      {!searchText ? (
        <div className="grid gap-4 md:grid-cols-[1.35fr_0.65fr]">
          <div className="flex min-h-48 flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm sm:p-7">
            <div>
              <span className="grid size-11 place-items-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"><UsersRound className="size-5" /></span>
              <h2 className="mt-5 text-xl font-semibold tracking-tight">A better way to find a customer</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Search by name, phone, email, or location. Open a record to update details or create a new ticket.</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"><span>Names</span><span>Contact details</span><span>City and ZIP code</span></div>
          </div>
          <Link href="/tickets" className="group flex min-h-48 flex-col justify-between rounded-2xl border bg-slate-950 p-6 text-white shadow-sm transition-transform hover:-translate-y-0.5 dark:bg-slate-900 sm:p-7">
            <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-orange-300"><ArrowRight className="size-5" /></span>
            <span><span className="block text-lg font-semibold">Back to the workbench</span><span className="mt-1 block text-sm text-slate-300">View open tickets and active repairs.</span></span>
          </Link>
        </div>
      ) : null}

      <CustomerSearch />
      {results ? results.length ? <CustomerTable data={results} /> : (
        <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed bg-card px-6 py-10 text-center">
          <div><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><UsersRound className="size-5" /></span><h2 className="mt-4 font-semibold">No customers found</h2><p className="mt-1 text-sm text-muted-foreground">Try another name, phone number, email, or location.</p><Button asChild variant="link" className="mt-2"><Link href="/customers">Clear search</Link></Button></div>
        </div>
      ) : null}
    </div>
  );
};
export default Customers;
