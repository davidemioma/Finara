ALTER TABLE "transactions" DROP CONSTRAINT "transactions_bank_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_bank_id_banks_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "sender_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "reciever_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "sender_bank_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "reciever_bank_id" integer NOT NULL;--> statement-breakpoint
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
ALTER TABLE "transactions" DROP COLUMN IF EXISTS "bank_id";