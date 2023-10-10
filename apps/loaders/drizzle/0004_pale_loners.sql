ALTER TABLE "room" ADD COLUMN "status" text DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "room" DROP COLUMN IF EXISTS "published";