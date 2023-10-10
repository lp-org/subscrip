CREATE TABLE IF NOT EXISTS "temp_account_id" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_payment_method_id" uuid,
	"account_id" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "temp_account_id" ADD CONSTRAINT "temp_account_id_store_payment_method_id_store_payment_method_id_fk" FOREIGN KEY ("store_payment_method_id") REFERENCES "store_payment_method"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
