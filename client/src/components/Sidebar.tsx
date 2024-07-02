import Logo from "./Logo";
import Footer from "./Footer";
import { cn } from "../lib/utils";
import PlaidLink from "./PlaidLink";
import { sidebarLinks } from "../lib/constants";
import { useQuery } from "@tanstack/react-query";
import { authUserQueryOptions } from "@/lib/api";
import { UserProps } from "@/server/lib/middleware";
import { Link, useLocation } from "@tanstack/react-router";

const Sidebar = () => {
  const { pathname } = useLocation();

  const { data: user, isLoading, isError } = useQuery(authUserQueryOptions);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="flex flex-col gap-4">
        <Logo />

        {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link
              to={item.route}
              key={item.route}
              className={cn(
                "flex items-center gap-2 rounded-sm p-3",
                isActive && "bg-bank-gradient",
              )}
            >
              <img
                className={cn("size-6", isActive && "brightness-[3] invert-0")}
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
          );
        })}

        {user && <PlaidLink user={user as UserProps} />}
      </div>

      {!isLoading && !isError && user && <Footer user={user as UserProps} />}
    </div>
  );
};

export default Sidebar;
