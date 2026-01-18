/**
 * Type checking and validation utilities for enhanced type safety
 */

// Type guards for primitive types
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isArray = <T = unknown>(value: unknown): value is T[] => {
  return Array.isArray(value);
};

export const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function';
};

export const isUndefined = (value: unknown): value is undefined => {
  return typeof value === 'undefined';
};

export const isNull = (value: unknown): value is null => {
  return value === null;
};

export const isNullish = (value: unknown): value is null | undefined => {
  return value === null || value === undefined;
};

// Type guards for React types
export const isReactElement = (value: unknown): value is React.ReactElement => {
  return (
    isObject(value) &&
    'type' in value &&
    'props' in value &&
    '$$typeof' in value
  );
};

export const isReactNode = (value: unknown): value is React.ReactNode => {
  return (
    isString(value) ||
    isNumber(value) ||
    isBoolean(value) ||
    isNull(value) ||
    isUndefined(value) ||
    isReactElement(value) ||
    (isArray(value) && value.every(isReactNode))
  );
};

// Type guards for Web3 types
export const isAddress = (value: unknown): value is `0x${string}` => {
  return isString(value) && /^0x[a-fA-F0-9]{40}$/.test(value);
};

export const isHash = (value: unknown): value is `0x${string}` => {
  return isString(value) && /^0x[a-fA-F0-9]{64}$/.test(value);
};

export const isBigInt = (value: unknown): value is bigint => {
  return typeof value === 'bigint';
};

// Type guards for form data
export const isFormData = (value: unknown): value is FormData => {
  return value instanceof FormData;
};

export const isFile = (value: unknown): value is File => {
  return value instanceof File;
};

export const isBlob = (value: unknown): value is Blob => {
  return value instanceof Blob;
};

// Type guards for DOM elements
export const isHTMLElement = (value: unknown): value is HTMLElement => {
  return value instanceof HTMLElement;
};

export const isInputElement = (value: unknown): value is HTMLInputElement => {
  return value instanceof HTMLInputElement;
};

export const isButtonElement = (value: unknown): value is HTMLButtonElement => {
  return value instanceof HTMLButtonElement;
};

export const isFormElement = (value: unknown): value is HTMLFormElement => {
  return value instanceof HTMLFormElement;
};

// Type guards for events
export const isMouseEvent = (value: unknown): value is MouseEvent => {
  return value instanceof MouseEvent;
};

export const isKeyboardEvent = (value: unknown): value is KeyboardEvent => {
  return value instanceof KeyboardEvent;
};

export const isFocusEvent = (value: unknown): value is FocusEvent => {
  return value instanceof FocusEvent;
};

export const isChangeEvent = (value: unknown): value is Event & { target: HTMLInputElement } => {
  return (
    value instanceof Event &&
    'target' in value &&
    isInputElement(value.target)
  );
};

// Type guards for errors
export const isError = (value: unknown): value is Error => {
  return value instanceof Error;
};

export const isErrorWithMessage = (value: unknown): value is Error & { message: string } => {
  return isError(value) && isString(value.message);
};

export const isErrorWithCode = (value: unknown): value is Error & { code: number } => {
  return isError(value) && 'code' in value && isNumber(value.code);
};

// Type guards for promises
export const isPromise = <T = unknown>(value: unknown): value is Promise<T> => {
  return (
    isObject(value) &&
    'then' in value &&
    isFunction(value.then) &&
    'catch' in value &&
    isFunction(value.catch)
  );
};

// Type guards for dates
export const isDate = (value: unknown): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};

export const isValidDate = (value: unknown): value is Date => {
  return isDate(value) && !isNaN(value.getTime());
};

// Type guards for URLs
export const isURL = (value: unknown): value is URL => {
  return value instanceof URL;
};

