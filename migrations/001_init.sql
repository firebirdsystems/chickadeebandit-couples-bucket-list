CREATE TABLE IF NOT EXISTS app_couples_bucket_list__partner_config (
  member_id TEXT NOT NULL,
  partner_id TEXT NOT NULL,
  PRIMARY KEY (member_id)
);

CREATE TABLE IF NOT EXISTS app_couples_bucket_list__bucket_items (
  id TEXT PRIMARY KEY,
  created_by TEXT NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  category TEXT NOT NULL DEFAULT 'other',
  done_at TEXT,
  done_note TEXT,
  photo_id TEXT,
  created_at TEXT NOT NULL
);
