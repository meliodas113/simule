import { faker } from "@faker-js/faker";

// Optimize faker imports for tree shaking
const {
  string: { uuid },
  lorem: { word },
  number: { int, float },
  datatype: { boolean },
  helpers: { arrayElement },
} = faker;

export interface ArrayOptions {
  min: number;
  max: number;
}

export type Override = any | (() => any);

/**
 * Dynamic type analyzer that can infer types from any object or value
 */
class DynamicTypeAnalyzer {
  /**
   * Analyze a value and return its type information
   */
  static analyze(value: any): { type: string; isArray: boolean; elementType?: string; isNullable: boolean; isOptional: boolean } {
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
  
  /**
   * Get the type name of a value
   */
  private static getTypeName(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    return typeof value;
  }
}

/**
 * Dynamic fixture generator that works with any type
 */
class DynamicFixtureGenerator {
  /**
   * Generate a fixture for any type dynamically
   */
  static generate<T>(template: T, overrides: Record<string, Override> = {}): T {
    if (template === null || template === undefined) {
      return template;
    }
    
    if (typeof template === 'string') {
      return this.generateString(template, overrides) as T;
    }
    
    if (typeof template === 'number') {
      return this.generateNumber(template, overrides) as T;
    }
    
    if (typeof template === 'boolean') {
      return this.generateBoolean(template, overrides) as T;
    }
    
    if (Array.isArray(template)) {
      return this.generateArray(template, overrides) as T;
    }
    
    if (typeof template === 'object') {
      return this.generateObject(template, overrides) as T;
    }
    
    if (typeof template === 'function') {
      return template() as T;
    }
    
    return template;
  }
  
  /**
   * Generate a string value
   */
  private static generateString(value: string, overrides: Record<string, Override>): string {
    // Check if this looks like an ID field
    if (value.toLowerCase().includes('id') || value === '') {
      return uuid();
    }
    
    // Generate random string
    return word();
  }
  
  /**
   * Generate a number value
   */
  private static generateNumber(value: number, overrides: Record<string, Override>): number {
    // If it's 0, generate a random number
    if (value === 0) {
      return int({ min: 0, max: 100 });
    }
    
    // If it's a small number, generate around that range
    if (value < 100) {
      return int({ min: Math.max(0, value - 10), max: value + 10 });
    }
    
    // Generate a random number in a reasonable range
    return int({ min: 0, max: 1000 });
  }
  
  /**
   * Generate a boolean value
   */
  private static generateBoolean(value: boolean, overrides: Record<string, Override>): boolean {
    return boolean();
  }
  
  /**
   * Generate an array value
   */
  private static generateArray(array: any[], overrides: Record<string, Override>): any[] {
    if (array.length === 0) {
      // Empty array - generate 3-8 items of appropriate type
      const length = int({ min: 3, max: 8 });
      return Array(length).fill(null);
    }
    
    // Use first element as template
    const elementTemplate = array[0];
    const length = int({ min: 3, max: 8 });
    
    return Array(length)
      .fill(null)
      .map(() => this.generate(elementTemplate, overrides));
  }
  
  /**
   * Generate an object value
   */
  private static generateObject(obj: Record<string, any>, overrides: Record<string, Override>): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Skip functions
      if (typeof value === 'function') continue;
      
      // Check for overrides first
      if (overrides[key] !== undefined) {
        result[key] = typeof overrides[key] === 'function' ? overrides[key]() : overrides[key];
        continue;
      }
      
      // Generate value based on its type
      result[key] = this.generate(value, overrides);
    }
    
    return result;
  }
}

/**
 * Main make function that works with ANY type dynamically
 */
export function make<T>(
  template: T,
  options: { overrides?: Record<string, Override> } = {}
): T {
  return DynamicFixtureGenerator.generate(template, options.overrides || {});
}

/**
 * Alternative: Generate fixture from a type definition object
 */
export function makeFromType<T>(
  typeDefinition: Record<string, any>,
  options: { overrides?: Record<string, Override> } = {}
): T {
  const result: any = {};
  
  for (const [fieldName, fieldValue] of Object.entries(typeDefinition)) {
    // Check for overrides first
    if (options.overrides && options.overrides[fieldName] !== undefined) {
      const override = options.overrides[fieldName];
      result[fieldName] = typeof override === 'function' ? override() : override;
      continue;
    }
    
    // Analyze the field type
    const typeInfo = DynamicTypeAnalyzer.analyze(fieldValue);
    
    // Generate appropriate value based on type
    result[fieldName] = generateValueFromTypeInfo(fieldName, typeInfo);
  }
  
  return result as T;
}

/**
 * Generate a value based on type information
 */
function generateValueFromTypeInfo(fieldName: string, typeInfo: any): any {
  // Handle nullable/optional fields
  if (typeInfo.isNullable && float({ min: 0, max: 1 }) < 0.2) {
    return null;
  }
  
  if (typeInfo.isOptional && float({ min: 0, max: 1 }) < 0.3) {
    return undefined;
  }
  
  // Generate based on type
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
      // Handle array types
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
        // For custom types, return array of nulls
        return Array(length).fill(null);
      }
      
      // Handle object types
      if (typeInfo.type === 'object') {
        return {};
      }
      
      return null;
  }
}

/**
 * Generates an array of values with specified min/max length
 */
export function arrayOf<T>(
  generator: () => T,
  options: ArrayOptions = { min: 3, max: 8 }
): T[] {
  const min = Math.max(options.min ?? 3, 0);
  const max = Math.min(options.max ?? 1000, 1000);
  const clampedMin = Math.min(min, max);
  const length = int({ min: clampedMin, max });
  return Array(length)
    .fill(null)
    .map(() => generator());
}

/**
 * Returns a random element from the provided values
 */
export function isOneOf<T>(values: T[]): T {
  return arrayElement(values);
}

/**
 * Create a dynamic type definition from an interface
 */
export function defineType<T>(template: T): Record<string, any> {
  return template as Record<string, any>;
}

/**
 * Helper function to create type definitions with specific constraints
 */
export const types = {
  string: (nullable = false, optional = false) => nullable ? null : optional ? undefined : '',
  number: (nullable = false, optional = false) => nullable ? null : optional ? undefined : 0,
  boolean: (nullable = false, optional = false) => nullable ? null : optional ? undefined : false,
  id: (nullable = false, optional = false) => nullable ? null : optional ? undefined : '',
  array: <T>(elementType: T, options?: ArrayOptions, nullable = false, optional = false) => 
    nullable ? null : optional ? undefined : Array(options?.min ?? 3).fill(elementType),
  object: <T extends Record<string, any>>(properties: T, nullable = false, optional = false) => 
    nullable ? null : optional ? undefined : properties,
  nullable: <T>(value: T) => value,
  optional: <T>(value: T) => value,
  custom: <T>(generator: () => T) => generator()
};
