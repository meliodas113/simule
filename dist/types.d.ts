export type OverrideValue = any | (() => any);
export interface MakeOptions {
    overrides?: Record<string, OverrideValue>;
}
export type TagItem = {
    name: string;
    value: number;
};
export type Product = {
    id: string;
    title: string | null;
    price: number;
    tags?: TagItem[];
    inStock: boolean;
};
export type SimpleType = {
    name: string;
    age: number;
    active: boolean;
};
export type WithId = {
    id: string;
};
export type WithArray = {
    items: string[];
};
export type WithCustom = {
    custom: SimpleType;
};
export type WithUnion = {
    title: string | null;
};
export type WithOptional = {
    tags?: string[];
};
export interface ArrayOptions {
    min: number;
    max: number;
}
export type Override = any | (() => any);
