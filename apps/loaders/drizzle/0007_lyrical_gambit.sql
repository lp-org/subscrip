CREATE TABLE IF NOT EXISTS "pricing_rule" (
	"type" text,
	"value_change_type" text,
	"value" integer DEFAULT 0,
	"start_at" timestamp,
	"end_at" timestamp,
	"day_of_week" text,
	"pricing_id" uuid
);
--> statement-breakpoint
ALTER TABLE "pricing" DROP CONSTRAINT "pricing_room_id_room_id_fk";
--> statement-breakpoint
ALTER TABLE "room" ADD COLUMN "pricing_id" uuid;--> statement-breakpoint
ALTER TABLE "pricing" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "pricing" ADD COLUMN "status" text DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "pricing" ADD COLUMN "store_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room" ADD CONSTRAINT "room_pricing_id_pricing_id_fk" FOREIGN KEY ("pricing_id") REFERENCES "pricing"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pricing" ADD CONSTRAINT "pricing_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "pricing" DROP COLUMN IF EXISTS "day_of_week";--> statement-breakpoint
ALTER TABLE "pricing" DROP COLUMN IF EXISTS "date";--> statement-breakpoint
ALTER TABLE "pricing" DROP COLUMN IF EXISTS "room_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pricing_rule" ADD CONSTRAINT "pricing_rule_pricing_id_pricing_id_fk" FOREIGN KEY ("pricing_id") REFERENCES "pricing"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
