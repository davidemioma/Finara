import { db } from "../db";
import { Hono } from "hono";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createDwollaCustomer } from "../lib/dwolla";
import { createSession, destroySession } from "../lib/session";
import {
  sendPasswordResetEmail,
  sendTwoFactorTokenEmail,
  sendVerificationEmail,
} from "../lib/mail";
import {
  extractCustomerIdFromUrl,
  getPasswordResetTokenByToken,
  getTwoFactorTokenByEmail,
  getVerificationTokenByToken,
} from "../lib/util";
import {
  generatePasswordResetToken,
  generateTwofactorToken,
  generateVerificationToken,
} from "../lib/token";
import {
  passwordResetTokens,
  twoFactorConfirmations,
  twoFactorTokens,
  users,
  verificationTokens,
} from "../db/schema";
import {
  LoginSchema,
  NewPasswordSchema,
  RegisterSchema,
  ResetSchema,
  VerifyTokenSchema,
} from "../lib/validators/auth";

export const authRoute = new Hono()
  .post("register", zValidator("json", RegisterSchema), async (c) => {
    const { email, password, ...rest } = await c.req.valid("json");

    //check if user exists
    const user = await db
      .select({
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, email))
      .then((res) => res[0]);

    if (user) {
      return c.json({ error: "Email already in use" }, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      email,
      hashedPassword,
      ...rest,
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
    });

    return c.json({ message: "Confirmation email sent!" }, 201);
  })
  .patch("verify-email", zValidator("json", VerifyTokenSchema), async (c) => {
    const { token } = await c.req.valid("json");

    const tokenExists = await getVerificationTokenByToken(token);

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
      .where(eq(users.email, tokenExists.email))
      .then((res) => res[0]);

    if (!userExists) {
      return c.json({ error: "User not found" }, 404);
    }

    // Verify User
    await db
      .update(users)
      .set({
        emailVerified: new Date(),
        email: tokenExists.email,
      })
      .where(eq(users.id, userExists.id));

    // Delete token
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, tokenExists.id));

    return c.json({ message: "Email has been verified" }, 200);
  })
  .post("login", zValidator("json", LoginSchema), async (c) => {
    const { email, password, code } = await c.req.valid("json");

    //Check if that user exists
    const userExists = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        address: users.address,
        city: users.city,
        country: users.country,
        state: users.state,
        postcode: users.postcode,
        dateOfBirth: users.dateOfBirth,
        ssn: users.ssn,
        hashedPassword: users.hashedPassword,
        emailVerified: users.emailVerified,
        isTwoFactorEnabled: users.isTwoFactorEnabled,
        dwollaCustomerId: users.dwollaCustomerId,
        dwollaCustomerUrl: users.dwollaCustomerUrl,
      })
      .from(users)
      .where(eq(users.email, email))
      .then((res) => res[0]);

    if (!userExists || !userExists.email || !userExists.hashedPassword) {
      return c.json({ error: "User not found" }, 404);
    }

    if (!userExists.emailVerified) {
      const verificationToken = await generateVerificationToken(email);

      await sendVerificationEmail({
        email: verificationToken.email,
        token: verificationToken.token,
      });

      return c.json({ error: "Confirmation email sent!" }, 403);
    }

    // if 2-factor is enabled
    if (
      userExists.email &&
      userExists.emailVerified &&
      userExists.isTwoFactorEnabled
    ) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(email);

        if (!twoFactorToken || !twoFactorToken.expires) {
          return c.json({ error: "Token not found!" }, 404);
        }

        //Check if token has expired
        const hasExpired = new Date(twoFactorToken.expires) < new Date();

        if (hasExpired) {
          return c.json({ error: "Token has expired" }, 401);
        }

        //delete token
        await db
          .delete(twoFactorTokens)
          .where(eq(twoFactorTokens.id, twoFactorToken.id));

        //Check if there is an existing confirmation and delete it
        const existingConfirmation = await db
          .select({
            id: twoFactorConfirmations.id,
            userId: twoFactorConfirmations.userId,
          })
          .from(twoFactorConfirmations)
          .where(eq(twoFactorConfirmations.userId, userExists.id))
          .then((res) => res[0]);

        if (existingConfirmation) {
          await db
            .delete(twoFactorConfirmations)
            .where(eq(twoFactorConfirmations.id, existingConfirmation.id));
        }

        await db
          .insert(twoFactorConfirmations)
          .values({ userId: userExists.id });
      } else {
        const twoFactorToken = await generateTwofactorToken(email);

        await sendTwoFactorTokenEmail({
          email: twoFactorToken.email,
          token: twoFactorToken.token,
        });

        return c.json({ twoFactor: true }, 202);
      }
    }

    //Login logic
    const pwdMatch = await bcrypt.compare(password, userExists.hashedPassword);

    if (!pwdMatch) {
      return c.json({ error: "Wrong password! Try aagain." }, 401);
    }

    //Dwolla
    if (
      !userExists.dwollaCustomerId?.trim() ||
      !userExists.dwollaCustomerUrl?.trim()
    ) {
      const { id: _, address, state, postcode, ...rest } = userExists;

      // Verify email and set dwolla customer Id and url
      const dwollaCustomerUrl = await createDwollaCustomer({
        ...rest,
        address1: address,
        state: "NY", //For sandbox mode because it only allows usa states and 2 digit code.
        postalCode: "12345", //For sandbox mode because it only allows usa postal codes.
        type: "personal",
      });

      if (!dwollaCustomerUrl) {
        return c.json(
          {
            error:
              "Could not verify email address! Error creating dwolla customer",
          },
          400
        );
      }

      const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

      // Udate User
      await db
        .update(users)
        .set({
          dwollaCustomerUrl,
          dwollaCustomerId,
        })
        .where(eq(users.id, userExists.id));
    }

    await createSession({
      c,
      userId: userExists.id,
    });

    return c.json({ message: "Login successful!" }, 200);
  })
  .post("reset-password", zValidator("json", ResetSchema), async (c) => {
    const { email } = await c.req.valid("json");

    //check if user exists
    const userExists = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.email, email))
      .then((res) => res[0]);

    if (!userExists) {
      return c.json({ error: "User not found" }, 404);
    }

    // Generate password token
    const passwordResetToken = await generatePasswordResetToken(email);

    //send email
    await sendPasswordResetEmail({
      email: passwordResetToken.email,
      token: passwordResetToken.token,
    });

    return c.json({ message: "Password reset email sent!" }, 200);
  })
  .patch("new-password", zValidator("json", NewPasswordSchema), async (c) => {
    const { token, password } = await c.req.valid("json");

    const tokenExists = await getPasswordResetTokenByToken(token);

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
      .where(eq(users.email, tokenExists.email))
      .then((res) => res[0]);

    if (!userExists) {
      return c.json({ error: "User not found" }, 404);
    }

    //Encrypt new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // change password
    await db
      .update(users)
      .set({ hashedPassword })
      .where(eq(users.id, userExists.id));

    // Delete token
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, tokenExists.id));

    return c.json({ message: "Password has been reset" }, 200);
  })
  .get("logout", async (c) => {
    await destroySession({ c });

    return c.json({ message: "Logged out" }, 200);
  });
