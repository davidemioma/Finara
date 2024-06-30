import Widget from "../../components/Widget";
import Heading from "../../components/Heading";
import { useQuery } from "@tanstack/react-query";
import { authUserQueryOptions } from "@/lib/api";
import AppLayout from "../../components/layouts/AppLayout";
import { createFileRoute } from "@tanstack/react-router";
import TotalBalanceBox from "../../components/TotalBalanceBox";

export const Route = createFileRoute("/_authenticated/")({
  component: () => {
    const { data: user, isLoading, isError } = useQuery(authUserQueryOptions);

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

            <TotalBalanceBox
              accounts={[]}
              totalBanks={1}
              totalCurrentBalance={2600}
            />
          </div>

          {!isLoading && !isError && user && (
            <Widget
              user={{
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              }}
              transactions={[]}
              banks={[
                { id: "1", name: "DAVID", currentBalance: 1000, mask: 123 },
                { id: "2", name: "E.DAVID", currentBalance: 2300.9, mask: 456 },
              ]}
            />
          )}
        </div>
      </AppLayout>
    );
  },
});
