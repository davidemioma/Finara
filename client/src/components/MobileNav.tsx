import Logo from "./Logo";
import Sidebar from "./Sidebar";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";

const MobileNav = () => {
  return (
    <div className="shadow-creditCard flex h-16 w-full items-center justify-between px-5 sm:px-8 lg:hidden">
      <Logo />

      <Sheet>
        <SheetTrigger>
          <HamburgerMenuIcon className="h-6 w-6" />
        </SheetTrigger>

        <SheetContent
          className="h-screen w-full max-w-[264px] sm:p-4 lg:hidden xl:p-6"
          side="left"
        >
          <div className="h-full pt-8">
            <Sidebar />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
