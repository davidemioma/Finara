import Logo from "./Logo";
import { cn } from "../lib/utils";
import { Settings } from "lucide-react";
import { sidebarLinks } from "../lib/constants";
import { Link, useLocation } from "@tanstack/react-router";
import LogoutBtn from "./LogoutBtn";

const Sidebar = () => {
  const { pathname } = useLocation();

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

        <div>User</div>

        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-2 rounded-sm p-3",
            pathname === "/settings" ||
              (pathname.startsWith("/settings/") && "bg-bank-gradient"),
          )}
        >
          <Settings />

          <p
            className={cn(
              "text-[12px] font-medium leading-[18px]",
              pathname === "/settings" ||
                (pathname.startsWith("/settings/") && "text-white"),
            )}
          >
            Settings
          </p>
        </Link>
      </div>

      <div>
        <LogoutBtn>Logout</LogoutBtn>
      </div>
    </div>
  );
};

export default Sidebar;
