ALTER TABLE "booking" ADD COLUMN "currency" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking" ADD CONSTRAINT "booking_currency_currency_code_fk" FOREIGN KEY ("currency") REFERENCES "currency"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
