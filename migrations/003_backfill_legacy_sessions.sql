-- Backfill for households that ran v1 (no partner_link / session concept).
-- Items created before the couple_scoped session policy have session_id = NULL
-- and are now invisible, because SELECT is scoped to session_id = <active session>.
-- Sessions are minted at pairing time, so this cannot be copied from an existing
-- value; instead we deterministically derive a shared session for each already-
-- reciprocal pair (identical on both sides, keyed on the sorted member ids) and
-- stamp their orphaned items with it. The partner endpoint reuses an existing
-- matching session on re-pair, so future pairings stay consistent.
--
-- Non-reciprocal legacy pairings are intentionally left NULL: under the new model
-- items require mutual consent, so they surface only once both partners re-pair.
-- On a fresh install both tables are empty and both statements are no-ops.
--
-- Mirrors date-night-planner's migration 003, which shipped this same recovery
-- for the identical cutover.

UPDATE app_couples_bucket_list__partner_config
SET session_id = 'legacy-'
  || min(member_id, partner_id) || '-' || max(member_id, partner_id)
WHERE session_id IS NULL
  AND EXISTS (
    SELECT 1 FROM app_couples_bucket_list__partner_config rev
    WHERE rev.member_id = app_couples_bucket_list__partner_config.partner_id
      AND rev.partner_id = app_couples_bucket_list__partner_config.member_id
  );

UPDATE app_couples_bucket_list__bucket_items
SET session_id = (
  SELECT pc.session_id FROM app_couples_bucket_list__partner_config pc
  WHERE pc.member_id = app_couples_bucket_list__bucket_items.created_by
    AND pc.session_id IS NOT NULL
  LIMIT 1
)
WHERE session_id IS NULL
  AND EXISTS (
    SELECT 1 FROM app_couples_bucket_list__partner_config pc
    WHERE pc.member_id = app_couples_bucket_list__bucket_items.created_by
      AND pc.session_id IS NOT NULL
  );
