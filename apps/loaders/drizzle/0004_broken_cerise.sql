CREATE TABLE IF NOT EXISTS "store_invoice" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"s_invoice_id" text,
	"s_customer_id" text,
	"s_subscription_id" text,
	"amount" integer,
	"status" text,
	"currency" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "store_invoice_s_invoice_id_unique" UNIQUE("s_invoice_id")
);
