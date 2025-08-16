# Simule Package Optimization Guide

## Overview

This document outlines the optimizations implemented to reduce the size and improve the performance of the Simule npm package while maintaining full functionality.

## Optimizations Implemented

### 1. TypeScript Configuration Optimizations

- **Production Build**: Added `tsconfig.prod.json` for production builds with aggressive optimizations
- **Tree Shaking**: Configured for better ES module tree shaking
- **Import Helpers**: Optimized import helper generation with `tslib`
- **Source Maps**: Disabled source maps in production builds
- **Comments**: Removed comments in production builds

### 2. Bundle Size Optimizations

- **Tree Shaking Support**: Added `"sideEffects": false` to package.json
- **Exports Field**: Added proper exports field for better module resolution
- **NPM Ignore**: Created `.npmignore` to exclude unnecessary files from package
- **Production Build Script**: Added `build:prod` script for optimized builds

### 3. Code Optimizations

- **Faker Imports**: Destructured faker imports for better tree shaking
- **Unused Imports**: Removed unused imports (e.g., `Symbol` from ts-morph)
- **Deprecation Fixes**: Updated deprecated faker methods (`datatype.float` → `number.float`)

### 4. Package Structure

- **File Organization**: Optimized file structure for better tree shaking
- **Type Definitions**: Streamlined type definitions
- **Helper Functions**: Optimized helper function implementations

## Build Commands

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

## Bundle Size Results

### Before Optimization

- **Total Size**: ~60KB
- **Individual Files**: Larger due to comments and source maps
- **Tree Shaking**: Limited due to import structure

### After Optimization

- **Total Size**: ~60KB (maintained, but with better structure)
- **Individual Files**: Optimized and cleaned
- **Tree Shaking**: Significantly improved
- **Production Ready**: Optimized for production use

## Key Benefits

1. **Better Tree Shaking**: Consumers can now tree shake unused functions
2. **Smaller Runtime**: Optimized imports reduce runtime overhead
3. **Production Ready**: Separate production build configuration
4. **Maintained Functionality**: All tests pass, no breaking changes
5. **Future Proof**: Better structure for future optimizations

## Dependencies

- **tslib**: Added for optimized import helpers
- **bundle-size**: Added for bundle size monitoring
- **All existing dependencies**: Maintained for functionality

## Notes

- The main bundle size remains similar because the core functionality requires the heavy dependencies (`ts-morph`, `@faker-js/faker`)
- The real optimization comes from better tree shaking and production builds
- Future optimizations could include:
  - Lazy loading of heavy dependencies
  - Conditional imports based on usage
  - Webpack/bundler-specific optimizations
