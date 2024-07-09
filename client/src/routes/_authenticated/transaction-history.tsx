import { api } from "@/lib/api";
import { formatAmount } from "@/lib/utils";
import Heading from "@/components/Heading";
import useAccount from "@/hooks/use-account";
import ErrorCard from "@/components/ErrorCard";
import BankSelect from "@/components/BankSelect";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/components/Pagination";
import AppLayout from "@/components/layouts/AppLayout";
import { createFileRoute } from "@tanstack/react-router";
import TransactionsTable from "@/components/TransactionsTable";
import TotalBoxSkeleton from "@/components/skeletons/TotalBoxSkeleton";
import TransactionsSkeleton from "@/components/skeletons/TransactionsSkeleton";
import { TRANSACTIONSPERPAGE } from "../../../../server/lib/validators/transfer";

export const Route = createFileRoute("/_authenticated/transaction-history")({
  component: () => {
    const {
      bankId,
      accountData,
      accLoading,
      accErr,
      data: banks,
      page,
    } = useAccount();

    const { data, isLoading, isError } = useQuery({
      queryKey: ["get-transactions-by-bank", bankId, page],
      queryFn: async () => {
        const res = await api.transaction[":bankId"][":page"].$get({
          param: {
            bankId,
            page: page || "1",
          },
        });

        if (!res.ok) {
          const data = await res.json();

          throw new Error(data.error);
        }

        const data = await res.json();

        return data;
      },
      staleTime: Infinity,
    });

    return (
      <AppLayout>
        <div className="no-scrollbar flex h-screen w-full flex-col gap-8 overflow-y-scroll bg-gray-25 p-8 xl:py-12">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <Heading
              type="title"
              title="Transaction History,"
              subtitle="See your bank details and transactions."
            />

            {banks && <BankSelect accounts={banks.accounts} />}
          </div>

          {!accLoading && !accErr && accountData ? (
            <div className="flex flex-col gap-4 rounded-lg border-y bg-blue-600 px-4 py-5 text-white md:flex-row md:justify-between">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-bold leading-5 sm:text-[18px]">
                  {accountData?.account?.name}
                </h2>

                <p className="text-xs leading-4 text-blue-25 sm:text-[14px]">
                  {accountData.account?.officialName}
                </p>

                <p className="text-xs font-semibold leading-4 tracking-[1.1px] sm:text-[14px]">
                  ●●●● ●●●● ●●●● {accountData.account?.mask}
                </p>
              </div>

              <div className="flex flex-col gap-2 rounded-md bg-blue-25/20 px-4 py-2 md:w-fit">
                <p className="text-center text-[14px] leading-4">
                  Current balance
                </p>

                <p className="text-center text-[24px] font-bold leading-7">
                  {formatAmount(accountData.account?.currentBalance || 0)}
                </p>
              </div>
            </div>
          ) : (
            accLoading && <TotalBoxSkeleton />
          )}

          {!isLoading && !isError && data?.transactions ? (
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full items-center justify-between">
                <h2 className="text-[18px] font-semibold leading-6">
                  Transactions
                </h2>
              </div>

              <TransactionsTable transactions={data.transactions} />

              {data.totalTransactions.count > TRANSACTIONSPERPAGE && (
                <Pagination
                  page={Number(page) || 1}
                  totalPages={
                    data?.totalTransactions.count / TRANSACTIONSPERPAGE
                  }
                />
              )}
            </div>
          ) : isLoading ? (
            <TransactionsSkeleton />
          ) : (
            isError && (
              <ErrorCard message="Something went wrong! can't get transactions." />
            )
          )}
        </div>
      </AppLayout>
    );
  },
});
