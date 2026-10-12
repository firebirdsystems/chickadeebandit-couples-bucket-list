-- A small copy of the item's photo for the list, made in the browser at upload
-- and stored by the hub with the photo. NULL when none was kept (a photo that
-- is already small, a format the browser could not draw) and for every photo
-- added before this column: the photo itself is drawn instead.
ALTER TABLE app_couples_bucket_list__bucket_items ADD COLUMN thumb_file_id TEXT;
