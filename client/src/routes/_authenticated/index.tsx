import Widget from "../../components/Widget";
import Heading from "../../components/Heading";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "../../components/layouts/AppLayout";
import { createFileRoute } from "@tanstack/react-router";
import TotalBalanceBox from "../../components/TotalBalanceBox";
import TotalBoxSkeleton from "@/components/skeletons/TotalBoxSkeleton";
import { authUserQueryOptions, accountsQueryOptions, api } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/")({
  component: () => {
    const { data: user, isLoading, isError } = useQuery(authUserQueryOptions);

    const {
      data,
      isLoading: accsLoading,
      isError: accsErr,
    } = useQuery(accountsQueryOptions);

    const { data: accountData } = useQuery({
      queryKey: ["get-first-account", data?.accounts?.[0].id],
      queryFn: async () => {
        const bankId = data?.accounts?.[0].id;

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
          </div>

          {!isLoading && !isError && user && data && accountData && (
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
