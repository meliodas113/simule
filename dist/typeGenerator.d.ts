import { Override } from "./types";
/**
 * Generates a fixture for a TypeScript type by name.
 * @param typeName The name of the type or interface.
 * @param options Optional overrides for fields.
 * @returns The generated fixture object.
 */
export declare function make<T>(typeName: string, options?: {
    overrides?: Record<string, Override>;
}): T;
//# sourceMappingURL=typeGenerator.d.ts.map