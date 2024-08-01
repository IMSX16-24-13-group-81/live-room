CREATE TABLE IF NOT EXISTS "buildings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"coordinates" text,
	"available" boolean,
	"building" integer NOT NULL,
    "description" text,
    CONSTRAINT "rooms_building_fk" FOREIGN KEY ("building") REFERENCES "buildings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
