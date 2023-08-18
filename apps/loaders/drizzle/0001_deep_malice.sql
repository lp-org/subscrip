CREATE TABLE IF NOT EXISTS "staged_job" (
	"id" serial NOT NULL,
	"event_name" text NOT NULL,
	"data" jsonb,
	"options" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
