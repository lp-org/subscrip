ALTER TABLE "plan" ALTER COLUMN "key" SET DEFAULT 'starter';--> statement-breakpoint
ALTER TABLE "plan" ADD COLUMN "trial_period" integer;--> statement-breakpoint
ALTER TABLE "store_subscription_plan" ADD CONSTRAINT "store_subscription_plan_s_subscription_id_unique" UNIQUE("s_subscription_id");