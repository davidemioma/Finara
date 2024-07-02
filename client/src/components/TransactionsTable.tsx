import { format } from "date-fns";
import { TransactionProps } from "@/types";
import { transactionCategoryStyles } from "@/lib/constants";
import {
  cn,
  formatAmount,
  getTransactionStatus,
  removeSpecialCharacters,
} from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  transactions: TransactionProps[];
};

const CategoryBadge = ({ category }: { category: string }) => {
  const { borderColor, backgroundColor, textColor, chipBackgroundColor } =
    transactionCategoryStyles[
      category as keyof typeof transactionCategoryStyles
    ] || transactionCategoryStyles.default;

  return (
    <div
      className={cn(
        "flex w-fit items-center justify-center gap-1 truncate rounded-2xl border-[1.5px] py-0.5 pl-1.5 pr-2",
        borderColor,
        chipBackgroundColor,
      )}
    >
      <div className={cn("size-2 rounded-full", backgroundColor)} />

      <p className={cn("text-[12px] font-medium", textColor)}>{category}</p>
    </div>
  );
};

const TransactionsTable = ({ transactions }: Props) => {
  return (
    <Table>
      <TableCaption>A list of your recent transactions.</TableCaption>

      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transaction</TableHead>

          <TableHead className="px-2">Amount</TableHead>

          <TableHead className="px-2">Status</TableHead>

          <TableHead className="px-2">Date</TableHead>

          <TableHead className="px-2 max-md:hidden">Channel</TableHead>

          <TableHead className="px-2 max-md:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {transactions.map((transaction) => {
          const amount = formatAmount(transaction.amount);

          const isDebit = transaction.type === "debit";

          const isCredit = transaction.type === "credit";

          const status = getTransactionStatus(new Date(transaction.date));

          return (
            <TableRow
              key={transaction.id}
              className={cn(
                "!border-b",
                isDebit || amount[0] === "-" ? "bg-[#FFFBFA]" : "bg-[#F6FEF9]",
              )}
            >
              <TableCell className="max-w-[250px] truncate pl-2 pr-10 text-[14px] font-semibold leading-5 text-[#344054]">
                {removeSpecialCharacters(transaction.name)}
              </TableCell>

              <TableCell
                className={cn(
                  "pl-2 pr-10 font-semibold",
                  isDebit || amount[0] === "-"
                    ? "text-[#f04438]"
                    : "text-[#039855]",
                )}
              >
                {isDebit ? `-${amount}` : isCredit ? amount : amount}
              </TableCell>

              <TableCell className="pl-2 pr-10">
                <CategoryBadge category={status} />
              </TableCell>

              <TableCell className="text-xs">
                {format(new Date(transaction.date), "eee, MMMM d, HH:mm a")}
              </TableCell>

              <TableCell className="min-w-24 pl-2 pr-10 text-xs capitalize max-md:hidden">
                {transaction.paymentChannel}
              </TableCell>

              <TableCell className="pl-2 pr-10 text-xs max-md:hidden">
                <CategoryBadge category={transaction.category} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;
