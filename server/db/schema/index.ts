import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  date,
  numeric,
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
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

export const banks = pgTable("banks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  bankId: text("bank_id").unique().notNull(),
  accountId: text("account_id").unique().notNull(),
  accessToken: text("access_token").unique().notNull(),
  fundingSourceUrl: text("funding_source_url").unique().notNull(),
  shareableId: text("shareable_id").unique().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  note: text("note").notNull(),
  channel: text("channel").notNull(),
  category: text("category").notNull(),
  email: text("email").notNull(),
  senderId: integer("sender_id")
    .references(() => users.id, { onDelete: "set null" })
    .notNull(),
  recieverId: integer("reciever_id")
    .references(() => users.id, { onDelete: "set null" })
    .notNull(),
  senderBankId: integer("sender_bank_id")
    .references(() => banks.id, { onDelete: "set null" })
    .notNull(),
  recieverBankId: integer("reciever_bank_id")
    .references(() => banks.id, { onDelete: "set null" })
    .notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  date: timestamp("created_at").defaultNow(),
});
