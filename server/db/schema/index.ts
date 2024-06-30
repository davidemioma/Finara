import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  date,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  address: text("address").notNull(),
  country: text("country").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  postcode: text("postcode").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  ssn: text("ssn").notNull(),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("email_verified"),
  hashedPassword: text("hashed_password").notNull(),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
  dwollaCustomerId: text("dwolla_customer_id").default(""),
  dwollaCustomerUrl: text("dwolla_customer_url").default(""),
});

export const verificationTokens = pgTable("verification_tokens", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires"),
});

export const emailChangeVerificationTokens = pgTable(
  "email_change_verification_tokens",
  {
    id: serial("id").primaryKey(),
    oldEmail: text("old_email").unique().notNull(),
    newEmail: text("new_email").unique().notNull(),
    token: text("token").unique().notNull(),
    expires: timestamp("expires"),
  }
);

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires"),
});

export const twoFactorTokens = pgTable("two_factor_tokens", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires"),
});

export const twoFactorConfirmations = pgTable("two_factor_confirmations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
});

export const banks = pgTable("banks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
});
