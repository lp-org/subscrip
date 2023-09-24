ALTER TABLE "room_images" DROP CONSTRAINT "room_images_room_id_room_id_fk";
--> statement-breakpoint
ALTER TABLE "room_images" DROP CONSTRAINT "room_images_room_id_gallery_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room_images" ADD CONSTRAINT "room_images_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
