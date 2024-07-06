import { db } from "../db";
import { Hono } from "hono";
import { formatAmount } from "../lib/util";
import { and, desc, eq, or } from "drizzle-orm";
import { createTransfer } from "../lib/dwolla";
import { verifyUser } from "../lib/middleware";
import { zValidator } from "@hono/zod-validator";
import { banks, transactions } from "../db/schema";
import { TransferSchema } from "../lib/validators/transfer";
import { sendTransactionConfirmationEmail } from "../lib/mail";
import { getBank, getBankByAccId, getTransactions } from "../lib/bank";

export const transactionRoute = new Hono()
  .get("/:bankId", verifyUser, async (c) => {
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
    const transfers = await db
      .select()
      .from(transactions)
      .where(
        or(
          eq(transactions.senderBankId, bank.id),
          eq(transactions.recieverBankId, bank.id)
        )
      )
      .orderBy(desc(transactions.date))
      .limit(10);

    const transferTransactions = transfers.map((transfer) => ({
      id: transfer.id,
      name: transfer.note,
      amount: transfer.amount,
      date: transfer.date,
      paymentChannel: transfer.channel,
      category: transfer.category,
      type: transfer.senderBankId === bank.id ? "debit" : "credit",
    }));

    // Get bank transactions from plaid
    const plaidTransactions = await getTransactions({
      accessToken: bank?.accessToken,
      count: 10,
    });

    // sort transactions by date such that the most recent transaction is first
    const allTransactions = [
      ...plaidTransactions,
      ...transferTransactions,
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return c.json({ transactions: allTransactions }, 200);
  })
  .post(
    "/create",
    verifyUser,
    zValidator("json", TransferSchema),
    async (c) => {
      const user = c.var.user;

      const { senderBank, email, note, amount, sharaebleId } =
        await c.req.valid("json");

      //decrypt sharable id
      const receiverAccountId = atob(sharaebleId);

      if (!receiverAccountId) {
        return c.json({ error: "Reciever's bank not found" }, 404);
      }

      // Get reciever bank using sharable id
      const receiverBank = await getBankByAccId({
        accId: receiverAccountId,
      });

      if (!receiverBank) {
        return c.json({ error: "Reciever's bank not found" }, 404);
      }

      // Get current user's bank
      const currentUserBank = await getBank({
        userId: user.id,
        bankId: Number(senderBank),
      });

      if (!currentUserBank) {
        return c.json({ error: "Bank not found" }, 404);
      }

      // Create transfer using dwolla
      const transfer = await createTransfer({
        sourceFundingSourceUrl: currentUserBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: amount.toFixed(2),
      });

      // Check if transfer was successful
      if (!transfer) {
        return c.json({ error: "Transfer was unsuccessful! Try again" }, 400);
      }

      // Send transaction eamil cofirmation
      await sendTransactionConfirmationEmail({
        email: user.email,
        amount: formatAmount(amount),
      });

      await db.insert(transactions).values({
        email,
        amount: `${amount}`,
        note,
        channel: "online",
        category: "Transfer",
        senderId: currentUserBank.userId,
        recieverId: receiverBank.userId,
        senderBankId: currentUserBank.id,
        recieverBankId: receiverBank.id,
      });

      return c.json({ message: "Transaction was successful!" }, 201);
    }
  );
