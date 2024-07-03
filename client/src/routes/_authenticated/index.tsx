import useAccount from "@/hooks/use-account";
import Widget from "../../components/Widget";
import Heading from "../../components/Heading";
import AppLayout from "../../components/layouts/AppLayout";
import { createFileRoute } from "@tanstack/react-router";
import TotalBalanceBox from "../../components/TotalBalanceBox";
import RecentTransactions from "@/components/RecentTransactions";
import TotalBoxSkeleton from "@/components/skeletons/TotalBoxSkeleton";
import TransactionsSkeleton from "@/components/skeletons/TransactionsSkeleton";

export const Route = createFileRoute("/_authenticated/")({
  component: () => {
    const {
      bankId,
      user,
      data,
      accsLoading,
      accsErr,
      accountData,
      accLoading,
      isLoading,
      isError,
    } = useAccount();

    return (
      <AppLayout>
        <div className="no-scrollbar flex h-screen w-full overflow-y-scroll">
          <div className="page-container">
            <Heading
              type="greeting"
              title="Welcome,"
              user={user?.firstName || "Guest"}
              subtitle="Access and manage your account and transactions efficiently."
            />

            {!accsLoading && !accsErr && data ? (
              <TotalBalanceBox
                accounts={data?.accounts}
                totalBanks={data?.totalBanks}
                totalCurrentBalance={data?.totalCurrentBalance}
              />
            ) : (
              accsLoading && <TotalBoxSkeleton />
            )}

            {!accsLoading && !accsErr && data && bankId ? (
              <RecentTransactions
                accounts={data?.accounts}
                transactions={accountData?.transactions || []}
                bankId={bankId}
              />
            ) : (
              accLoading && <TransactionsSkeleton />
            )}
          </div>

          {!isLoading && !isError && user && data && (
            <Widget
              user={{
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              }}
              transactions={accountData?.transactions || []}
              banks={data.accounts.slice(0, 2)}
            />
          )}
        </div>
      </AppLayout>
    );
  },
});
