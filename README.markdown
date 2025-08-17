# Simule

A TypeScript fixture generator using runtime type inference with ts-morph and faker.js.

## Installation

Install using npm or Yarn:

```bash
# Using npm
npm install simule

# Using Yarn
yarn add simule
```

## Usage

Ensure your project has a `tsconfig.json` and your types are defined in included files.

```ts
import { make, arrayOf, isOneOf } from "simule";

type Product = {
  id: string;
  title: string | null;
  price: number;
  tags?: TagItem[];
  inStock: boolean;
};
type TagItem = { name: string; value: number };

const fixture = make<Product>("Product", {
  overrides: {
    tags: arrayOf(() => make<TagItem>("TagItem"), { min: 5, max: 100 }),
    title: isOneOf(["Title 1", "Title 2"]),
    price: 9.99,
  },
});
```

## Browser-Compatible Version

For browser environments, use the dynamic version that works with ANY type:

```ts
import { makeDynamic, arrayOf, isOneOf } from "simule/browser";

interface Product {
  id: string;
  title: string | null;
  price: number;
  tags?: TagItem[];
  inStock: boolean;
}

interface TagItem {
  name: string;
  value: number;
}

// Create template object that matches your interface
const ProductTemplate: Product = {
  id: "", // Will generate UUID
  title: "", // Will generate random string
  price: 0, // Will generate random number
  tags: [], // Will generate array of TagItems
  inStock: false, // Will generate random boolean
};

// Generate fixtures using the dynamic solution
const fixture = makeDynamic(ProductTemplate, {
  overrides: {
    title: isOneOf(["Title 1", "Title 2"]),
    price: 9.99,
  },
});
```

### Browser Version Features

- **No Node.js Dependencies**: Works in any JavaScript environment
- **Works with ANY Type**: No hardcoding - works with any interface you define
- **Automatic Type Inference**: Analyzes your template and generates appropriate data
- **Smart Field Detection**: Automatically detects ID fields, email fields, price fields, etc.
- **Complex Type Support**: Handles nested objects, arrays, unions, and custom types
- **Type Safety**: Full TypeScript support
- **No Metadata Required**: Just create template objects and get fixtures

See `example.ts` for comprehensive examples.

## Environment Requirements

- **Node.js**: Required for main package (version 14+ recommended)
- **TypeScript Project**: Must have a `tsconfig.json` file (main package only)
- **File System Access**: Package reads TypeScript files from disk (main package only)
- **Browser Compatible**: Use `simule/browser` for browser environments

## Features

- **Random data for builtins**: Generates strings, numbers, and booleans using faker.js.
- **UUID for 'id' fields**: Automatically uses UUID for string fields named 'id'.
- **Arrays**: Generates 2-1000 items by default; override with `arrayOf(generator, {min?, max?})` (clamped to 1-1000).
- **Unions/null/optional**: Randomly sets null/undefined (~20% chance) for `| null` or optional (`?`) fields.
- **Custom types**: Throws if no override is provided for custom types; use `() => make<Custom>('Custom')`.
- **OneOf**: Use `isOneOf([values])` for random selection from a list.
- **Overrides**: Supports fixed values or generator functions for specific fields.

## Development & Build

### Build Commands

```bash
# Development build (with source maps and comments)
npm run build

# Production build (optimized, no source maps, no comments)
npm run build:prod

# Bundle analysis
npm run analyze

# Size check
npm run size
```

### Bundle Optimization

Simule is optimized for production use with:

- **Tree Shaking Support**: `"sideEffects": false` for better bundle optimization
- **ES Modules**: Full ES module support for modern bundlers
- **Production Builds**: Separate production configuration for minimal bundle size
- **NPM Package Size**: Only **4.9 kB** (compressed) / **13.0 kB** (unpacked)

## Limitations

- **Node.js Only**: Main package cannot be used in browser environments
- Requires type name as string argument (e.g., `make<Product>('Product')`).
- Assumes unique type names in the project.
- Must run in a TypeScript project with a `tsconfig.json`.
- Supports simple types only (no complex generics).

See `example.ts` for more usage scenarios.

## Testing

Run tests using npm or Yarn:

```bash
# Using npm
npm test

# Using Yarn
yarn test
```

## Performance & Optimization

For detailed information about the optimizations implemented, see [OPTIMIZATION.md](./OPTIMIZATION.md).

## Browser Alternative

If you need a browser-compatible fixture generator, use:

- **`simule/browser`**: Dynamic version included in this package
- **Faker.js directly** with manual type definitions
- **JSON Schema** based generators
- **Runtime type validation libraries** like Zod or io-ts
