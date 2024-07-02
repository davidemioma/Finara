import Widget from "../../components/Widget";
import Heading from "../../components/Heading";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "../../components/layouts/AppLayout";
import { createFileRoute } from "@tanstack/react-router";
import TotalBalanceBox from "../../components/TotalBalanceBox";
import RecentTransactions from "@/components/RecentTransactions";
import TotalBoxSkeleton from "@/components/skeletons/TotalBoxSkeleton";
import { authUserQueryOptions, accountsQueryOptions, api } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/")({
  component: () => {
    const urlSearchString = window.location.search;

    const searchParams = new URLSearchParams(urlSearchString);

    const id = searchParams.get("id") || undefined;

    const { data: user, isLoading, isError } = useQuery(authUserQueryOptions);

    const {
      data,
      isLoading: accsLoading,
      isError: accsErr,
    } = useQuery(accountsQueryOptions);

    const bankId = id || `${data?.accounts?.[0].dbBankId}`;

    const { data: accountData, isLoading: accLoading } = useQuery({
      queryKey: ["get-first-account", bankId],
      queryFn: async () => {
        if (!bankId) return;

        const res = await api.bank.account[":bankId"].$get({
          param: {
            bankId,
          },
        });

        if (!res.ok) {
          throw new Error("Something went wrong");
        }

        return res.json();
      },
    });

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
              accLoading && <div>Transactions Skeleton</div>
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
