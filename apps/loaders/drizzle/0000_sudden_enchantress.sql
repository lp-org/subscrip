CREATE TABLE IF NOT EXISTS "activity_log" (
	"id" serial NOT NULL,
	"event" text,
	"payload" json,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "batch_job" (
	"id" serial NOT NULL,
	"type" text,
	"context" jsonb,
	"result" jsonb,
	"start_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"failed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "booking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"check_in_date" date NOT NULL,
	"check_out_date" date NOT NULL,
	"room_id" integer,
	"guest_count" integer,
	"total_amount" integer DEFAULT 0,
	"status" text,
	"booking_no" serial NOT NULL,
	"additional_data" jsonb,
	"customer_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_us" (
	"id" serial NOT NULL,
	"email" text,
	"name" text,
	"message" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "currency" (
	"code" text PRIMARY KEY NOT NULL,
	"symbol" text,
	"symbol_native" text,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"email" text NOT NULL,
	"phone" text,
	"password" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gallery" (
	"id" serial NOT NULL,
	"file_key" text,
	"file_type" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" integer DEFAULT 0,
	"currency" text,
	"booking_id" uuid NOT NULL,
	"status" text,
	"type" text,
	"reference" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pricing" (
	"id" serial PRIMARY KEY NOT NULL,
	"price" integer DEFAULT 0,
	"day_of_week" text,
	"date" date,
	"room_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"short_description" text,
	"images" json DEFAULT '[]'::json,
	"amenities" json DEFAULT '[]'::json,
	"order" serial NOT NULL,
	"base_price" integer DEFAULT 0 NOT NULL,
	"quantity" integer DEFAULT 0,
	"maximum_occupancy" integer DEFAULT 0,
	"published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "setting" (
	"id" serial NOT NULL,
	"name" text,
	"email" text,
	"logo" text,
	"favicon" text,
	"ogimage" text,
	"phone" text,
	"address" text,
	"facebook" text,
	"instagram" text,
	"currency" text,
	"slider" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text,
	"phone" text,
	"role" text,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_customer" ON "customer" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_user" ON "user" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking" ADD CONSTRAINT "booking_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking" ADD CONSTRAINT "booking_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment" ADD CONSTRAINT "payment_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pricing" ADD CONSTRAINT "pricing_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
