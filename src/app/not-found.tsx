import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export const metadata = {
  title: "Page Not Found",
};
export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-sm sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground"><SearchX className="size-6" /></span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary">404 · Page not found</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">We couldn’t find that page.</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">The link may be outdated, or the page may have moved.</p>
        <Button asChild className="mt-6 rounded-xl"><Link href="/tickets"><ArrowLeft className="size-4" /> Back to the workshop</Link></Button>
      </div>
    </div>
  );
}
