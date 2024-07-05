ALTER TABLE "transactions" ADD COLUMN "note" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "channel" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "bank_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "amount" numeric(12, 2) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bank_id_users_id_fk" FOREIGN KEY ("bank_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bank_id_banks_id_fk" FOREIGN KEY ("bank_id") REFERENCES "public"."banks"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_email_unique" UNIQUE("email");