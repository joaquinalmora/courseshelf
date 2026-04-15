import { describe, expect, it } from "vitest";

import { courseSchema, materialSchema } from "../../lib/validation";

describe("courseSchema", () => {
  it("accepts a valid course payload", () => {
    const result = courseSchema.safeParse({
      courseName: "Introduction to AI",
      department: "Computer Science",
      term: "2026W1",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid term format", () => {
    const result = courseSchema.safeParse({
      courseName: "Introduction to AI",
      department: "Computer Science",
      term: "2020Z1",
    });

    expect(result.success).toBe(false);
  });
});

describe("materialSchema", () => {
  it("rejects a material with a non-url link", () => {
    const result = materialSchema.safeParse({
      title: "Week 1 Notes",
      type: "Lecture Notes",
      description: "Reading for the first week.",
      link: "not-a-url",
    });

    expect(result.success).toBe(false);
  });
});
