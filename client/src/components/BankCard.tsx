import Copy from "./Copy";
import { AccountProps } from "@/types";
import { Link } from "@tanstack/react-router";
import { formatAmount } from "../lib/utils";

type Props = {
  username: string;
  account: AccountProps;
  showBalance?: boolean;
};

const BankCard = ({ username, account, showBalance = true }: Props) => {
  return (
    <div className="w-full">
      <Link to={`/transaction-history?id=${account.dbBankId}`}>
        <div className="flex h-[190px] w-full justify-between rounded-[20px] border border-white bg-bank-gradient shadow-creditCard backdrop-blur-[6px]">
          <div className="flex h-full w-full flex-1 flex-col justify-between rounded-l-[20px] bg-gray-700 bg-bank-gradient px-5 pb-4 pt-5">
            <div>
              <h1 className="text-[16px] font-semibold leading-5 text-white">
                {account.name}
              </h1>

              {showBalance && (
                <p className="font-ibm-plex-serif font-black text-white">
                  {formatAmount(account.currentBalance, { currency: "GBP" })}
                </p>
              )}
            </div>

            <article className="flex flex-col gap-2">
              <div className="flex justify-between">
                <h1 className="text-[12px] font-semibold leading-4 text-white">
                  {username}
                </h1>

                <h2 className="text-[12px] font-semibold leading-4 text-white">
                  ●● / ●●
                </h2>
              </div>

              <p className="whitespace-nowrap text-[12px] font-semibold leading-3 tracking-[1.1px] text-white">
                ●●●● ●●●● ●●●●{" "}
                <span className="text-[12px] leading-3">{account?.mask}</span>
              </p>
            </article>
          </div>

          <div className="flex flex-col items-end justify-between rounded-r-[20px] bg-bank-gradient bg-cover bg-center bg-no-repeat py-5 pr-5">
            <img
              src="/icons/Paypass.svg"
              loading="lazy"
              width={20}
              height={24}
              alt="pay"
            />

            <img
              className="ml-10"
              src="/icons/mastercard.svg"
              width={45}
              height={32}
              alt="mastercard"
              loading="lazy"
            />
          </div>

          <img
            className="absolute left-0 top-0"
            src="/icons/lines.png"
            width={316}
            height={190}
            alt="lines"
            loading="lazy"
          />
        </div>
      </Link>

      {showBalance && <Copy title={account.sharaebleId} />}
    </div>
  );
};

export default BankCard;
