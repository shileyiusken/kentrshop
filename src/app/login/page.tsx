import Link from "next/link";
import { ArrowLeft, ClipboardList, Wrench } from "lucide-react";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-[1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute inset-0 bg-[url('/images/home-img.jpg')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-slate-900/70" />
        <Link href="/" className="relative flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-orange-500"><Wrench className="size-5" /></span><span className="text-sm font-semibold">Kent&apos;s Repair</span></Link>
        <div className="relative max-w-lg pb-10">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-300"><ClipboardList className="size-4" /> Workshop workspace</p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight tracking-tight">Good work starts with a clear view.</h1>
          <p className="mt-5 text-base leading-7 text-slate-300">Sign in to manage repair tickets and keep customer details organized.</p>
        </div>
        <p className="relative text-xs text-slate-500">Mukah, Sarawak · Open daily, 9 am – 5 pm</p>
      </section>

      <section className="flex min-h-dvh flex-col px-5 py-6 sm:px-10 lg:px-14">
        <Link href="/" className="inline-flex items-center gap-2 self-start text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4" /> Back to shop</Link>
        <div className="mx-auto my-auto w-full max-w-md py-12">
          <div className="mb-8 grid size-12 place-items-center rounded-2xl bg-accent text-primary lg:hidden"><Wrench className="size-5" /></div>
          <p className="text-sm font-semibold text-primary">Kent&apos;s Computer Repair</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Sign in to continue to the workshop desk.</p>
          <div className="mt-8 space-y-3">
            <Button asChild size="lg" className="h-12 w-full rounded-xl text-sm font-semibold shadow-sm"><LoginLink>Sign in to your account</LoginLink></Button>
            <p className="pt-2 text-center text-sm text-muted-foreground">New to the team? <RegisterLink className="font-medium text-primary underline-offset-4 hover:underline">Create an account</RegisterLink></p>
          </div>
          <div className="mt-8 rounded-xl border bg-card p-4 text-sm leading-6 text-muted-foreground">
            Need help accessing the workspace? <a className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground" href="tel:0168825069">Call the shop</a>.
          </div>
        </div>
        <p className="mt-auto text-center text-xs text-muted-foreground">Secure staff access · Kent&apos;s Computer Repair</p>
      </section>
    </main>
  );
}
