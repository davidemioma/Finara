import { useState } from "react";
import { AccountProps } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { cn, formUrlQuery, formatAmount } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

type Props = {
  accounts: AccountProps[];
  setValue?: (value: string) => void;
  className?: string;
};

const BankSelect = ({ accounts, setValue, className }: Props) => {
  const navigate = useNavigate();

  const urlSearchString = window.location.search;

  const searchParams = new URLSearchParams(urlSearchString);

  const [selected, setSeclected] = useState<AccountProps | undefined>(
    accounts[0],
  );

  const onClick = (id: string) => {
    const account = accounts.find((account) => account.dbBankId === Number(id));

    setSeclected(account);

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: id,
    });

    if (setValue) {
      setValue(id);
    }

    navigate({ to: newUrl });
  };

  return (
    <Select
      defaultValue={selected?.id}
      onValueChange={(value) => onClick(value)}
    >
      <SelectTrigger
        className={cn(
          "flex w-full max-w-[300px] items-center gap-3 bg-white",
          className,
        )}
      >
        <img
          src="icons/credit-card.svg"
          width={20}
          height={20}
          loading="lazy"
          alt="account"
        />

        <p className="line-clamp-1 w-full text-left">{selected?.name}</p>
      </SelectTrigger>

      <SelectContent
        className={cn("w-full max-w-[300px] bg-white", className)}
        align="end"
      >
        <SelectGroup>
          <SelectLabel className="py-2 font-normal text-gray-500">
            Select a bank to display
          </SelectLabel>

          {accounts.map((acc) => (
            <SelectItem key={acc.id} value={`${acc.dbBankId}`}>
              <div className="flex flex-col gap-1">
                <p className="text-[14px] font-medium leading-5">{acc.name}</p>

                <p className="text-[12px] font-medium leading-4 text-blue-600">
                  {formatAmount(acc.currentBalance)}
                </p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default BankSelect;
