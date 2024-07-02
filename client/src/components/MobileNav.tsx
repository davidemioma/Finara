import Logo from "./Logo";
import Footer from "./Footer";
import { cn } from "../lib/utils";
import PlaidLink from "./PlaidLink";
import { sidebarLinks } from "../lib/constants";
import { useQuery } from "@tanstack/react-query";
import { authUserQueryOptions } from "@/lib/api";
import { UserProps } from "@/server/lib/middleware";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Link, useLocation } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";

const MobileNav = () => {
  const { pathname } = useLocation();

  const { data: user, isLoading, isError } = useQuery(authUserQueryOptions);

  return (
    <div className="flex h-16 w-full items-center justify-between px-5 shadow-creditCard sm:px-8 lg:hidden">
      <Logo />

      <Sheet>
        <SheetTrigger>
          <HamburgerMenuIcon className="h-6 w-6" />
        </SheetTrigger>

        <SheetContent
          className="h-screen w-full max-w-[264px] sm:p-4 lg:hidden xl:p-6"
          side="left"
        >
          <div className="flex h-full w-full flex-col justify-between pt-8">
            <div className="flex flex-col gap-4">
              <Logo />

              {sidebarLinks.map((item) => {
                const isActive =
                  pathname === item.route ||
                  pathname.startsWith(`${item.route}/`);

                return (
                  <SheetClose asChild key={item.route}>
                    <Link
                      to={item.route}
                      className={cn(
                        "flex items-center gap-2 rounded-sm p-3",
                        isActive && "bg-bank-gradient",
                      )}
                    >
                      <img
                        className={cn(
                          "size-6",
                          isActive && "brightness-[3] invert-0",
                        )}
                        src={item.imgURL}
                        loading="lazy"
                        alt={item.label}
                      />

                      <p
                        className={cn(
                          "text-[12px] font-medium leading-[18px]",
                          isActive && "text-white",
                        )}
                      >
                        {item.label}
                      </p>
                    </Link>
                  </SheetClose>
                );
              })}

              {user && <PlaidLink user={user as UserProps} />}
            </div>

            {!isLoading && !isError && user && (
              <Footer user={user as UserProps} />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
