CREATE TABLE IF NOT EXISTS "buildings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rooms" (
	"name" text PRIMARY KEY NOT NULL,
	"coordinates" text,
	"available" boolean
);
