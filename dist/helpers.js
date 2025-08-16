import { faker } from "@faker-js/faker";
const { number: { int }, helpers: { arrayElement }, } = faker;
export function isOneOf(values) {
    return arrayElement(values);
}
export function arrayOf(generator, options = { min: 3, max: 8 }) {
    const min = Math.max(options.min ?? 3, 0);
    const max = Math.min(options.max ?? 1000, 1000);
    const clampedMin = Math.min(min, max);
    const length = int({ min: clampedMin, max });
    return Array(length)
        .fill(null)
        .map(() => generator());
}
