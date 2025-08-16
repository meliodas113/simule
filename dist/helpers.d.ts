import { ArrayOptions } from "./types";
export declare function isOneOf<T>(values: T[]): T;
export declare function arrayOf<T>(generator: () => T, options?: ArrayOptions): T[];
