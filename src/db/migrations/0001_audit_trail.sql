CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"actor_id" varchar,
	"actor_email" varchar NOT NULL,
	"action" varchar(20) NOT NULL,
	"entity_type" varchar(20) NOT NULL,
	"entity_id" integer NOT NULL,
	"summary" varchar NOT NULL,
	"changes" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "state" SET DATA TYPE varchar(3);--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");