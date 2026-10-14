export const CATEGORIES = [
  { value: "travel",    label: "Travel ✈️" },
  { value: "food",      label: "Food & Drink 🍽️" },
  { value: "skill",     label: "Learn Together 📚" },
  { value: "milestone", label: "Milestone 🎉" },
  { value: "other",     label: "Other ✨" },
];

export function validateItem(title) {
  const trimmed = (title ?? "").trim();
  if (!trimmed) return { valid: false, trimmed: "" };
  if (trimmed.length > 200) return { valid: false, trimmed };
  return { valid: true, trimmed };
}

export function categoryLabel(value) {
  return CATEGORIES.find(c => c.value === value)?.label ?? value;
}

export function groupByCategory(items) {
  const order = CATEGORIES.map(c => c.value);
  const map = {};
  for (const item of items) {
    const cat = item.category ?? "other";
    if (!map[cat]) map[cat] = [];
    map[cat].push(item);
  }
  return order.filter(k => map[k]?.length).map(k => ({ category: k, items: map[k] }));
}

/**
 * Fields the in-app search matches against (see hub-sdk `searchMatch`).
 * Notes and category count as well as the title — a bucket list is
 * browsed as "the travel ones" or by the detail written under an idea.
 */
export function searchableFields(item) {
  return [item.title, item.notes, item.category, item.done_note];
}

/**
 * The picture to draw on an item's card: the small copy of its photo when
 * one was kept, else the photo itself.
 */
export function tilePhotoId(item) {
  return item?.thumb_file_id || item?.photo_id || "";
}

/**
 * The line a failed write shows, from the error's status — never the hub's
 * text. "Try again" only where trying again can work. `found` is the caller's
 * re-read after a write that changed nothing (true: the row is still there).
 */
export function failureLine(e, { action, thing, found } = {}) {
  if (e?.forUser) return e.message;
  if (e?.code === "UNIQUE_CONSTRAINT" || /UNIQUE constraint failed/i.test(String(e?.message ?? ""))) return `That ${thing} already exists.`;
  if (e?.status === 403) return `You don’t have permission to ${action}.`;
  if (e?.status === 507) return "The household’s storage is full — free up space first.";
  if (e?.status === 429) return "Too many tries — wait a minute and try again.";
  if (found === false || (found === undefined && e?.status === 404)) return `This ${thing} has been removed.`;
  if (found === true) return `You don’t have permission to ${action}.`;
  if (e?.status === 409) return `This ${thing} was changed by someone else — check it first.`;
  return `Couldn’t ${action} — try again.`;
}

/** A photo upload the files endpoint refused: 413 too large, 415 a type it
 *  will not store; the rest (429, 507, …) follow the table. */
export function photoUploadLine(e) {
  if (e?.status === 413) return "That photo is too large.";
  if (e?.status === 415) return "That kind of file can’t be uploaded.";
  return failureLine(e, { action: "add the photo", thing: "photo" });
}
