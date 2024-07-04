import Heading from "@/components/Heading";
import BankCard from "@/components/BankCard";
import useAccount from "@/hooks/use-account";
import ErrorCard from "@/components/ErrorCard";
import AppLayout from "@/components/layouts/AppLayout";
import { createFileRoute } from "@tanstack/react-router";
import CardSkeletons from "@/components/skeletons/CardSkeletons";

export const Route = createFileRoute("/_authenticated/my-banks")({
  component: () => {
    const { data, accsLoading, accsErr, user } = useAccount();

    return (
      <AppLayout>
        <div className="no-scrollbar flex h-screen w-full flex-col gap-8 overflow-y-scroll bg-gray-25 p-8 xl:py-12">
          <Heading
            type="title"
            title="My Bank Accounts"
            subtitle="Effortlessly manage your banking activities."
          />

          {!accsLoading && !accsErr && user && data ? (
            <div className="flex w-full flex-col gap-6">
              <h2 className="text-[18px] font-semibold leading-6">
                Your Cards
              </h2>

              <div className="flex flex-wrap gap-6">
                {data.accounts.map((acc) => (
                  <div key={acc.id} className="w-full max-w-[320px]">
                    <BankCard account={acc} username={user.firstName} />
                  </div>
                ))}
              </div>
            </div>
          ) : accsLoading ? (
            <CardSkeletons />
          ) : (
            accsErr && (
              <ErrorCard message="Something went wrong! could not get cards" />
            )
          )}
        </div>
      </AppLayout>
    );
  },
});
