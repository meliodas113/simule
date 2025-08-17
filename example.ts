/** Example usage of the simule package. */
import {
  make,
  arrayOf,
  isOneOf,
  makeDynamic,
  arrayOf as arrayOfDynamic,
  isOneOf as isOneOfDynamic,
  defineType,
} from "simule";

// Example 1: Node.js version (requires ts-morph, works with TypeScript files)
type Product = {
  id: string;
  title: string | null;
  price: number;
  tags?: TagItem[];
  inStock: boolean;
};

type TagItem = { name: string; value: number };

// This works in Node.js environments with tsconfig.json
// const fixture = make<Product>("Product", {
//   overrides: {
//     tags: arrayOf(() => make<TagItem>("TagItem"), { min: 5, max: 100 }),
//     title: isOneOf(["Title 1", "Title 2"]),
//     price: 9.99,
//   },
// });

// Example 2: Browser version (works anywhere, no ts-morph dependency)
interface BrowserProduct {
  id: string;
  title: string | null;
  price: number;
  tags?: BrowserTagItem[];
  inStock: boolean;
}

interface BrowserTagItem {
  name: string;
  value: number;
  isActive: boolean;
}

// Solution 1: Use defineType helper (RECOMMENDED for complex types)
const ProductTemplate1 = defineType<BrowserProduct>({
  id: "", // Will generate UUID
  title: "", // Will generate random string
  price: 0, // Will generate random number
  tags: arrayOf(() => ({ name: "", value: 0, isActive: false }), {
    min: 3,
    max: 8,
  }),
  inStock: false, // Will generate random boolean
});

// Solution 2: Provide multiple sample items
const ProductTemplate2: BrowserProduct = {
  id: "",
  title: "",
  price: 0,
  tags: [
    { name: "", value: 0, isActive: false },
    { name: "", value: 0, isActive: false },
    { name: "", value: 0, isActive: false },
  ], // Will generate 3-8 TagItems
  inStock: false,
};

// Solution 3: Use arrayOf in overrides
const ProductTemplate3: BrowserProduct = {
  id: "",
  title: "",
  price: 0,
  tags: [], // Empty array
  inStock: false,
};

// Generate fixtures using different approaches
const browserFixture1 = makeDynamic(ProductTemplate1, {
  overrides: {
    title: isOneOfDynamic(["Title 1", "Title 2"]),
    price: 9.99,
  },
});

const browserFixture2 = makeDynamic(ProductTemplate2, {
  overrides: {
    title: isOneOfDynamic(["Title 1", "Title 2"]),
    price: 9.99,
  },
});

const browserFixture3 = makeDynamic(ProductTemplate3, {
  overrides: {
    title: isOneOfDynamic(["Title 1", "Title 2"]),
    price: 9.99,
    tags: arrayOfDynamic(() => ({ name: "", value: 0, isActive: false }), {
      min: 5,
      max: 10,
    }),
  },
});

console.log("Browser Product Fixture 1 (defineType):", browserFixture1);
console.log("Browser Product Fixture 2 (multiple samples):", browserFixture2);
console.log("Browser Product Fixture 3 (overrides):", browserFixture3);

// Example 3: Different types work automatically
interface User {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    age: number;
    preferences: string[];
  };
  isVerified: boolean;
  lastLogin: Date | null;
}

const UserTemplate = defineType<User>({
  id: "",
  email: "",
  profile: {
    firstName: "",
    lastName: "",
    age: 0,
    preferences: arrayOf(() => "", { min: 2, max: 5 }), // Array of strings
  },
  isVerified: false,
  lastLogin: null,
});

const userFixture = makeDynamic(UserTemplate, {
  overrides: {
    email: "user@example.com",
    age: 25,
  },
});

console.log("User Fixture:", userFixture);

// Example 4: Built-in types work too
const StringArrayTemplate = [""]; // Will generate array of random strings
const NumberArrayTemplate = [0]; // Will generate array of random numbers
const BooleanArrayTemplate = [false]; // Will generate array of random booleans

const stringArray = makeDynamic(StringArrayTemplate);
const numberArray = makeDynamic(NumberArrayTemplate);
const booleanArray = makeDynamic(BooleanArrayTemplate);

console.log("String Array:", stringArray);
console.log("Number Array:", numberArray);
console.log("Boolean Array:", booleanArray);

// Example 5: Complex nested arrays
interface Category {
  id: string;
  name: string;
  products: BrowserProduct[];
  subcategories?: Category[];
}

const CategoryTemplate: Category = {
  id: "",
  name: "",
  products: [], // Will be overridden
  subcategories: [], // Will be overridden
};

const categoryFixture = makeDynamic(CategoryTemplate, {
  overrides: {
    products: arrayOfDynamic(() => ProductTemplate1, { min: 2, max: 5 }),
    subcategories: arrayOfDynamic(
      () => ({
        id: "",
        name: "",
        products: arrayOfDynamic(() => ProductTemplate1, { min: 1, max: 3 }),
        subcategories: [],
      }),
      { min: 0, max: 3 }
    ),
  },
});
console.log("Complex Category Fixture:", categoryFixture);

// The beauty: NO HARDCODING! Works with ANY type you provide!
// And you have full control over array sizes!
