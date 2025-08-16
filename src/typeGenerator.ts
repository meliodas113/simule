import { Type, Symbol } from "ts-morph";
import { faker } from "@faker-js/faker";
import { findTypeByName } from "./projectLoader";
import { ArrayOptions, Override } from "./types";

/**
 * Generates a fixture for a given TypeScript type.
 * @param type The TypeScript type to generate a fixture for.
 * @param fieldName The name of the field being processed.
 * @param override Optional override value or function.
 * @param isRoot Whether this is the root type.
 * @param overrides Optional record of overrides for nested fields.
 * @returns The generated fixture value.
 */
function generateForType(
  type: Type,
  fieldName: string,
  override?: Override,
  isRoot = false,
  overrides: Record<string, Override> = {}
): any {
  // Handle overrides
  if (override !== undefined) {
    if (typeof override === "function") return override();
    return override;
  }

  // Handle array types
  if (type.isArray()) {
    const elementType = type.getArrayElementType();
    if (!elementType) {
      throw new Error(
        `Array element type for "${fieldName}" could not be determined.`
      );
    }
    const options: ArrayOptions = { min: 3, max: 8 };
    const arrayLength = faker.number.int({
      min: options.min,
      max: options.max,
    });
    return Array(arrayLength)
      .fill(null)
      .map(() =>
        generateForType(elementType, fieldName, undefined, false, overrides)
      );
  }

  // Handle primitive types
  if (type.isString()) {
    if (fieldName.toLowerCase() === "id") {
      return faker.string.uuid();
    }
    return faker.lorem.word();
  }
  if (type.isNumber()) {
    return faker.number.int({ min: 0, max: 100 });
  }
  if (type.isBoolean()) {
    return faker.datatype.boolean();
  }
  if (type.isNull()) {
    return null;
  }
  if (type.isUndefined()) {
    return undefined;
  }

  // Handle union types
  if (type.isUnion()) {
    const unionTypes = type.getUnionTypes().filter((t) => !t.isUndefined());
    if (unionTypes.length === 0) {
      return undefined;
    }
    const nonNullTypes = unionTypes.filter((t) => !t.isNull());
    if (
      nonNullTypes.length > 0 &&
      faker.datatype.float({ min: 0, max: 1 }) > 0.2
    ) {
      const randomType = faker.helpers.arrayElement(nonNullTypes);
      return generateForType(
        randomType,
        fieldName,
        undefined,
        false,
        overrides
      );
    }
    return null;
  }

  // Handle object types
  if (type.isObject() && !type.isArray()) {
    const aliasSymbol = type.getAliasSymbol() || type.getSymbol();
    if (!isRoot && aliasSymbol) {
      const override = overrides[fieldName];
      if (override !== undefined) {
        if (typeof override === "function") return override();
        return override;
      }
      throw new Error(
        `Custom type "${aliasSymbol.getName()}" for field "${fieldName}" requires an override (e.g., () => make<CustomType>('CustomType'))`
      );
    }

    const properties = type.getProperties();
    const result: Record<string, any> = {};

    for (const prop of properties) {
      const propName = prop.getName();
      const propType = prop.getTypeAtLocation(prop.getValueDeclaration()!);
      const isOptional = prop.isOptional();

      if (
        isOptional &&
        !isRoot &&
        faker.datatype.float({ min: 0, max: 1 }) < 0.3
      ) {
        continue;
      }

      result[propName] = generateForType(
        propType,
        propName,
        overrides[propName],
        false,
        overrides
      );
    }

    return result;
  }

  throw new Error(
    `Unsupported type for field "${fieldName}": ${type.getText()}`
  );
}

/**
 * Generates a fixture for a TypeScript type by name.
 * @param typeName The name of the type or interface.
 * @param options Optional overrides for fields.
 * @returns The generated fixture object.
 */
export function make<T>(
  typeName: string,
  options: { overrides?: Record<string, Override> } = {}
): T {
  const type = findTypeByName(typeName);
  const result = generateForType(
    type,
    typeName,
    undefined,
    true,
    options.overrides || {}
  );
  return result as T;
}
