import { db } from "../db";
import { Hono } from "hono";
import { plaidClient } from "../lib/plaid";
import { verifyUser } from "../lib/middleware";
import {
  getBanks,
  type BankProps,
  getInstitution,
  getBank,
  getFewTransactions,
} from "../lib/bank";

export const bankRoute = new Hono()
  .get("/accounts", verifyUser, async (c) => {
    const user = c.var.user;

    // get banks from db
    const banks = await getBanks({ userId: user.id });

    const accounts = await Promise.all(
      banks?.map(async (bank: BankProps) => {
        // get each account info from plaid
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });

        const accountData = accountsResponse.data.accounts[0];

        // get institution info from plaid
        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!,
        });

        const account = {
          id: accountData.account_id,
          dbBankId: bank.id,
          name: accountData.name,
          officialName: accountData.official_name,
          sharaebleId: bank.shareableId,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          institutionId: institution?.institution_id,
          mask: accountData.mask!,
          type: accountData.type as string,
          subtype: accountData.subtype! as string,
        };

        return account;
      })
    );

    const totalBanks = accounts.length;

    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return c.json({ accounts, totalBanks, totalCurrentBalance }, 200);
  })
  .get("/account/:bankId", verifyUser, async (c) => {
    const user = c.var.user;

    const { bankId } = c.req.param();

    // get bank from db
    const bank = await getBank({ userId: user.id, bankId: Number(bankId) });

    if (!bank) {
      return c.json({ error: "Bank not found" }, 404);
    }

    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank?.accessToken,
    });

    if (!accountsResponse) {
      return c.json({ error: "Something went wrong" }, 400);
    }

    const accountData = accountsResponse.data.accounts[0];

    // get transfer transactions from db

    // get institution info from plaid
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    if (!institution) {
      return c.json({ error: "Something went wrong" }, 400);
    }

    const transactions = await getFewTransactions({
      accessToken: bank?.accessToken,
    });

    const account = {
      id: accountData.account_id,
      dbBankId: bank.id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution?.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
    };

    // sort transactions by date such that the most recent transaction is first
    const allTransactions = [...transactions, ...[]].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return c.json({ account, transactions: allTransactions }, 200);
  });
