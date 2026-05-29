import { describe, it, expect } from "vitest";
import { validateItem, categoryLabel, groupByCategory, CATEGORIES } from "../src/logic.js";

describe("validateItem", () => {
  it("rejects empty string", () => expect(validateItem("").valid).toBe(false));
  it("rejects whitespace only", () => expect(validateItem("   ").valid).toBe(false));
  it("accepts valid title", () => {
    const r = validateItem("  See the Northern Lights  ");
    expect(r.valid).toBe(true);
    expect(r.trimmed).toBe("See the Northern Lights");
  });
  it("rejects title over 200 chars", () => expect(validateItem("x".repeat(201)).valid).toBe(false));
});

describe("categoryLabel", () => {
  it("returns label for known category", () => expect(categoryLabel("travel")).toContain("Travel"));
  it("returns raw value for unknown category", () => expect(categoryLabel("unknown")).toBe("unknown"));
});

describe("groupByCategory", () => {
  it("returns empty for no items", () => expect(groupByCategory([])).toEqual([]));
  it("groups items by category", () => {
    const items = [
      { id: "1", category: "travel" },
      { id: "2", category: "food" },
      { id: "3", category: "travel" },
    ];
    const groups = groupByCategory(items);
    const travelGroup = groups.find(g => g.category === "travel");
    expect(travelGroup?.items).toHaveLength(2);
  });
  it("respects category order from CATEGORIES", () => {
    const items = [
      { id: "1", category: "skill" },
      { id: "2", category: "travel" },
    ];
    const groups = groupByCategory(items);
    const order = CATEGORIES.map(c => c.value);
    expect(order.indexOf(groups[0].category)).toBeLessThan(order.indexOf(groups[1].category));
  });
  it("omits categories with no items", () => {
    const items = [{ id: "1", category: "food" }];
    const groups = groupByCategory(items);
    expect(groups).toHaveLength(1);
    expect(groups[0].category).toBe("food");
  });
});
