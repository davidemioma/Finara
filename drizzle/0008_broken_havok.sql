ALTER TABLE "banks" DROP CONSTRAINT "banks_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "two_factor_confirmations" DROP CONSTRAINT "two_factor_confirmations_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "bank_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "account_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "access_token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "funding_source_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "banks" ADD COLUMN "shareable_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "banks" ADD CONSTRAINT "banks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "two_factor_confirmations" ADD CONSTRAINT "two_factor_confirmations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "banks" ADD CONSTRAINT "banks_bank_id_unique" UNIQUE("bank_id");--> statement-breakpoint
ALTER TABLE "banks" ADD CONSTRAINT "banks_account_id_unique" UNIQUE("account_id");--> statement-breakpoint
ALTER TABLE "banks" ADD CONSTRAINT "banks_access_token_unique" UNIQUE("access_token");--> statement-breakpoint
ALTER TABLE "banks" ADD CONSTRAINT "banks_funding_source_url_unique" UNIQUE("funding_source_url");--> statement-breakpoint
ALTER TABLE "banks" ADD CONSTRAINT "banks_shareable_id_unique" UNIQUE("shareable_id");