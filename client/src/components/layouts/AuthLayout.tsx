import React from "react";
import Logo from "../Logo";

type Props = {
  children: React.ReactNode;
  title: string;
  subTitle: string;
};

const AuthLayout = ({ children, title, subTitle }: Props) => {
  return (
    <div className="no-scrollbar relative grid w-full lg:grid-cols-2">
      <div className="flex min-h-screen w-full items-center justify-center overflow-scroll px-4 py-10 sm:px-6">
        <div className="flex h-full w-full max-w-[420px] flex-col justify-center gap-5 md:gap-8">
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

      <div className="sticky top-0 h-screen w-full bg-sky-1 max-lg:hidden">
        <div className="flex h-full w-full items-center justify-end">
          <img
            className="rounded-l-xl object-contain"
            src="/icons/auth-image.svg"
            width={500}
            height={500}
            loading="lazy"
            alt="Auth image"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
