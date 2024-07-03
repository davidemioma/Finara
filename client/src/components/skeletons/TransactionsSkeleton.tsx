import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  tableNumber?: number;
};

const TransactionsSkeleton = ({ tableNumber = 5 }: Props) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-7 w-60" />

        <Skeleton className="h-7 w-20" />
      </div>

      <div className="w-full space-y-5">
        <Skeleton className="h-7 w-full" />

        <Skeleton className="h-20 w-full" />
      </div>

      <Table>
        <TableHeader className="bg-[#f9fafb]">
          <TableRow>
            <TableHead>
              <Skeleton className="h-6 w-28" />
            </TableHead>

            <TableHead>
              <Skeleton className="h-6 w-28" />
            </TableHead>

            <TableHead>
              <Skeleton className="h-6 w-28" />
            </TableHead>

            <TableHead>
              <Skeleton className="h-6 w-28" />
            </TableHead>

            <TableHead className="max-md:hidden">
              <Skeleton className="h-6 w-28" />
            </TableHead>

            <TableHead className="max-md:hidden">
              <Skeleton className="h-6 w-28" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {new Array(tableNumber).fill("").map((_, i) => {
            return (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-6 w-28" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-6 w-28" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-6 w-28" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-6 w-28" />
                </TableCell>

                <TableCell className="max-md:hidden">
                  <Skeleton className="h-6 w-28" />
                </TableCell>

                <TableCell className="max-md:hidden">
                  <Skeleton className="h-6 w-28" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsSkeleton;
