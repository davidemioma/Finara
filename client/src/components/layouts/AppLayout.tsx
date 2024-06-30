import React from "react";
import Sidebar from "../Sidebar";
import MobileNav from "../MobileNav";

type Props = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
  return (
    <div className="flex h-screen w-screen font-inter">
      <aside className="sticky inset-y-0 hidden h-screen w-[250px] border-r border-gray-200 bg-white pt-8 sm:p-4 lg:flex xl:w-[264px] xl:p-6">
        <Sidebar />
      </aside>

      <main className="flex h-screen w-full flex-1 flex-col">
        <MobileNav />

        {children}
      </main>
    </div>
  );
};

export default AppLayout;
