import SearchButton from "@/components/SearchButton";
import { Input } from "@/components/ui/input";
import Form from "next/form";
import { Search } from "lucide-react";

export default function CustomerSearch() {
  return (
    <section className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
      <Form action="/customers" className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="customer-search" className="sr-only">Search customers</label>
        <div className="relative min-w-0 flex-1">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="customer-search"
            name="searchText"
            type="search"
            placeholder="Search by name, email, phone, or location"
            className="h-11 rounded-xl bg-background pl-10 shadow-none"
          />
        </div>
        <SearchButton />
      </Form>
      <p className="mt-2 hidden pl-1 text-xs text-muted-foreground sm:block">Find a customer to view their details or start a new repair ticket.</p>
    </section>
  );
}
