ALTER TABLE app_couples_bucket_list__partner_config ADD COLUMN session_id TEXT;
ALTER TABLE app_couples_bucket_list__bucket_items ADD COLUMN session_id TEXT;

CREATE INDEX IF NOT EXISTS app_couples_bucket_list__idx_items_session_created
  ON app_couples_bucket_list__bucket_items (session_id, created_at DESC);
