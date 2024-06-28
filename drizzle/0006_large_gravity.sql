CREATE TABLE IF NOT EXISTS "banks" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "state" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "postcode" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "date_of_birth" date NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ssn" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dwolla_customer_id" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dwolla_customer_url" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "image";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "userRole";