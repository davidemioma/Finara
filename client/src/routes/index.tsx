import Heading from "../components/Heading";
import AppLayout from "../components/AppLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
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
          </div>

          <div>widget</div>
        </div>
      </AppLayout>
    );
  },
});
