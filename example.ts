/** Example usage of the simule package. */
import { make, arrayOf, isOneOf } from "./src/index";

/** Example custom type. */
type TagItem = { name: string; value: number };
/** Example product type with various field types. */
type Product = {
  id: string;
  title: string | null;
  price: number;
  tags?: TagItem[];
  inStock: boolean;
};

/** Basic usage: throws if custom types (e.g., TagItem) are used without overrides. */
try {
  const fixture1 = make<Product>("Product");
  console.log("Basic fixture:", fixture1);
} catch (e) {
  console.error("Expected error for custom type:", (e as Error).message);
}

/** Override for custom array type with min/max. */
const fixture2 = make<Product>("Product", {
  overrides: {
    tags: arrayOf(() => make<TagItem>("TagItem"), { min: 5, max: 100 }),
  },
});
console.log("Fixture with array override:", fixture2);

/** Override with min only for array. */
const fixture3 = make<Product>("Product", {
  overrides: {
    tags: arrayOf(() => make<TagItem>("TagItem"), { min: 5 }),
  },
});
console.log("Fixture with min only:", fixture3);

/** Override with max only for array. */
const fixture4 = make<Product>("Product", {
  overrides: {
    tags: arrayOf(() => make<TagItem>("TagItem"), { max: 300 }),
  },
});
console.log("Fixture with max only:", fixture4);

/** Using isOneOf for a field. */
const fixture5 = make<Product>("Product", {
  overrides: {
    title: isOneOf(["Title 1", "Title 2"]),
    tags: arrayOf(() => make<TagItem>("TagItem"), {}),
  },
});
console.log("Fixture with isOneOf:", fixture5);

/** Fixed value override. */
const fixture6 = make<Product>("Product", {
  overrides: {
    price: 9.99,
    tags: arrayOf(() => make<TagItem>("TagItem"), {}),
  },
});
console.log("Fixture with fixed price:", fixture6);

/** Handling null/undefined for union or optional fields. */
const fixture7 = make<Product>("Product", {
  overrides: {
    tags: arrayOf(() => make<TagItem>("TagItem"), {}),
  },
});
console.log("Fixture possibly with null/undefined:", fixture7);

/** Verify ID is a UUID. */
console.log("ID should be UUID:", fixture7.id);
