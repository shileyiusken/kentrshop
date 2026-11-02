"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardClock, ClipboardList, LogOut, ShieldCheck, UsersRound, Wrench } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/tickets", label: "Tickets", icon: ClipboardList },
  { href: "/customers", label: "Customers", icon: UsersRound },
];

function NavigationLinks({ mobile = false, isManager = false, hasRole = true }: { mobile?: boolean; isManager?: boolean; hasRole?: boolean }) {
  const pathname = usePathname();
  const baseLinks = hasRole ? (isManager ? navigation : [navigation[0]]) : [];
  const links = isManager
    ? [...baseLinks, { href: "/roles", label: "Team & roles", icon: ShieldCheck }, { href: "/audit", label: "Audit trail", icon: ClipboardClock }]
    : baseLinks;

  return (
    <nav aria-label="Main navigation" className={cn(mobile ? "grid w-full grid-cols-2 gap-2" : "space-y-1")}>
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              mobile ? "min-w-0 justify-center" : "",
              active
                ? "bg-white/12 text-white shadow-sm"
                : "text-slate-300 hover:bg-white/8 hover:text-white",
            )}
          >
            <Icon className="size-[18px] shrink-0" strokeWidth={1.8} />
            <span>{label}</span>
            {active && !mobile ? <span className="ml-auto size-1.5 rounded-full bg-orange-400" /> : null}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Header({ isManager = false, hasRole = true }: { isManager?: boolean; hasRole?: boolean }) {
  return (
    <header className="workshop-sidebar flex shrink-0 flex-col border-b border-slate-700/70 bg-slate-950 text-white lg:sticky lg:top-0 lg:h-screen lg:w-[264px] lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-5 py-4 lg:px-6 lg:pb-8 lg:pt-7">
        <Link href="/tickets" className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-950/30">
            <Wrench className="size-5" strokeWidth={2.2} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight">Kent&apos;s Repair</span>
            <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">Workshop desk</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 lg:hidden">
          <ModeToggle />
          <Button variant="ghost" size="icon" asChild className="text-slate-300 hover:bg-white/10 hover:text-white">
            <LogoutLink aria-label="Sign out" title="Sign out"><LogOut /></LogoutLink>
          </Button>
        </div>
      </div>

      <div className="hidden px-4 lg:block">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
        <NavigationLinks isManager={isManager} hasRole={hasRole} />
      </div>

      <div className="px-4 pb-4 lg:hidden">
        <NavigationLinks mobile isManager={isManager} hasRole={hasRole} />
      </div>

      <div className="mt-auto hidden p-4 lg:block">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Shop is open
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-400">Daily, 9:00 am – 5:00 pm<br />Mukah, Sarawak</p>
        </div>
        <div className="mt-4 flex items-center justify-between px-2">
          <span className="text-xs text-slate-500">Appearance</span>
          <div className="flex items-center gap-1">
            <ModeToggle />
            <Button variant="ghost" size="icon" asChild className="text-slate-400 hover:bg-white/10 hover:text-white">
              <LogoutLink aria-label="Sign out" title="Sign out"><LogOut /></LogoutLink>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