export const isValidURL = (value: unknown): value is string => {
  if (!isString(value)) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// Type guards for JSON
export const isJSONString = (value: unknown): value is string => {
  if (!isString(value)) return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

// Generic type guards
export const hasProperty = <T extends string>(
  obj: unknown,
  prop: T
): obj is Record<T, unknown> => {
  return isObject(obj) && prop in obj;
};

export const hasProperties = <T extends readonly string[]>(
  obj: unknown,
  props: T
): obj is Record<T[number], unknown> => {
  return isObject(obj) && props.every(prop => prop in obj);
};

export const isOfType = <T>(
  value: unknown,
  validator: (val: unknown) => val is T
): value is T => {
  return validator(value);
};

// Array type guards
export const isNonEmptyArray = <T>(value: unknown): value is [T, ...T[]] => {
  return isArray<T>(value) && value.length > 0;
};

export const isArrayOf = <T>(
  value: unknown,
  validator: (item: unknown) => item is T
): value is T[] => {
  return isArray(value) && value.every(validator);
};

export const isStringArray = (value: unknown): value is string[] => {
  return isArrayOf(value, isString);
};

export const isNumberArray = (value: unknown): value is number[] => {
  return isArrayOf(value, isNumber);
};

// Object type guards
export const isRecord = <T>(
  value: unknown,
  validator: (val: unknown) => val is T
): value is Record<string, T> => {
  return (
    isObject(value) &&
    Object.values(value).every(validator)
  );
};

export const isStringRecord = (value: unknown): value is Record<string, string> => {
  return isRecord(value, isString);
};

export const isNumberRecord = (value: unknown): value is Record<string, number> => {
  return isRecord(value, isNumber);
};

// Utility functions for type narrowing
export const assertIsString = (value: unknown): asserts value is string => {
  if (!isString(value)) {
    throw new TypeError(`Expected string, got ${typeof value}`);
  }
};

export const assertIsNumber = (value: unknown): asserts value is number => {
  if (!isNumber(value)) {
    throw new TypeError(`Expected number, got ${typeof value}`);
  }
};

export const assertIsObject = (value: unknown): asserts value is Record<string, unknown> => {
  if (!isObject(value)) {
    throw new TypeError(`Expected object, got ${typeof value}`);
  }
};

export const assertIsArray = <T = unknown>(value: unknown): asserts value is T[] => {
  if (!isArray<T>(value)) {
    throw new TypeError(`Expected array, got ${typeof value}`);
  }
};

export const assertIsFunction = (value: unknown): asserts value is Function => {
  if (!isFunction(value)) {
    throw new TypeError(`Expected function, got ${typeof value}`);
  }
};

// Type narrowing with default values
export const asString = (value: unknown, defaultValue = ''): string => {
  return isString(value) ? value : defaultValue;
};

export const asNumber = (value: unknown, defaultValue = 0): number => {
  return isNumber(value) ? value : defaultValue;
};

export const asBoolean = (value: unknown, defaultValue = false): boolean => {
  return isBoolean(value) ? value : defaultValue;
};

export const asArray = <T = unknown>(value: unknown, defaultValue: T[] = []): T[] => {
  return isArray<T>(value) ? value : defaultValue;
};

export const asObject = <T extends Record<string, unknown> = Record<string, unknown>>(
  value: unknown,
  defaultValue = {} as T
): T => {
  return isObject(value) ? value as T : defaultValue;
};

// Type-safe property access
export const safeGet = <T>(
  obj: Record<string, unknown>,
  key: string,
  validator: (val: unknown) => val is T
): T | undefined => {
  const value = obj[key];
  return validator(value) ? value : undefined;
};

export const safeGetString = (obj: Record<string, unknown>, key: string): string | undefined => {
  return safeGet(obj, key, isString);
};

export const safeGetNumber = (obj: Record<string, unknown>, key: string): number | undefined => {
  return safeGet(obj, key, isNumber);
};

export const safeGetBoolean = (obj: Record<string, unknown>, key: string): boolean | undefined => {
  return safeGet(obj, key, isBoolean);
};

export const safeGetArray = <T = unknown>(
  obj: Record<string, unknown>,
  key: string
): T[] | undefined => {
  return safeGet(obj, key, isArray<T>);
};

// Type-safe JSON parsing
export const safeJSONParse = <T = unknown>(
  json: string,
  validator?: (val: unknown) => val is T
): T | null => {
  try {
    const parsed = JSON.parse(json);
    return validator ? (validator(parsed) ? parsed : null) : parsed;
  } catch {
    return null;
  }
};

// Type-safe localStorage operations
export const safeLocalStorageGet = <T = unknown>(
  key: string,
  validator?: (val: unknown) => val is T
): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return safeJSONParse(item, validator);
  } catch {
    return null;
  }
};

export const safeLocalStorageSet = (key: string, value: unknown): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};