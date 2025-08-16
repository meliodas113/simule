import { faker } from "@faker-js/faker";
import { ArrayOptions } from "./types";

/**
 * Returns a random element from the provided values.
 * @param values Array of values to choose from.
 * @returns A random value from the array.
 */
export function isOneOf<T>(values: T[]): T {
  return faker.helpers.arrayElement(values);
}

/**
 * Generates an array of values with specified min/max length.
 * @param generator Function to generate each array element.
 * @param options Options for min/max length.
 * @returns An array of generated values.
 */
export function arrayOf<T>(
  generator: () => T,
  options: ArrayOptions = { min: 3, max: 8 }
): T[] {
  const min = Math.max(options.min ?? 3, 0);
  const max = Math.min(options.max ?? 1000, 1000);
  const clampedMin = Math.min(min, max); // Clamp min to max
  const length = faker.number.int({ min: clampedMin, max });
  return Array(length)
    .fill(null)
    .map(() => generator());
}
