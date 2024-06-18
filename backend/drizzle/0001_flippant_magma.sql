CREATE TABLE IF NOT EXISTS "sensors" (
	"id" text PRIMARY KEY NOT NULL,
	"room" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensors" ADD CONSTRAINT "sensors_room_rooms_name_fk" FOREIGN KEY ("room") REFERENCES "rooms"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
