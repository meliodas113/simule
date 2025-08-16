import { ArrayOptions } from "./types";
/**
 * Returns a random element from the provided values.
 * @param values Array of values to choose from.
 * @returns A random value from the array.
 */
export declare function isOneOf<T>(values: T[]): T;
/**
 * Generates an array of values with specified min/max length.
 * @param generator Function to generate each array element.
 * @param options Options for min/max length.
 * @returns An array of generated values.
 */
export declare function arrayOf<T>(generator: () => T, options?: ArrayOptions): T[];
//# sourceMappingURL=helpers.d.ts.map