import { AccountProps } from "@/types";
import PriceChart from "./charts/PriceChart";
import AnimatedCounter from "./AnimatedCounter";

type Props = {
  accounts: AccountProps[];
  totalBanks: number;
  totalCurrentBalance: number;
};

const TotalBalanceBox = ({
  accounts,
  totalBanks,
  totalCurrentBalance,
}: Props) => {
  return (
    <section className="w-full rounded-xl border border-gray-200 p-4 shadow-chart sm:p-6">
      <div className="flex items-center gap-4 sm:gap-6">
        {accounts && (
          <div className="flex size-full max-w-[100px] items-center sm:max-w-[120px]">
            <PriceChart accounts={accounts} />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-6">
          <div className="flex w-full items-center justify-between gap-4">
            <h2 className="text-[16px] font-semibold leading-[24px]">
              Bank Accounts: {totalBanks}
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-medium leading-[20px]">
              Total Current Balance
            </p>

            <div className="text-[30px] font-semibold leading-[38px]">
              <AnimatedCounter amount={totalCurrentBalance} prefix="$" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
