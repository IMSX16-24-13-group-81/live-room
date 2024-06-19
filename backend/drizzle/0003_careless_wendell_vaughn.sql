--ALTER TABLE "rooms" RENAME COLUMN  "coordiates" TO "coordinates";--> statement-breakpoint
ALTER TABLE "sensors" DROP CONSTRAINT "sensors_room_rooms_id_fk";
--> statement-breakpoint
--ALTER TABLE "rooms" ADD PRIMARY KEY ("name");--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensors" ADD CONSTRAINT "sensors_room_rooms_id_fk" FOREIGN KEY ("room") REFERENCES "rooms"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN IF EXISTS "id";