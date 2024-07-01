import { db } from "../db";
import { CountryCode } from "plaid";
import { banks } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { plaidClient } from "./plaid";

export type BankProps = {
  id: number;
  userId: number;
  bankId: string;
  accountId: string;
  accessToken: string;
  fundingSourceUrl: string;
  shareableId: string;
};

export const getBanks = async ({ userId }: { userId: number }) => {
  try {
    const allBanks = await db
      .select()
      .from(banks)
      .where(eq(banks.userId, userId));

    return allBanks;
  } catch (error) {
    console.log("GET_BANKS", error);

    return [];
  }
};

export const getBank = async ({
  userId,
  bankId,
}: {
  userId: number;
  bankId: string;
}) => {
  try {
    const bank = await db
      .select()
      .from(banks)
      .where(and(eq(banks.userId, userId), eq(banks.bankId, bankId)))
      .then((res) => res[0]);

    return bank;
  } catch (error) {
    console.log("GET_BANK", error);

    return null;
  }
};

export const getBankByAccId = async ({
  userId,
  accId,
}: {
  userId: number;
  accId: string;
}) => {
  try {
    const bank = await db
      .select()
      .from(banks)
      .where(and(eq(banks.userId, userId), eq(banks.accountId, accId)))
      .then((res) => res[0]);

    return bank;
  } catch (error) {
    console.log("GET_BANK_BY_ACCOUNT_ID", error);

    return null;
  }
};

export const getInstitution = async ({
  institutionId,
}: {
  institutionId: string;
}) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return intitution;
  } catch (error) {
    console.error("An error occurred while getting the institution:", error);

    return null;
  }
};

export const getTransactions = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  let hasMore = true;

  let transactions: any = [];

  try {
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return transactions;
  } catch (error) {
    console.error(
      "An error occurred while getting the account transactions:",
      error
    );

    return [];
  }
};
