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
