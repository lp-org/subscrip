CREATE TABLE IF NOT EXISTS "storeSite" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text,
	"is_custom_domain" boolean DEFAULT false,
	"domain" text,
	"store_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "storeSite_url_unique" UNIQUE("url"),
	CONSTRAINT "storeSite_store_id_unique" UNIQUE("store_id")
);
--> statement-breakpoint
ALTER TABLE "store" DROP CONSTRAINT "store_url_unique";--> statement-breakpoint
ALTER TABLE "setting" ALTER COLUMN "name" SET DEFAULT 'My Store';--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "plan" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "plan_status" text;--> statement-breakpoint
ALTER TABLE "store" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "store" DROP COLUMN IF EXISTS "url";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "storeSite" ADD CONSTRAINT "storeSite_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
