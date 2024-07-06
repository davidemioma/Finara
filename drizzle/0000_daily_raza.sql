CREATE TABLE IF NOT EXISTS "banks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"bank_id" text NOT NULL,
	"account_id" text NOT NULL,
	"access_token" text NOT NULL,
	"funding_source_url" text NOT NULL,
	"shareable_id" text NOT NULL,
	CONSTRAINT "banks_bank_id_unique" UNIQUE("bank_id"),
	CONSTRAINT "banks_account_id_unique" UNIQUE("account_id"),
	CONSTRAINT "banks_access_token_unique" UNIQUE("access_token"),
	CONSTRAINT "banks_funding_source_url_unique" UNIQUE("funding_source_url"),
	CONSTRAINT "banks_shareable_id_unique" UNIQUE("shareable_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_change_verification_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"old_email" text NOT NULL,
	"new_email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp,
	CONSTRAINT "email_change_verification_tokens_old_email_unique" UNIQUE("old_email"),
	CONSTRAINT "email_change_verification_tokens_new_email_unique" UNIQUE("new_email"),
	CONSTRAINT "email_change_verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp,
	CONSTRAINT "password_reset_tokens_email_unique" UNIQUE("email"),
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"note" text NOT NULL,
	"channel" text NOT NULL,
	"category" text NOT NULL,
	"email" text NOT NULL,
	"sender_id" integer NOT NULL,
	"reciever_id" integer NOT NULL,
	"sender_bank_id" integer NOT NULL,
	"reciever_bank_id" integer NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two_factor_confirmations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two_factor_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp,
	CONSTRAINT "two_factor_tokens_email_unique" UNIQUE("email"),
	CONSTRAINT "two_factor_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"address" text NOT NULL,
	"country" text NOT NULL,
	"state" text NOT NULL,
	"city" text NOT NULL,
	"postcode" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"ssn" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"hashed_password" text NOT NULL,
	"isTwoFactorEnabled" boolean DEFAULT false,
	"dwolla_customer_id" text DEFAULT '',
	"dwolla_customer_url" text DEFAULT '',
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp,
	CONSTRAINT "verification_tokens_email_unique" UNIQUE("email"),
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "banks" ADD CONSTRAINT "banks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_reciever_id_users_id_fk" FOREIGN KEY ("reciever_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sender_bank_id_banks_id_fk" FOREIGN KEY ("sender_bank_id") REFERENCES "public"."banks"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_reciever_bank_id_banks_id_fk" FOREIGN KEY ("reciever_bank_id") REFERENCES "public"."banks"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "two_factor_confirmations" ADD CONSTRAINT "two_factor_confirmations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
