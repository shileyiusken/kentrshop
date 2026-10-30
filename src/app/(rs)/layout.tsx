import Header from "@/components/Header";
import React from "react";

type Props = {
  children: React.ReactNode;
};
const RSLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <Header />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        <div className="mx-auto w-full max-w-[1440px]">{children}</div>
      </main>
    </div>
  );
};
export default RSLayout;
