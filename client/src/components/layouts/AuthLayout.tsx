import React from "react";
import Logo from "../Logo";

type Props = {
  children: React.ReactNode;
  title: string;
  subTitle: string;
};

const AuthLayout = ({ children, title, subTitle }: Props) => {
  return (
    <div className="grid h-screen w-screen lg:grid-cols-2">
      <div className="flex w-full items-center justify-center px-4 sm:px-6">
        <div className="flex h-full w-full max-w-[420px] flex-col justify-center gap-5 py-10 md:gap-8">
          <Logo size="lg" />

          <div className="flex flex-col gap-1 md:gap-3">
            <h1 className="text-[36px] font-semibold leading-[44px]">
              {title}
            </h1>

            <p className="text-[16px] font-normal leading-[24px]">{subTitle}</p>
          </div>

          {children}
        </div>
      </div>

      <div className="bg-sky-1 w-full max-lg:hidden">Image</div>
    </div>
  );
};

export default AuthLayout;
