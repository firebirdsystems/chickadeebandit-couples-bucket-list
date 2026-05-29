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
