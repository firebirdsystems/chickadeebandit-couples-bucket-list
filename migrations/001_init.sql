CREATE TABLE IF NOT EXISTS partner_config (
  member_id TEXT NOT NULL,
  household_id UUID NOT NULL DEFAULT current_setting('app.household_id', true)::uuid,
  partner_id TEXT NOT NULL,
  PRIMARY KEY (member_id, household_id)
);

CREATE TABLE IF NOT EXISTS bucket_items (
  id TEXT PRIMARY KEY,
  household_id UUID NOT NULL DEFAULT current_setting('app.household_id', true)::uuid,
  created_by TEXT NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  category TEXT NOT NULL DEFAULT 'other',
  done_at TEXT,
  done_note TEXT,
  photo_id TEXT,
  created_at TEXT NOT NULL
);
