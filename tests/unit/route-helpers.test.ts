import { describe, expect, it } from "vitest";

import { parseId } from "../../lib/route-helpers";

describe("parseId", () => {
  it("returns a positive integer for valid route params", () => {
    expect(parseId("12")).toBe(12);
  });

  it("returns null for invalid route params", () => {
    expect(parseId("0")).toBeNull();
    expect(parseId("abc")).toBeNull();
  });
});
