import BankInfo from "./BankInfo";
import BankTabItem from "./BankTabItem";
import { Link } from "@tanstack/react-router";
import TransactionsTable from "./TransactionsTable";
import { AccountProps, TransactionProps } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  accounts: AccountProps[];
  transactions: TransactionProps[];
  bankId: string;
};

const RecentTransactions = ({ accounts, transactions, bankId }: Props) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[20px] font-semibold leading-6 text-gray-900 md:text-[24px] md:leading-7">
          RecentTransactions
        </h1>

        <Link
          to={`/transaction-history/?id=${bankId}`}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-[14px] font-semibold leading-5 text-gray-700"
        >
          View all
        </Link>
      </div>

      <Tabs defaultValue={bankId} className="w-full">
        <TabsList className="custom-scrollbar mb-5 flex w-full justify-start overflow-y-hidden overflow-x-scroll bg-transparent">
          {accounts.map((acc) => (
            <TabsTrigger
              key={acc.id}
              className="border-none bg-transparent shadow-none blur-none"
              value={`${acc.dbBankId}`}
            >
              <BankTabItem
                name={acc.name}
                active={bankId === `${acc.dbBankId}`}
                bankId={`${acc.dbBankId}`}
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((acc) => (
          <TabsContent
            key={acc.id}
            value={`${acc.dbBankId}`}
            className="space-y-4"
          >
            <BankInfo
              account={acc}
              active={bankId === `${acc.dbBankId}`}
              type="full"
            />

            <TransactionsTable transactions={transactions} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default RecentTransactions;
