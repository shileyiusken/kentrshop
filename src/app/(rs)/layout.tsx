import Header from "@/components/Header";
import React from "react";
import { getCurrentStaff } from "@/lib/staff";
import { Button } from "@/components/ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { LogOut, ShieldAlert } from "lucide-react";

type Props = {
  children: React.ReactNode;
};
const RSLayout = async ({ children }: Props) => {
  const staff = await getCurrentStaff();
  if (!staff?.role) {
    return (
      <div className="min-h-screen bg-background lg:flex">
        <Header hasRole={false} />
        <main className="grid min-w-0 flex-1 place-items-center px-4 py-10 sm:px-6">
          <section className="max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm">
            <ShieldAlert className="mx-auto size-9 text-muted-foreground" />
            <h1 className="mt-4 text-xl font-semibold">Workspace access not assigned</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Ask a manager to assign you the Manager or Technician role, then sign in again.</p>
            <Button asChild variant="outline" className="mt-5 rounded-xl"><LogoutLink><LogOut className="size-4" /> Sign out</LogoutLink></Button>
          </section>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background lg:flex">
      <Header isManager={staff?.role === "manager"} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        <div className="mx-auto w-full max-w-[1440px]">{children}</div>
      </main>
    </div>
  );
};
export default RSLayout;
