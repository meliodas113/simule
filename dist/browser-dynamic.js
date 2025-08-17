import { faker } from "@faker-js/faker";
const { string: { uuid }, lorem: { word }, number: { int, float }, datatype: { boolean }, helpers: { arrayElement }, } = faker;
class DynamicTypeAnalyzer {
    static analyze(value) {
        if (value === null) {
            return { type: 'null', isArray: false, isNullable: true, isOptional: false };
        }
        if (value === undefined) {
            return { type: 'undefined', isArray: false, isNullable: false, isOptional: true };
        }
        if (Array.isArray(value)) {
            const elementType = value.length > 0 ? this.getTypeName(value[0]) : 'any';
            return {
                type: `${elementType}[]`,
                isArray: true,
                elementType,
                isNullable: false,
                isOptional: false
            };
        }
        if (typeof value === 'object') {
            return {
                type: 'object',
                isArray: false,
                isNullable: false,
                isOptional: false
            };
        }
        return {
            type: typeof value,
            isArray: false,
            isNullable: false,
            isOptional: false
        };
    }
    static getTypeName(value) {
        if (value === null)
            return 'null';
        if (value === undefined)
            return 'undefined';
        if (Array.isArray(value))
            return 'array';
        if (typeof value === 'object')
            return 'object';
        return typeof value;
    }
}
class DynamicFixtureGenerator {
    static generate(template, overrides = {}) {
        if (template === null || template === undefined) {
            return template;
        }
        if (typeof template === 'string') {
            return this.generateString(template, overrides);
        }
        if (typeof template === 'number') {
            return this.generateNumber(template, overrides);
        }
        if (typeof template === 'boolean') {
            return this.generateBoolean(template, overrides);
        }
        if (Array.isArray(template)) {
            return this.generateArray(template, overrides);
        }
        if (typeof template === 'object') {
            return this.generateObject(template, overrides);
        }
        if (typeof template === 'function') {
            return template();
        }
        return template;
    }
    static generateString(value, overrides) {
        if (value.toLowerCase().includes('id') || value === '') {
            return uuid();
        }
        return word();
    }
    static generateNumber(value, overrides) {
        if (value === 0) {
            return int({ min: 0, max: 100 });
        }
        if (value < 100) {
            return int({ min: Math.max(0, value - 10), max: value + 10 });
        }
        return int({ min: 0, max: 1000 });
    }
    static generateBoolean(value, overrides) {
        return boolean();
    }
    static generateArray(array, overrides) {
        if (array.length === 0) {
            const length = int({ min: 3, max: 8 });
            return Array(length).fill(null);
        }
        const elementTemplate = array[0];
        const length = int({ min: 3, max: 8 });
        return Array(length)
            .fill(null)
            .map(() => this.generate(elementTemplate, overrides));
    }
    static generateObject(obj, overrides) {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'function')
                continue;
            if (overrides[key] !== undefined) {
                result[key] = typeof overrides[key] === 'function' ? overrides[key]() : overrides[key];
                continue;
            }
            result[key] = this.generate(value, overrides);
        }
        return result;
    }
}
export function make(template, options = {}) {
    return DynamicFixtureGenerator.generate(template, options.overrides || {});
}
export function makeFromType(typeDefinition, options = {}) {
    const result = {};
    for (const [fieldName, fieldValue] of Object.entries(typeDefinition)) {
        if (options.overrides && options.overrides[fieldName] !== undefined) {
            const override = options.overrides[fieldName];
            result[fieldName] = typeof override === 'function' ? override() : override;
            continue;
        }
        const typeInfo = DynamicTypeAnalyzer.analyze(fieldValue);
        result[fieldName] = generateValueFromTypeInfo(fieldName, typeInfo);
    }
    return result;
}
function generateValueFromTypeInfo(fieldName, typeInfo) {
    if (typeInfo.isNullable && float({ min: 0, max: 1 }) < 0.2) {
        return null;
    }
    if (typeInfo.isOptional && float({ min: 0, max: 1 }) < 0.3) {
        return undefined;
    }
    switch (typeInfo.type) {
        case 'string':
            if (fieldName.toLowerCase().includes('id')) {
                return uuid();
            }
            if (fieldName.toLowerCase().includes('email')) {
                return `${word()}@example.com`;
            }
            if (fieldName.toLowerCase().includes('name')) {
                return word();
            }
            return word();
        case 'number':
            if (fieldName.toLowerCase().includes('price') || fieldName.toLowerCase().includes('cost')) {
                return int({ min: 10, max: 1000 });
            }
            if (fieldName.toLowerCase().includes('age')) {
                return int({ min: 18, max: 80 });
            }
            if (fieldName.toLowerCase().includes('rating')) {
                return int({ min: 1, max: 5 });
            }
            return int({ min: 0, max: 100 });
        case 'boolean':
            return boolean();
        case 'null':
            return null;
        case 'undefined':
            return undefined;
        default:
            if (typeInfo.isArray) {
                const length = int({ min: 3, max: 8 });
                if (typeInfo.elementType === 'string') {
                    return Array(length).fill('').map(() => word());
                }
                if (typeInfo.elementType === 'number') {
                    return Array(length).fill(0).map(() => int({ min: 0, max: 100 }));
                }
                if (typeInfo.elementType === 'boolean') {
                    return Array(length).fill(false).map(() => boolean());
                }
                return Array(length).fill(null);
            }
            if (typeInfo.type === 'object') {
                return {};
            }
            return null;
    }
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
export function isOneOf(values) {
    return arrayElement(values);
}
export function defineType(template) {
    return template;
}
export const types = {
    string: (nullable = false, optional = false) => nullable ? null : optional ? undefined : '',
    number: (nullable = false, optional = false) => nullable ? null : optional ? undefined : 0,
    boolean: (nullable = false, optional = false) => nullable ? null : optional ? undefined : false,
    id: (nullable = false, optional = false) => nullable ? null : optional ? undefined : '',
    array: (elementType, options, nullable = false, optional = false) => nullable ? null : optional ? undefined : Array(options?.min ?? 3).fill(elementType),
    object: (properties, nullable = false, optional = false) => nullable ? null : optional ? undefined : properties,
    nullable: (value) => value,
    optional: (value) => value,
    custom: (generator) => generator()
};
