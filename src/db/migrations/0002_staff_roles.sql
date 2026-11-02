CREATE TABLE "staff_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"email" varchar NOT NULL,
	"role" varchar(20) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "staff_roles_user_id_unique" ON "staff_roles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "staff_roles_role_idx" ON "staff_roles" USING btree ("role");