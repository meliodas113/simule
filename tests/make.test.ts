import { make, arrayOf, isOneOf } from "../src";
import {
  SimpleType,
  WithId,
  WithArray,
  WithCustom,
  WithUnion,
  WithOptional,
} from "../src/types";

describe("make function", () => {
  test("generates simple types", () => {
    const result = make<SimpleType>("SimpleType");
    expect(result).toEqual({
      name: expect.any(String),
      age: expect.any(Number),
      active: expect.any(Boolean),
    });
  });

  test("generates UUID for id if string", () => {
    const result = make<WithId>("WithId");
    expect(result.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  test("handles arrays with default min/max", () => {
    const result = make<WithArray>("WithArray");
    expect(result.items).toBeInstanceOf(Array);
    expect(result.items.length).toBeGreaterThanOrEqual(3);
    expect(result.items.length).toBeLessThanOrEqual(8);
    expect(result.items.every((item) => typeof item === "string")).toBe(true);
  });

  test("throws for custom types without override", () => {
    expect(() => make<WithCustom>("WithCustom")).toThrow(
      /Custom type "SimpleType" for field "custom" requires an override/
    );
  });

  test("uses override for custom types", () => {
    const result = make<WithCustom>("WithCustom", {
      overrides: {
        custom: () => make<SimpleType>("SimpleType"),
      },
    });
    expect(result.custom).toEqual({
      name: expect.any(String),
      age: expect.any(Number),
      active: expect.any(Boolean),
    });
  });

  test("handles arrayOf with custom min/max", () => {
    const options = { min: 5, max: 10 };
    const result = arrayOf(() => "test", options);
    expect(result.length).toBeGreaterThanOrEqual(5);
    expect(result.length).toBeLessThanOrEqual(10);
    expect(result.every((item) => item === "test")).toBe(true);
  });

  test("handles isOneOf", () => {
    const values = ["A", "B", "C"];
    const result = isOneOf(values);
    expect(values).toContain(result);
  });

  test("handles unions with null", () => {
    const result = make<WithUnion>("WithUnion");
    expect(result.title === null || typeof result.title === "string").toBe(
      true
    );
  });

  test("handles optional with undefined", () => {
    const result = make<WithOptional>("WithOptional");
    expect(result.tags === undefined || Array.isArray(result.tags)).toBe(true);
    if (result.tags) {
      expect(result.tags.every((item) => typeof item === "string")).toBe(true);
    }
  });

  test("clamps array min/max", () => {
    const options = { min: 15, max: 10 };
    const result = arrayOf(() => "test", options);
    expect(result.length).toBeLessThanOrEqual(10);
    expect(result.every((item) => item === "test")).toBe(true);
  });
});
