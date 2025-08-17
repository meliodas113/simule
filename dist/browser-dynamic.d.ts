export interface ArrayOptions {
    min: number;
    max: number;
}
export type Override = any | (() => any);
export declare function make<T>(template: T, options?: {
    overrides?: Record<string, Override>;
}): T;
export declare function makeFromType<T>(typeDefinition: Record<string, any>, options?: {
    overrides?: Record<string, Override>;
}): T;
export declare function arrayOf<T>(generator: () => T, options?: ArrayOptions): T[];
export declare function isOneOf<T>(values: T[]): T;
export declare function defineType<T>(template: T): Record<string, any>;
export declare const types: {
    string: (nullable?: boolean, optional?: boolean) => "" | null | undefined;
    number: (nullable?: boolean, optional?: boolean) => 0 | null | undefined;
    boolean: (nullable?: boolean, optional?: boolean) => false | null | undefined;
    id: (nullable?: boolean, optional?: boolean) => "" | null | undefined;
    array: <T>(elementType: T, options?: ArrayOptions, nullable?: boolean, optional?: boolean) => any[] | null | undefined;
    object: <T extends Record<string, any>>(properties: T, nullable?: boolean, optional?: boolean) => T | null | undefined;
    nullable: <T>(value: T) => T;
    optional: <T>(value: T) => T;
    custom: <T>(generator: () => T) => T;
};
