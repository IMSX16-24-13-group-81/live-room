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

CREATE TABLE IF NOT EXISTS "bigrooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"coordinates" text,
	"available" boolean,
	"places" integer,
	"building" integer NOT NULL,
	"description" text,
	CONSTRAINT "bigrooms_building_fk" FOREIGN KEY ("building") REFERENCES "buildings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT "bigrooms_room_id" FOREIGN KEY ("id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
