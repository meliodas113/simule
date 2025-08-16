/** Type for override values: can be a fixed value or a generator function. */
export type OverrideValue = any | (() => any);

/** Options for the make function, allowing field overrides. */
export interface MakeOptions {
  /** Record of field names to override values or generators. */
  overrides?: Record<string, OverrideValue>;
}

/** Type definitions for testing simule. */
/** Type definitions for testing simule and Next.js integration. */
export type TagItem = { name: string; value: number };
export type Product = {
  id: string;
  title: string | null;
  price: number;
  tags?: TagItem[];
  inStock: boolean;
};
export type SimpleType = { name: string; age: number; active: boolean };
export type WithId = { id: string };
export type WithArray = { items: string[] };
export type WithCustom = { custom: SimpleType };
export type WithUnion = { title: string | null };
export type WithOptional = { tags?: string[] };

/** Options for array generation. */
export interface ArrayOptions {
  min: number;
  max: number;
}

/** Override value or function for a field. */
export type Override = any | (() => any);
