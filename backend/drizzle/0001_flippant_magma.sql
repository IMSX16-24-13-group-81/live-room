CREATE TABLE IF NOT EXISTS "sensors" (
	"id" text PRIMARY KEY NOT NULL,
	"room" serial NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensors" ADD CONSTRAINT "sensors_room_rooms_id_fk" FOREIGN KEY ("room") REFERENCES "rooms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
