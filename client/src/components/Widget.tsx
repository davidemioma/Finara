import BankCard from "./BankCard";
import Category from "./Category";
import PlaidLink from "./PlaidLink";
import { UserProps } from "@/server/lib/middleware";
import { AccountProps, TransactionProps } from "@/types";
import { countTransactionCategories } from "@/lib/utils";

type Props = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  transactions: TransactionProps[];
  banks: AccountProps[];
};

const Widget = ({ user, transactions, banks }: Props) => {
  const categories = countTransactionCategories(transactions);

  return (
    <aside className="no-scrollbar hidden h-screen w-[360px] overflow-y-scroll border-l border-gray-200 xl:flex xl:flex-col">
      <div className="flex flex-col pb-8">
        <div className="h-[120px] w-full bg-gradient-mesh bg-cover bg-no-repeat" />

        <div className="relative px-6">
          <div className="absolute -top-8 flex h-[96px] w-[96px] items-center justify-center rounded-full border-8 border-white bg-gray-100 p-2 shadow-profile">
            <span className="text-5xl font-bold text-blue-500">
              {user?.firstName[0]}
            </span>
          </div>

          <div className="pt-20">
            <h1 className="text-[24px] font-semibold leading-8 text-gray-900">
              {user?.firstName} {user?.lastName}
            </h1>

            <p className="text-[16px] font-normal leading-6 text-gray-600">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-6 py-8">
        <div className="flex w-full items-center justify-between">
          <h2 className="header-2">My Banks</h2>

          <PlaidLink user={user as UserProps} />
        </div>

        {banks.length > 0 && (
          <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-5">
            <div className="absolute left-0 top-0 z-10 w-[90%]">
              <BankCard
                key={banks[0].id}
                account={banks[0]}
                username={`${user?.firstName} ${user?.lastName}`}
                showBalance={false}
              />
            </div>

            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <BankCard
                  key={banks[1].id}
                  account={banks[1]}
                  username={`${user?.firstName} ${user?.lastName}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-[200px] flex flex-1 flex-col gap-6 px-6 py-10">
        <h2 className="text-[18px] font-semibold leading-6">Top categories</h2>

        <div className="space-y-5">
          {categories.map((category) => (
            <Category key={category.name} category={category} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Widget;
