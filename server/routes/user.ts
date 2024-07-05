import { db } from "../db";
import bcrypt from "bcryptjs";
import { Hono } from "hono";
import { plaidClient } from "../lib/plaid";
import { and, eq, count } from "drizzle-orm";
import { verifyUser } from "../lib/middleware";
import { addFundingSource } from "../lib/dwolla";
import { zValidator } from "@hono/zod-validator";
import { sendEmailChangeEmail } from "../lib/mail";
import { exchangeTokenSchema } from "../lib/validators/user";
import { generateEmailChangeVerificationToken } from "../lib/token";
import { getEmailChangeVerificationTokenByToken } from "../lib/util";
import { banks, emailChangeVerificationTokens, users } from "../db/schema";
import { SettingsSchema, VerifyTokenSchema } from "../lib/validators/auth";
import {
  CountryCode,
  Products,
  ProcessorTokenCreateRequestProcessorEnum,
} from "plaid";

export const userRoute = new Hono()
  .get("/", verifyUser, async (c) => {
    return c.json({ user: c.var.user });
  })
  .get("/bank-count", verifyUser, async (c) => {
    const user = c.var.user;

    const bankCount = await db
      .select({
        count: count(),
      })
      .from(banks)
      .where(eq(banks.userId, user.id))
      .then((res) => res[0]);

    return c.json({ count: bankCount.count }, 200);
  })
  .patch(
    "new-email",
    verifyUser,
    zValidator("json", VerifyTokenSchema),
    async (c) => {
      const user = c.var.user;

      const { token } = await c.req.valid("json");

      const tokenExists = await getEmailChangeVerificationTokenByToken(token);

      if (!tokenExists || !tokenExists.expires) {
        return c.json({ error: "Token not found" }, 404);
      }

      //Check if token has expired
      const hasExpired = new Date(tokenExists.expires) < new Date();

      if (hasExpired) {
        return c.json({ error: "Token has expired" }, 401);
      }

      //check if user exists
      const userExists = await db
        .select({
          id: users.id,
        })
        .from(users)
        .where(
          and(eq(users.id, user.id), eq(users.email, tokenExists.oldEmail))
        )
        .then((res) => res[0]);

      if (!userExists) {
        return c.json({ error: "User not found" }, 404);
      }

      // Update user
      await db
        .update(users)
        .set({ email: tokenExists.newEmail, emailVerified: new Date() })
        .where(eq(users.id, user.id));

      // Delete token
      await db
        .delete(emailChangeVerificationTokens)
        .where(eq(emailChangeVerificationTokens.id, tokenExists.id));

      return c.json({ message: "Email has been changed" }, 200);
    }
  )
  .patch(
    "update-settings",
    verifyUser,
    zValidator("json", SettingsSchema),
    async (c) => {
      const user = c.var.user;

      const { email, password, newPassword, ...rest } = await c.req.valid(
        "json"
      );

      //check if user exists
      const userExists = await db
        .select({
          id: users.id,
          hashedPassword: users.hashedPassword,
        })
        .from(users)
        .where(eq(users.id, user.id))
        .then((res) => res[0]);

      if (!user || !userExists) {
        return c.json(
          { error: "Unauthorized! Log in to update settings" },
          401
        );
      }

      // If credential users wants to change their email
      if (email && email !== user.email) {
        //Check if email belong to another account
        const emailExists = await db
          .select({
            id: users.id,
          })
          .from(users)
          .where(eq(users.email, email))
          .then((res) => res[0]);

        if (emailExists && emailExists.id !== user.id) {
          return c.json({ error: "Email already in use" }, 409);
        }

        const verificationToken = await generateEmailChangeVerificationToken({
          oldEmail: user.email,
          newEmail: email,
        });

        await sendEmailChangeEmail({
          newEmail: email,
          token: verificationToken.token,
        });

        return c.json({ message: "Verification email sent!" }, 202);
      }

      // If credential users wants to change their password
      let hashedPassword = undefined;

      if (password && newPassword && userExists.hashedPassword) {
        if (newPassword === password) {
          return c.json({ error: "The passwords are the same." }, 409);
        }

        const pwdMatch = await bcrypt.compare(
          password,
          userExists.hashedPassword
        );

        if (!pwdMatch) {
          return c.json({ error: "Wrong password!" }, 401);
        }

        //if password match encrypt new password
        hashedPassword = await bcrypt.hash(newPassword, 10);
      }

      // Update user
      await db
        .update(users)
        .set({ email, hashedPassword, ...rest })
        .where(eq(users.id, user.id));

      return c.json({ message: "Settings updated!" }, 200);
    }
  )
  .post("create-link-token", verifyUser, async (c) => {
    const user = c.var.user;

    const res = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: `${user.id}`,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[], //We use US because sanbox mode only works for US.
    });

    const linkToken = res.data.link_token;

    if (!linkToken) {
      return c.json({ error: "Could not create token! try again." }, 400);
    }

    return c.json({ linkToken }, 200);
  })
  .post(
    "exchange-public-token",
    verifyUser,
    zValidator("json", exchangeTokenSchema),
    async (c) => {
      const user = c.var.user;

      const { publicToken } = await c.req.valid("json");

      // Exchange public token for access token and item ID
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });

      const accessToken = response.data.access_token;

      const itemId = response.data.item_id;

      // Get account information from Plaid using the access token
      const accountsResponse = await plaidClient.accountsGet({
        access_token: accessToken,
      });

      const accountData = accountsResponse.data.accounts[0];

      // Create a processor token for Dwolla using the access token and account ID
      const processorTokenResponse = await plaidClient.processorTokenCreate({
        access_token: accessToken,
        account_id: accountData.account_id,
        processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
      });

      const processorToken = processorTokenResponse.data.processor_token;

      // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
      const fundingSourceUrl = await addFundingSource({
        dwollaCustomerId: user.dwollaCustomerId || "",
        processorToken,
        bankName: accountData.name,
      });

      if (!fundingSourceUrl) {
        return c.json(
          { error: "Could not create bank! try connecting a different bank." },
          400
        );
      }

      // Create a bank account in db
      await db.insert(banks).values({
        userId: user.id,
        bankId: itemId,
        accountId: accountData.account_id,
        accessToken,
        fundingSourceUrl: fundingSourceUrl || "",
        shareableId: btoa(accountData.account_id), //Encrypt sharable id
      });

      return c.json({ message: "Bank created!" }, 201);
    }
  );
