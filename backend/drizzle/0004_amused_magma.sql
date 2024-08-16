CREATE TABLE IF NOT EXISTS "bigrooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"buildings" serial NOT NULL,
	"name" text,
	"places" numeric,
	"coordinates" text,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "building" SET DATA TYPE serial;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bigrooms" ADD CONSTRAINT "bigrooms_id_rooms_id_fk" FOREIGN KEY ("id") REFERENCES "rooms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bigrooms" ADD CONSTRAINT "bigrooms_buildings_buildings_id_fk" FOREIGN KEY ("buildings") REFERENCES "buildings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
