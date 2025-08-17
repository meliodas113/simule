/** Main entry point for the simule package. Exports the primary make function and helper utilities. */
export { make } from "./typeGenerator";
export { arrayOf, isOneOf } from "./helpers";

// Browser-compatible exports (dynamic, no ts-morph dependency)
export {
  make as makeDynamic,
  makeFromType,
  arrayOf as arrayOfDynamic,
  isOneOf as isOneOfDynamic,
  types,
  defineType,
} from "./browser-dynamic";
