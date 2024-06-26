import React from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

type Props = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
  return (
    <div className="font-inter flex h-screen w-screen">
      <Sidebar />

      <main className="flex h-screen w-full flex-1 flex-col">
        <MobileNav />

        {children}
      </main>
    </div>
  );
};

export default AppLayout;
