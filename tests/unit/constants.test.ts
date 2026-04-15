import { describe, expect, it } from "vitest";

import { DEPARTMENT_OPTIONS, MATERIAL_TYPE_OPTIONS, TERM_PATTERN } from "../../lib/constants";

describe("course options", () => {
  it("exposes a fixed set of departments for the dropdown", () => {
    expect(DEPARTMENT_OPTIONS).toEqual([
      "Computer Science",
      "Mathematics",
      "Physics",
      "Biology",
      "English",
    ]);
  });

  it("uses the required term pattern", () => {
    expect(TERM_PATTERN.test("2026W1")).toBe(true);
    expect(TERM_PATTERN.test("1999S2")).toBe(true);
    expect(TERM_PATTERN.test("2020Z1")).toBe(false);
  });
});

describe("material options", () => {
  it("matches the allowed material types", () => {
    expect(MATERIAL_TYPE_OPTIONS).toEqual([
      "Lecture Notes",
      "Assignment",
      "Syllabus",
      "Other",
    ]);
  });
});
