ALTER TABLE "rooms" ADD COLUMN "building" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "description" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_building_buildings_id_fk" FOREIGN KEY ("building") REFERENCES "buildings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
