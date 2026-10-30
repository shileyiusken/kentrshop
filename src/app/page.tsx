import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, Phone, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 -z-20 bg-[url('/images/home-img.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
          <span className="grid size-10 place-items-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-950/30"><Wrench className="size-5" /></span>
          <span><span className="block text-sm font-semibold">Kent&apos;s Computer Repair</span><span className="block text-xs text-white/60">Mukah, Sarawak</span></span>
        </Link>
        <Button asChild variant="outline" className="rounded-xl border-white/20 bg-white/10 text-white shadow-none backdrop-blur hover:bg-white/20 hover:text-white">
          <Link href="/login">Staff sign in <ArrowUpRight className="size-4" /></Link>
        </Button>
      </header>

      <section className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-5 py-14 sm:px-8 lg:grid-cols-[1.1fr_0.7fr] lg:px-10 lg:py-20">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Local service, personal care
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Your computer,<br />
            <span className="text-orange-400">back in good hands.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
            Friendly computer repair and practical support for Mukah. Tell us what’s wrong and we’ll help get you moving again.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-xl bg-orange-500 px-6 text-base font-semibold shadow-lg shadow-orange-950/30 hover:bg-orange-400">
              <a href="tel:0168825069"><Phone className="size-4" /> Call 016-8825069</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-white/20 bg-white/10 px-6 text-white backdrop-blur hover:bg-white/20 hover:text-white">
              <a href="https://maps.google.com/?q=Lot+2354+Taman+Li+Hua+Mukah+Sarawak" target="_blank" rel="noreferrer">Get directions <ArrowUpRight className="size-4" /></a>
            </Button>
          </div>
        </div>

        <aside className="w-full max-w-md justify-self-start rounded-3xl border border-white/15 bg-slate-950/65 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 lg:justify-self-end">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-sm font-medium text-orange-300">Visit the workshop</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">We’re here to help.</h2></div>
            <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-orange-300"><Wrench className="size-5" /></span>
          </div>
          <div className="mt-7 space-y-5">
            <div className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 text-white/80"><MapPin className="size-4" /></span><div><p className="text-sm font-medium">Find us</p><address className="mt-1 text-sm not-italic leading-6 text-slate-300">Lot 2354, Taman Li Hua<br />Mukah City, Sarawak 96400</address></div></div>
            <div className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 text-white/80"><Clock3 className="size-4" /></span><div><p className="text-sm font-medium">Opening hours</p><p className="mt-1 text-sm leading-6 text-slate-300">Open daily, 9:00 am – 5:00 pm</p></div></div>
            <div className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 text-white/80"><Phone className="size-4" /></span><div><p className="text-sm font-medium">Call the shop</p><a href="tel:0168825069" className="mt-1 inline-block text-sm text-slate-300 transition-colors hover:text-white">016-8825069</a></div></div>
          </div>
          <div className="mt-7 border-t border-white/10 pt-5 text-xs leading-5 text-slate-400">Have a question? Give us a call and we’ll point you in the right direction.</div>
        </aside>
      </section>
      <footer className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 pb-5 text-xs text-white/50 sm:px-8 lg:px-10">
        <span>© {new Date().getFullYear()} Kent&apos;s Computer Repair</span><span>Locally serving Mukah</span>
      </footer>
    </main>
  );
}
