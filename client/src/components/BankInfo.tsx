import { AccountProps, AccountTypes } from "@/types";
import { cn, formatAmount, getAccountTypeColors } from "@/lib/utils";

type Props = {
  active: boolean;
  account: AccountProps;
  type: "full" | "card";
};

const BankInfo = ({ account, active, type }: Props) => {
  const colors = getAccountTypeColors(account?.type as AccountTypes);

  return (
    <div
      className={cn(
        `flex w-full gap-5 rounded-lg border border-transparent bg-blue-25 p-4 transition-all ${colors.bg}`,
        {
          "border-blue-700 shadow-sm": type === "card" && active,
          "rounded-xl": type === "card",
          "cursor-pointer hover:shadow-sm": type === "card",
        },
      )}
      onClick={() => {}}
    >
      <figure
        className={`flex-center h-fit rounded-full bg-blue-100 ${colors.lightBg}`}
      >
        <img
          className="m-2 min-w-5"
          src="/icons/connect-bank.svg"
          width={20}
          height={20}
          alt={account.subtype}
          loading="lazy"
        />
      </figure>

      <div className="flex w-full flex-1 flex-col justify-center gap-1">
        <div className="flex items-center justify-between">
          <h2
            className={`line-clamp-1 flex-1 text-[16px] font-bold leading-5 text-blue-900 ${colors.title}`}
          >
            {account.name}
          </h2>

          {type === "full" && (
            <p
              className={`rounded-full px-3 py-1 text-[12px] font-medium leading-4 text-blue-700 ${colors.subText} ${colors.lightBg}`}
            >
              {account.subtype}
            </p>
          )}
        </div>

        <p
          className={`text-[16px] font-medium leading-5 text-blue-700 ${colors.subText}`}
        >
          {formatAmount(account.currentBalance)}
        </p>
      </div>
    </div>
  );
};

export default BankInfo;
