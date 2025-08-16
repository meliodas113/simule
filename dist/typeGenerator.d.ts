import { Override } from "./types";
export declare function make<T>(typeName: string, options?: {
    overrides?: Record<string, Override>;
}): T;
