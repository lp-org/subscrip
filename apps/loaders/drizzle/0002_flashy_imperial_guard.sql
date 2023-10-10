ALTER TABLE "store_payment_method" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "temp_account_id" DROP COLUMN IF EXISTS "updated_at";