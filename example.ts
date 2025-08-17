/** Example usage of the simule package. */
import {
  make,
  arrayOf,
  isOneOf,
  makeDynamic,
  arrayOf as arrayOfDynamic,
  isOneOf as isOneOfDynamic,
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

// Create template object that matches your interface
const ProductTemplate: BrowserProduct = {
  id: "", // Will generate UUID
  title: "", // Will generate random string
  price: 0, // Will generate random number
  tags: [], // Will generate array of TagItems
  inStock: false, // Will generate random boolean
};

// Generate fixture using the dynamic browser solution
const browserFixture = makeDynamic(ProductTemplate, {
  overrides: {
    title: isOneOfDynamic(["Title 1", "Title 2"]),
    price: 9.99,
    tags: arrayOfDynamic(
      () =>
        makeDynamic({
          name: "",
          value: 0,
          isActive: false,
        }),
      { min: 5, max: 10 }
    ),
  },
});

console.log("Browser Product Fixture:", browserFixture);

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

const UserTemplate: User = {
  id: "",
  email: "",
  profile: {
    firstName: "",
    lastName: "",
    age: 0,
    preferences: [],
  },
  isVerified: false,
  lastLogin: null,
};

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

// The beauty: NO HARDCODING! Works with ANY type you provide!
