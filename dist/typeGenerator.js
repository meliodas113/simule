import { faker } from "@faker-js/faker";
import { findTypeByName } from "./projectLoader";
const { string: { uuid }, lorem: { word }, number: { int, float }, datatype: { boolean }, helpers: { arrayElement }, } = faker;
function generateForType(type, fieldName, override, isRoot = false, overrides = {}) {
    if (override !== undefined) {
        if (typeof override === "function")
            return override();
        return override;
    }
    if (type.isArray()) {
        const elementType = type.getArrayElementType();
        if (!elementType) {
            throw new Error(`Array element type for "${fieldName}" could not be determined.`);
        }
        const options = { min: 3, max: 8 };
        const arrayLength = int({
            min: options.min,
            max: options.max,
        });
        return Array(arrayLength)
            .fill(null)
            .map(() => generateForType(elementType, fieldName, undefined, false, overrides));
    }
    if (type.isString()) {
        if (fieldName.toLowerCase() === "id") {
            return uuid();
        }
        return word();
    }
    if (type.isNumber()) {
        return int({ min: 0, max: 100 });
    }
    if (type.isBoolean()) {
        return boolean();
    }
    if (type.isNull()) {
        return null;
    }
    if (type.isUndefined()) {
        return undefined;
    }
    if (type.isUnion()) {
        const unionTypes = type.getUnionTypes().filter((t) => !t.isUndefined());
        if (unionTypes.length === 0) {
            return undefined;
        }
        const nonNullTypes = unionTypes.filter((t) => !t.isNull());
        if (nonNullTypes.length > 0 && float({ min: 0, max: 1 }) > 0.2) {
            const randomType = arrayElement(nonNullTypes);
            return generateForType(randomType, fieldName, undefined, false, overrides);
        }
        return null;
    }
    if (type.isObject() && !type.isArray()) {
        const aliasSymbol = type.getAliasSymbol() || type.getSymbol();
        if (!isRoot && aliasSymbol) {
            const override = overrides[fieldName];
            if (override !== undefined) {
                if (typeof override === "function")
                    return override();
                return override;
            }
            throw new Error(`Custom type "${aliasSymbol.getName()}" for field "${fieldName}" requires an override (e.g., () => make<CustomType>('CustomType'))`);
        }
        const properties = type.getProperties();
        const result = {};
        for (const prop of properties) {
            const propName = prop.getName();
            const propType = prop.getTypeAtLocation(prop.getValueDeclaration());
            const isOptional = prop.isOptional();
            if (isOptional && !isRoot && float({ min: 0, max: 1 }) < 0.3) {
                continue;
            }
            result[propName] = generateForType(propType, propName, overrides[propName], false, overrides);
        }
        return result;
    }
    throw new Error(`Unsupported type for field "${fieldName}": ${type.getText()}`);
}
export function make(typeName, options = {}) {
    const type = findTypeByName(typeName);
    const result = generateForType(type, typeName, undefined, true, options.overrides || {});
    return result;
}
