CREATE TABLE IF NOT EXISTS "collection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"store_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room_collections" (
	"room_id" uuid,
	"collection_id" uuid,
	"position" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "store_payment_method" ALTER COLUMN "store_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "store_subscription_plan" ALTER COLUMN "store_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customer" ALTER COLUMN "store_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "room" ALTER COLUMN "store_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "booking" ALTER COLUMN "store_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payment" ALTER COLUMN "store_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "activity_log" ALTER COLUMN "store_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "gallery" ALTER COLUMN "store_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_us" ALTER COLUMN "store_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collection" ADD CONSTRAINT "collection_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room_collections" ADD CONSTRAINT "room_collections_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room_collections" ADD CONSTRAINT "room_collections_collection_id_collection_id_fk" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
