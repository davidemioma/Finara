import Widget from "../../components/Widget";
import Heading from "../../components/Heading";
import AppLayout from "../../components/layouts/AppLayout";
import { createFileRoute } from "@tanstack/react-router";
import TotalBalanceBox from "../../components/TotalBalanceBox";

export const Route = createFileRoute("/_authenticated/")({
  component: () => {
    return (
      <AppLayout>
        <div className="no-scrollbar flex h-screen w-full overflow-y-scroll">
          <div className="page-container">
            <Heading
              type="greeting"
              title="Welcome,"
              user="Guest"
              subtitle="Access and manage your account and transactions efficiently."
            />

            <TotalBalanceBox
              accounts={[]}
              totalBanks={1}
              totalCurrentBalance={2600}
            />
          </div>

          <Widget
            user={{
              firstName: "David",
              lastName: "Emioma",
              email: "davidemiomauche@gmail.com",
            }}
            transactions={[]}
            banks={[
              { id: "1", name: "DAVID", currentBalance: 1000, mask: 123 },
              { id: "2", name: "E.DAVID", currentBalance: 2300.9, mask: 456 },
            ]}
          />
        </div>
      </AppLayout>
    );
  },
});
