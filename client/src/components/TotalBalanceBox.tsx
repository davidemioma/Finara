import { AccountProps } from "@/types";
import { Link } from "@tanstack/react-router";
import AnimatedCounter from "./AnimatedCounter";
import DoughnutChart from "./charts/DoughnutChart";

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
        <div className="flex size-full max-w-[100px] items-center sm:max-w-[120px]">
          <DoughnutChart accounts={accounts} />
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <div className="flex w-full items-center justify-between gap-4">
            <h2 className="text-[16px] font-semibold leading-[24px]">
              Bank Accounts: {totalBanks}
            </h2>

            <Link href="/" className="hidden gap-2 sm:flex">
              <img src="/icons/plus.svg" width={20} height={20} alt="plus" />

              <h2 className="text-14 font-semibold text-gray-600">Add Bank</h2>
            </Link>
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
