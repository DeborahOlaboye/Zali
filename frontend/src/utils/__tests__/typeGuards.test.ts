import {
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isFunction,
  isUndefined,
  isNull,
  isNullish,
  isAddress,
  isHash,
  isBigInt,
  isFormData,
  isFile,
  isBlob,
  isError,
  isErrorWithMessage,
  isErrorWithCode,
  isPromise,
  isDate,
  isValidDate,
  isValidURL,
  isJSONString,
  hasProperty,
  hasProperties,
  isNonEmptyArray,
  isArrayOf,
  isStringArray,
  isNumberArray,
  isRecord,
  isStringRecord,
  isNumberRecord,
  assertIsString,
  assertIsNumber,
  asString,
  asNumber,
  asBoolean,
  asArray,
  asObject,
  safeGet,
  safeGetString,
  safeGetNumber,
  safeJSONParse,
  safeLocalStorageGet,
  safeLocalStorageSet,
} from '../typeGuards';

describe('Type Guards', () => {
  describe('Primitive type guards', () => {
    it('should correctly identify strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
    });

    it('should correctly identify numbers', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-123)).toBe(true);
      expect(isNumber(123.45)).toBe(true);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber('123')).toBe(false);
      expect(isNumber(null)).toBe(false);
    });

    it('should correctly identify booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean('true')).toBe(false);
    });

    it('should correctly identify objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject([])).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isObject('object')).toBe(false);
    });

    it('should correctly identify arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray({})).toBe(false);
      expect(isArray('array')).toBe(false);
    });

    it('should correctly identify functions', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function() {})).toBe(true);
      expect(isFunction(async () => {})).toBe(true);
      expect(isFunction('function')).toBe(false);
      expect(isFunction({})).toBe(false);
    });

    it('should correctly identify undefined and null', () => {
      expect(isUndefined(undefined)).toBe(true);
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined('')).toBe(false);

      expect(isNull(null)).toBe(true);
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);

      expect(isNullish(null)).toBe(true);
      expect(isNullish(undefined)).toBe(true);
      expect(isNullish(0)).toBe(false);
      expect(isNullish('')).toBe(false);
    });
  });

  describe('Web3 type guards', () => {
    it('should correctly identify Ethereum addresses', () => {
      expect(isAddress('0x1234567890123456789012345678901234567890')).toBe(true);
      expect(isAddress('0xAbCdEf1234567890123456789012345678901234')).toBe(true);
      expect(isAddress('1234567890123456789012345678901234567890')).toBe(false);
      expect(isAddress('0x123')).toBe(false);
      expect(isAddress('0xGHIJ567890123456789012345678901234567890')).toBe(false);
    });

    it('should correctly identify transaction hashes', () => {
      expect(isHash('0x1234567890123456789012345678901234567890123456789012345678901234')).toBe(true);
      expect(isHash('0xabcdef1234567890123456789012345678901234567890123456789012345678')).toBe(true);
      expect(isHash('1234567890123456789012345678901234567890123456789012345678901234')).toBe(false);
      expect(isHash('0x123')).toBe(false);
    });

    it('should correctly identify bigint values', () => {
      expect(isBigInt(BigInt(123))).toBe(true);
      expect(isBigInt(123n)).toBe(true);
      expect(isBigInt(123)).toBe(false);
      expect(isBigInt('123')).toBe(false);
    });
  });

  describe('DOM and File type guards', () => {
    it('should correctly identify FormData', () => {
      const formData = new FormData();
      expect(isFormData(formData)).toBe(true);
      expect(isFormData({})).toBe(false);
      expect(isFormData('formdata')).toBe(false);
    });

    it('should correctly identify File objects', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      expect(isFile(file)).toBe(true);
      expect(isFile({})).toBe(false);
      expect(isFile('file')).toBe(false);
    });

    it('should correctly identify Blob objects', () => {
      const blob = new Blob(['content'], { type: 'text/plain' });
      expect(isBlob(blob)).toBe(true);
      expect(isBlob({})).toBe(false);
      expect(isBlob('blob')).toBe(false);
    });
  });

  describe('Error type guards', () => {
    it('should correctly identify Error objects', () => {
      expect(isError(new Error('test'))).toBe(true);
      expect(isError(new TypeError('test'))).toBe(true);
      expect(isError({ message: 'test' })).toBe(false);
      expect(isError('error')).toBe(false);
    });

    it('should correctly identify errors with messages', () => {
      const error = new Error('test message');
      expect(isErrorWithMessage(error)).toBe(true);
      expect(isErrorWithMessage({ message: 'test' })).toBe(false);
    });

    it('should correctly identify errors with codes', () => {
      const error = new Error('test') as Error & { code: number };
      error.code = 404;
      expect(isErrorWithCode(error)).toBe(true);
      expect(isErrorWithCode(new Error('test'))).toBe(false);
    });
  });

  describe('Promise type guards', () => {
    it('should correctly identify Promise objects', () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise(new Promise(() => {}))).toBe(true);
      expect(isPromise({ then: () => {}, catch: () => {} })).toBe(true);
      expect(isPromise({})).toBe(false);
      expect(isPromise('promise')).toBe(false);
    });
  });

  describe('Date type guards', () => {
    it('should correctly identify Date objects', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('invalid'))).toBe(true); // Invalid dates are still Date objects
      expect(isDate('2023-01-01')).toBe(false);
      expect(isDate(1234567890)).toBe(false);
    });

    it('should correctly identify valid dates', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('2023-01-01'))).toBe(true);
      expect(isValidDate(new Date('invalid'))).toBe(false);
      expect(isValidDate('2023-01-01')).toBe(false);
    });
  });

  describe('URL type guards', () => {
    it('should correctly identify valid URLs', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://localhost:3000')).toBe(true);
      expect(isValidURL('ftp://files.example.com')).toBe(true);
      expect(isValidURL('not-a-url')).toBe(false);
      expect(isValidURL('example.com')).toBe(false);
    });
  });

  describe('JSON type guards', () => {
    it('should correctly identify JSON strings', () => {
      expect(isJSONString('{"key": "value"}')).toBe(true);
      expect(isJSONString('[1, 2, 3]')).toBe(true);
      expect(isJSONString('"string"')).toBe(true);
      expect(isJSONString('123')).toBe(true);
      expect(isJSONString('invalid json')).toBe(false);
      expect(isJSONString('{key: value}')).toBe(false);
    });
  });

  describe('Property checking', () => {
    it('should correctly check for properties', () => {
      const obj = { name: 'test', age: 25 };
      expect(hasProperty(obj, 'name')).toBe(true);
      expect(hasProperty(obj, 'age')).toBe(true);
      expect(hasProperty(obj, 'email')).toBe(false);
      expect(hasProperty('string', 'length')).toBe(false);
    });

    it('should correctly check for multiple properties', () => {
      const obj = { name: 'test', age: 25, email: 'test@example.com' };
      expect(hasProperties(obj, ['name', 'age'])).toBe(true);
      expect(hasProperties(obj, ['name', 'age', 'email'])).toBe(true);
      expect(hasProperties(obj, ['name', 'phone'])).toBe(false);
    });
  });

  describe('Array type guards', () => {
    it('should correctly identify non-empty arrays', () => {
      expect(isNonEmptyArray([1, 2, 3])).toBe(true);
      expect(isNonEmptyArray(['a'])).toBe(true);
      expect(isNonEmptyArray([])).toBe(false);
      expect(isNonEmptyArray('array')).toBe(false);
    });

    it('should correctly validate array contents', () => {
      expect(isArrayOf([1, 2, 3], isNumber)).toBe(true);
      expect(isArrayOf(['a', 'b', 'c'], isString)).toBe(true);
      expect(isArrayOf([1, 'a', 3], isNumber)).toBe(false);
      expect(isArrayOf([], isString)).toBe(true); // Empty array is valid
    });

    it('should correctly identify string arrays', () => {
      expect(isStringArray(['a', 'b', 'c'])).toBe(true);
      expect(isStringArray([])).toBe(true);
      expect(isStringArray([1, 2, 3])).toBe(false);
      expect(isStringArray(['a', 1, 'c'])).toBe(false);
    });

    it('should correctly identify number arrays', () => {
      expect(isNumberArray([1, 2, 3])).toBe(true);
      expect(isNumberArray([])).toBe(true);
      expect(isNumberArray(['a', 'b', 'c'])).toBe(false);
      expect(isNumberArray([1, 'a', 3])).toBe(false);
    });
  });

  describe('Record type guards', () => {
    it('should correctly validate record contents', () => {
      expect(isRecord({ a: 'hello', b: 'world' }, isString)).toBe(true);
      expect(isRecord({ a: 1, b: 2 }, isNumber)).toBe(true);
      expect(isRecord({ a: 'hello', b: 2 }, isString)).toBe(false);
      expect(isRecord({}, isString)).toBe(true); // Empty object is valid
    });

    it('should correctly identify string records', () => {
      expect(isStringRecord({ a: 'hello', b: 'world' })).toBe(true);
      expect(isStringRecord({})).toBe(true);
      expect(isStringRecord({ a: 1, b: 2 })).toBe(false);
      expect(isStringRecord({ a: 'hello', b: 2 })).toBe(false);
    });

    it('should correctly identify number records', () => {
      expect(isNumberRecord({ a: 1, b: 2 })).toBe(true);
      expect(isNumberRecord({})).toBe(true);
      expect(isNumberRecord({ a: 'hello', b: 'world' })).toBe(false);
      expect(isNumberRecord({ a: 1, b: 'hello' })).toBe(false);
    });
  });

  describe('Assertion functions', () => {
    it('should assert string types correctly', () => {
      expect(() => assertIsString('hello')).not.toThrow();
      expect(() => assertIsString(123)).toThrow(TypeError);
      expect(() => assertIsString(null)).toThrow(TypeError);
    });

    it('should assert number types correctly', () => {
      expect(() => assertIsNumber(123)).not.toThrow();
      expect(() => assertIsNumber('123')).toThrow(TypeError);
      expect(() => assertIsNumber(null)).toThrow(TypeError);
    });
  });

  describe('Type conversion with defaults', () => {
    it('should convert to string with defaults', () => {
      expect(asString('hello')).toBe('hello');
      expect(asString(123)).toBe('');
      expect(asString(null)).toBe('');
      expect(asString(undefined, 'default')).toBe('default');
    });

    it('should convert to number with defaults', () => {
      expect(asNumber(123)).toBe(123);
      expect(asNumber('123')).toBe(0);
      expect(asNumber(null)).toBe(0);
      expect(asNumber(undefined, 42)).toBe(42);
    });

    it('should convert to boolean with defaults', () => {
      expect(asBoolean(true)).toBe(true);
      expect(asBoolean(false)).toBe(false);
      expect(asBoolean(1)).toBe(false);
      expect(asBoolean(null, true)).toBe(true);
    });

    it('should convert to array with defaults', () => {
      expect(asArray([1, 2, 3])).toEqual([1, 2, 3]);
      expect(asArray('not array')).toEqual([]);
      expect(asArray(null, [1, 2])).toEqual([1, 2]);
    });

    it('should convert to object with defaults', () => {
      const obj = { a: 1 };
      expect(asObject(obj)).toEqual(obj);
      expect(asObject('not object')).toEqual({});
      expect(asObject(null, { default: true })).toEqual({ default: true });
    });
  });

  describe('Safe property access', () => {
    const testObj = {
      name: 'test',
      age: 25,
      active: true,
      tags: ['a', 'b', 'c'],
      invalid: null,
    };

    it('should safely get typed properties', () => {
      expect(safeGet(testObj, 'name', isString)).toBe('test');
      expect(safeGet(testObj, 'age', isNumber)).toBe(25);
      expect(safeGet(testObj, 'invalid', isString)).toBeUndefined();
      expect(safeGet(testObj, 'nonexistent', isString)).toBeUndefined();
    });

    it('should safely get string properties', () => {
      expect(safeGetString(testObj, 'name')).toBe('test');
      expect(safeGetString(testObj, 'age')).toBeUndefined();
      expect(safeGetString(testObj, 'nonexistent')).toBeUndefined();
    });

    it('should safely get number properties', () => {
      expect(safeGetNumber(testObj, 'age')).toBe(25);
      expect(safeGetNumber(testObj, 'name')).toBeUndefined();
      expect(safeGetNumber(testObj, 'nonexistent')).toBeUndefined();
    });
  });

  describe('Safe JSON operations', () => {
    it('should safely parse JSON', () => {
      expect(safeJSONParse('{"key": "value"}')).toEqual({ key: 'value' });
      expect(safeJSONParse('[1, 2, 3]')).toEqual([1, 2, 3]);
      expect(safeJSONParse('invalid json')).toBeNull();
    });

    it('should safely parse JSON with validation', () => {
      const result = safeJSONParse('{"name": "test"}', (val): val is { name: string } => 
        isObject(val) && hasProperty(val, 'name') && isString(val.name)
      );
      expect(result).toEqual({ name: 'test' });

      const invalid = safeJSONParse('{"age": 25}', (val): val is { name: string } => 
        isObject(val) && hasProperty(val, 'name') && isString(val.name)
      );
      expect(invalid).toBeNull();
    });
  });

  describe('Safe localStorage operations', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should safely set and get localStorage values', () => {
      const testData = { name: 'test', age: 25 };
      
      expect(safeLocalStorageSet('test-key', testData)).toBe(true);
      expect(safeLocalStorageGet('test-key')).toEqual(testData);
      expect(safeLocalStorageGet('nonexistent-key')).toBeNull();
    });

    it('should safely get localStorage values with validation', () => {
      const testData = { name: 'test', age: 25 };
      safeLocalStorageSet('test-key', testData);

      const result = safeLocalStorageGet('test-key', (val): val is { name: string; age: number } =>
        isObject(val) && 
        hasProperty(val, 'name') && isString(val.name) &&
        hasProperty(val, 'age') && isNumber(val.age)
      );
      expect(result).toEqual(testData);

      const invalid = safeLocalStorageGet('test-key', (val): val is { email: string } =>
        isObject(val) && hasProperty(val, 'email') && isString(val.email)
      );
      expect(invalid).toBeNull();
    });
  });
});