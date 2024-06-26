import AnimatedCounter from "./AnimatedCounter";
import DoughnutChart from "./charts/DoughnutChart";

type Props = {
  accounts: [];
  totalBanks: number;
  totalCurrentBalance: number;
};

const TotalBalanceBox = ({
  accounts,
  totalBanks,
  totalCurrentBalance,
}: Props) => {
  return (
    <section className="shadow-chart w-full rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex size-full max-w-[100px] items-center sm:max-w-[120px]">
          <DoughnutChart accounts={accounts} />
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <div className="flex w-full items-center justify-between gap-4">
            <h2 className="text-[16px] font-semibold leading-[24px]">
              Bank Accounts: {totalBanks}
            </h2>

            <button>Add bank</button>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-medium leading-[20px]">
              Total Current Balance
            </p>

            <div className="text-[30px] font-semibold leading-[38px]">
              <AnimatedCounter amount={totalCurrentBalance} prefix="£" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
