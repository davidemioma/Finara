import { db } from "../db";
import { Hono } from "hono";
import { banks } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { verifyUser } from "../lib/middleware";
import { getTransactions } from "../lib/bank";

export const transactionRoute = new Hono().get(
  "/:bankId",
  verifyUser,
  async (c) => {
    const user = c.var.user;

    const { bankId } = c.req.param();

    if (!bankId) {
      return c.json({ error: "Bank ID not found" }, 404);
    }

    const bank = await db
      .select({
        id: banks.id,
        accessToken: banks.accessToken,
      })
      .from(banks)
      .where(and(eq(banks.userId, user.id), eq(banks.id, Number(bankId))))
      .then((res) => res[0]);

    if (!bank) {
      return c.json({ error: "Bank not found" }, 404);
    }

    // Get transfer transactions from db

    // Get bank transactions from plaid
    const transactions = await getTransactions({
      accessToken: bank?.accessToken,
      count: 10,
    });

    // sort transactions by date such that the most recent transaction is first
    const allTransactions = [...transactions, ...[]].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return c.json({ transactions: allTransactions }, 200);
  }
);
