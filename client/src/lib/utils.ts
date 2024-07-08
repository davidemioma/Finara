import qs from "query-string";
import { AccountTypes, TransactionProps } from "@/types";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAmount = (
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {},
) => {
  const { currency = "USD" } = options;

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(numericPrice);
};

export const formUrlQuery = ({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string;
}) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
};

export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case "depository":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, "");
};

export const getTransactionStatus = (date: Date) => {
  const today = new Date();

  const twoDaysAgo = new Date(today);

  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};

export type CategoryCount = {
  name: string;
  count: number;
  totalCount: number;
};

export const countTransactionCategories = (
  transactions: TransactionProps[],
): CategoryCount[] => {
  let totalCount = 0;

  const categoryCounts: { [category: string]: number } = {};

  transactions &&
    transactions.forEach((transaction) => {
      const category = transaction.category;

      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }

      totalCount++;
    });

  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
    (category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount,
    }),
  );

  // Sort the aggregatedCategories array by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
};

export const getRandomHexColor = () => {
  const r = Math.floor(Math.random() * 256);

  const g = Math.floor(Math.random() * 256);

  const b = Math.floor(Math.random() * 256);

  const hex = (c: any) => c.toString(16).padStart(2, "0");

  return `#${hex(r)}${hex(g)}${hex(b)}`;
};
