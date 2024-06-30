import LogoutBtn from "./LogoutBtn";
import { UserProps } from "@/server/lib/middleware";

type Props = {
  user: UserProps;
};

const Footer = ({ user }: Props) => {
  return (
    <footer className="flex items-center justify-between gap-2 overflow-hidden pb-2 pt-6">
      <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
        <p className="text-xl font-bold capitalize text-gray-700">
          {user?.firstName[0]}
        </p>
      </div>

      <div className="w-16 flex-1">
        <h1 className="truncate text-[14px] font-semibold leading-5 text-gray-700">
          {user.firstName}
        </h1>

        <p className="truncate text-[14px] font-normal leading-5 text-gray-600">
          {user.email}
        </p>
      </div>

      <LogoutBtn />
    </footer>
  );
};

export default Footer;
