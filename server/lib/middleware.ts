import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import { createMiddleware } from "hono/factory";
import { decrypt, getSession, updateAccessToken } from "./session";

export type UserProps = {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postcode: string;
  dateOfBirth: string;
  ssn: string;
  email: string;
  hashedPassword: string;
  emailVerified: Date | null;
  isTwoFactorEnabled: boolean | null;
  dwollaCustomerId: string | null;
  dwollaCustomerUrl: string | null;
};

type Env = {
  Variables: {
    user: UserProps;
  };
};

export const verifyUser = createMiddleware<Env>(async (c, next) => {
  try {
    const accessCookie = await getSession({ c, key: "access_token" });

    const refreshCookie = await getSession({ c, key: "refresh_token" });

    const refreshToken = await decrypt(refreshCookie);

    if (!refreshToken?.userId) {
      return c.json({ error: "Unauthorized! You need to sign in." }, 401);
    }

    const accessToken = await decrypt(accessCookie);

    if (refreshToken?.userId && !accessToken?.userId) {
      updateAccessToken({ c });
    }

    const user = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        address: users.address,
        country: users.country,
        state: users.state,
        city: users.city,
        postcode: users.postcode,
        dateOfBirth: users.dateOfBirth,
        ssn: users.ssn,
        email: users.email,
        hashedPassword: users.hashedPassword,
        emailVerified: users.emailVerified,
        isTwoFactorEnabled: users.isTwoFactorEnabled,
        dwollaCustomerId: users.dwollaCustomerId,
        dwollaCustomerUrl: users.dwollaCustomerUrl,
      })
      .from(users)
      .where(eq(users.id, Number(refreshToken.userId)))
      .then((res) => res[0]);

    c.set("user", user);

    await next();
  } catch (err) {
    console.error("Middleware error: verify user", err);

    return c.json({ error: "Unauthorized! You need to sign in." }, 401);
  }
});
