import { describe, it, expect } from "vitest";
import { CATEGORIES, validateItem, categoryLabel, groupByCategory } from "../src/logic.js";

describe("validateItem", () => {
  it("rejects empty and whitespace-only titles", () => {
    expect(validateItem("")).toEqual({ valid: false, trimmed: "" });
    expect(validateItem("   ")).toEqual({ valid: false, trimmed: "" });
    expect(validateItem(null)).toEqual({ valid: false, trimmed: "" });
    expect(validateItem(undefined)).toEqual({ valid: false, trimmed: "" });
  });

  it("rejects titles over 200 chars but keeps the trimmed value", () => {
    const long = "x".repeat(201);
    expect(validateItem(long)).toEqual({ valid: false, trimmed: long });
  });

  it("accepts a valid title and trims it", () => {
    expect(validateItem("  Skydiving  ")).toEqual({ valid: true, trimmed: "Skydiving" });
    expect(validateItem("x".repeat(200)).valid).toBe(true);
  });
});

describe("categoryLabel", () => {
  it("maps known categories to their labels", () => {
    expect(categoryLabel("travel")).toBe("Travel ✈️");
    expect(categoryLabel("other")).toBe("Other ✨");
  });

  it("falls back to the raw value for unknown categories", () => {
    expect(categoryLabel("mystery")).toBe("mystery");
  });
});

describe("groupByCategory", () => {
  it("groups items in canonical category order, skipping empty categories", () => {
    const items = [
      { id: 1, category: "food" },
      { id: 2, category: "travel" },
      { id: 3, category: "food" },
    ];
    const groups = groupByCategory(items);
    expect(groups.map((g) => g.category)).toEqual(["travel", "food"]);
    expect(groups[1].items.map((i) => i.id)).toEqual([1, 3]);
  });

  it("defaults missing category to 'other'", () => {
    const groups = groupByCategory([{ id: 1 }]);
    expect(groups).toEqual([{ category: "other", items: [{ id: 1 }] }]);
  });

  it("returns [] for no items", () => {
    expect(groupByCategory([])).toEqual([]);
  });

  it("covers every declared category value", () => {
    const items = CATEGORIES.map((c, i) => ({ id: i, category: c.value }));
    expect(groupByCategory(items).map((g) => g.category)).toEqual(CATEGORIES.map((c) => c.value));
  });
});
