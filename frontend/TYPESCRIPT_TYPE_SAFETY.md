# TypeScript Type Safety System

This document describes the comprehensive TypeScript type safety system implemented in the Zali application.

## Overview

The type safety system provides:

- **Comprehensive type definitions** for all components and utilities
- **Strict TypeScript configuration** with maximum type safety
- **Type guards and validation utilities** for runtime type checking
- **Type-safe API client** with validation and error handling
- **Form validation** with Zod schema integration
- **Web3 type safety** for blockchain interactions

## Type Definitions

### Component Types (`/src/types/components.ts`)

Comprehensive type definitions for all React components:

```typescript
import { ButtonProps, CardProps, ModalProps } from '@/types/components';

// Usage example
const MyButton: React.FC<ButtonProps> = ({ variant, size, children, ...props }) => {
  return <button className={getButtonClasses(variant, size)} {...props}>{children}</button>;
};
```

**Key Features:**
- Base component props with `className` and `data-testid`
- Variant and size type unions for consistent styling
- Accessibility props integration
- Generic component props for reusability

### Web3 Types (`/src/types/web3.ts`)

Type-safe Web3 and blockchain interactions:

```typescript
import { Address, Hash, ContractCall } from '@/types/web3';

// Usage example
const transferTokens = async (to: Address, amount: bigint): Promise<Hash> => {
  const call: ContractCall = {
    functionName: 'transfer',
    args: [to, amount],
  };
  return await writeContract(call);
};
```

**Key Features:**
- Branded types for addresses and hashes
- Contract interaction type safety
- Transaction state management
- Token and balance type definitions

### Form Types (`/src/types/forms.ts`)

Type-safe form handling with validation:

```typescript
import { FormFieldProps, ValidationResult } from '@/types/forms';
import { usernameSchema } from '@/types/forms';

// Usage example
const UsernameField: React.FC<FormFieldProps<string>> = ({ name, error, ...props }) => {
  return (
    <div>
      <input {...props} aria-invalid={!!error} />
      {error && <span role="alert">{error.message}</span>}
    </div>
  );
};
```

**Key Features:**
- Zod schema integration
- Form field component types
- Multi-step form support
- Validation result types

## Type Guards (`/src/utils/typeGuards.ts`)

Runtime type checking utilities:

```typescript
import { isString, isAddress, assertIsNumber, safeGet } from '@/utils/typeGuards';

// Usage examples
if (isString(userInput)) {
  // userInput is now typed as string
  console.log(userInput.toUpperCase());
}

if (isAddress(walletAddress)) {
  // walletAddress is now typed as Address
  await sendTransaction({ to: walletAddress });
}

// Assertion with error throwing
assertIsNumber(value); // throws if not number
// value is now typed as number

// Safe property access
const name = safeGet(userData, 'name', isString); // string | undefined
```

**Available Type Guards:**

### Primitive Types
- `isString(value)` - Check if value is string
- `isNumber(value)` - Check if value is number (not NaN)
- `isBoolean(value)` - Check if value is boolean
- `isObject(value)` - Check if value is object (not array/null)
- `isArray<T>(value)` - Check if value is array
- `isFunction(value)` - Check if value is function

### Web3 Types
- `isAddress(value)` - Check if value is valid Ethereum address
- `isHash(value)` - Check if value is valid transaction hash
- `isBigInt(value)` - Check if value is bigint

### DOM Types
- `isHTMLElement(value)` - Check if value is HTML element
- `isInputElement(value)` - Check if value is input element
- `isFormElement(value)` - Check if value is form element

### Utility Functions
- `hasProperty(obj, prop)` - Check if object has property
- `isArrayOf(arr, validator)` - Check if array contains only valid items
- `safeJSONParse(json, validator?)` - Parse JSON with optional validation

## API Client (`/src/utils/apiClient.ts`)

Type-safe API client with validation:

```typescript
import { TypeSafeApiClient, createApiResponseSchema } from '@/utils/apiClient';
import { z } from 'zod';

// Create client
const api = new TypeSafeApiClient('https://api.example.com');

// Define response schema
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

const userResponseSchema = createApiResponseSchema(userSchema);

// Type-safe API call
const response = await api.get('/users/123', {}, userResponseSchema);
// response.data is now typed as { id: number; name: string; email: string; }
```

**Features:**
- Automatic retry with exponential backoff
- Request/response validation with Zod
- Custom error classes with detailed information
- Caching utilities for responses
- Mock client for testing

## Configuration

### Base TypeScript Config (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Strict Development Config (`tsconfig.strict.json`)

For maximum type safety during development:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noPropertyAccessFromIndexSignature": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Usage Examples

### Component with Type Safety

```typescript
import React from 'react';
import { ButtonProps } from '@/types/components';
import { isString } from '@/utils/typeGuards';

interface MyButtonProps extends ButtonProps {
  loading?: boolean;
}

export const MyButton: React.FC<MyButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className = '',
  'data-testid': testId,
  ...props
}) => {
  // Type-safe class name generation
  const getVariantClass = (variant: ButtonProps['variant']): string => {
    const classes = {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-gray-600 text-white',
      outline: 'border-2 border-blue-600 text-blue-600',
      ghost: 'text-blue-600 hover:bg-blue-50',
      danger: 'bg-red-600 text-white',
    } as const;
    
    return classes[variant];
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`${getVariantClass(variant)} ${className}`}
      disabled={isDisabled}
      data-testid={testId}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
```

### Form with Type Safety

```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usernameSchema, RegistrationFormData } from '@/types/forms';
import { isString } from '@/utils/typeGuards';

export const RegistrationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(usernameSchema),
  });

  const onSubmit = async (data: RegistrationFormData): Promise<void> => {
    // data.username is guaranteed to be a valid string
    try {
      await registerUser(data.username);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Registration failed:', error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          {...register('username')}
          aria-invalid={!!errors.username}
        />
        {errors.username && (
          <span role="alert">{errors.username.message}</span>
        )}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};
```

### Web3 Integration with Type Safety

```typescript
import { useAccount, useContractWrite } from 'wagmi';
import { Address, ContractCall } from '@/types/web3';
import { isAddress, assertIsString } from '@/utils/typeGuards';

export const useTokenTransfer = () => {
  const { address } = useAccount();

  const transferTokens = async (
    to: string,
    amount: string
  ): Promise<void> => {
    // Type-safe validation
    if (!isAddress(to)) {
      throw new Error('Invalid recipient address');
    }

    assertIsString(amount);
    const amountBigInt = BigInt(amount);

    if (!address) {
      throw new Error('Wallet not connected');
    }

    const call: ContractCall = {
      functionName: 'transfer',
      args: [to, amountBigInt],
    };

    // Type-safe contract interaction
    await writeContract(call);
  };

  return { transferTokens };
};
```

## Best Practices

### 1. Use Type Guards for Runtime Validation

```typescript
// Good - Runtime type checking
function processUserData(data: unknown): void {
  if (isObject(data) && hasProperty(data, 'name') && isString(data.name)) {
    // data.name is now safely typed as string
    console.log(data.name.toUpperCase());
  }
}

// Bad - Unsafe type assertion
function processUserDataUnsafe(data: unknown): void {
  const user = data as { name: string }; // Dangerous!
  console.log(user.name.toUpperCase()); // Could crash
}
```

### 2. Use Branded Types for Domain-Specific Values

```typescript
// Good - Branded types prevent mixing different string types
type UserId = string & { readonly __brand: 'UserId' };
type Email = string & { readonly __brand: 'Email' };

const createUserId = (id: string): UserId => id as UserId;
const createEmail = (email: string): Email => email as Email;

function sendEmail(userId: UserId, email: Email): void {
  // Type-safe - can't accidentally swap parameters
}

// Bad - Plain strings can be mixed up
function sendEmailUnsafe(userId: string, email: string): void {
  // Could accidentally swap userId and email
}
```

### 3. Use Const Assertions for Immutable Data

```typescript
// Good - Readonly array with specific types
const BUTTON_VARIANTS = ['primary', 'secondary', 'outline'] as const;
type ButtonVariant = typeof BUTTON_VARIANTS[number]; // 'primary' | 'secondary' | 'outline'

// Bad - Mutable array with generic string type
const BUTTON_VARIANTS_BAD = ['primary', 'secondary', 'outline'];
type ButtonVariantBad = string; // Too broad
```

### 4. Use Generic Constraints for Flexible Types

```typescript
// Good - Generic with constraints
interface ApiResponse<T extends Record<string, unknown>> {
  data: T;
  success: boolean;
}

function processApiResponse<T extends Record<string, unknown>>(
  response: ApiResponse<T>
): T {
  return response.data;
}

// Bad - Unconstrained generic
interface ApiResponseBad<T> {
  data: T;
  success: boolean;
}
```

### 5. Use Utility Types for Transformations

```typescript
// Good - Use utility types for transformations
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Omit<User, 'password'>; // Safe public interface
type UserUpdate = Partial<Pick<User, 'name' | 'email'>>; // Update interface

// Bad - Duplicate interfaces
interface PublicUserBad {
  id: number;
  name: string;
  email: string;
}
```

## Testing Type Safety

### Unit Tests for Type Guards

```typescript
import { isString, isAddress, safeGet } from '@/utils/typeGuards';

describe('Type Guards', () => {
  it('should correctly identify strings', () => {
    expect(isString('hello')).toBe(true);
    expect(isString(123)).toBe(false);
    expect(isString(null)).toBe(false);
  });

  it('should correctly identify addresses', () => {
    expect(isAddress('0x1234567890123456789012345678901234567890')).toBe(true);
    expect(isAddress('invalid')).toBe(false);
  });

  it('should safely access object properties', () => {
    const obj = { name: 'test', age: 25 };
    expect(safeGet(obj, 'name', isString)).toBe('test');
    expect(safeGet(obj, 'age', isString)).toBeUndefined();
  });
});
```

### Component Type Testing

```typescript
import { render } from '@testing-library/react';
import { MyButton } from './MyButton';

describe('MyButton', () => {
  it('should render with correct variant classes', () => {
    const { container } = render(
      <MyButton variant="primary" size="lg">
        Click me
      </MyButton>
    );
    
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-blue-600', 'text-white');
  });

  it('should handle loading state correctly', () => {
    const { getByRole } = render(
      <MyButton loading>Click me</MyButton>
    );
    
    const button = getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Loading...');
  });
});
```

## Migration Guide

### From Untyped to Typed Components

1. **Add type imports:**
```typescript
// Before
import React from 'react';

// After
import React from 'react';
import { ButtonProps } from '@/types/components';
```

2. **Update component props:**
```typescript
// Before
interface MyComponentProps {
  title: string;
  onClick: () => void;
}

// After
interface MyComponentProps extends BaseComponentProps {
  title: string;
  onClick: ClickHandler;
}
```

3. **Add type guards for runtime validation:**
```typescript
// Before
function handleUserInput(input: any) {
  console.log(input.name.toUpperCase());
}

// After
function handleUserInput(input: unknown) {
  if (isObject(input) && hasProperty(input, 'name') && isString(input.name)) {
    console.log(input.name.toUpperCase());
  }
}
```

## Performance Considerations

### Type-Only Imports

```typescript
// Good - Type-only import (no runtime cost)
import type { ButtonProps } from '@/types/components';

// Bad - Value import when only type is needed
import { ButtonProps } from '@/types/components';
```

### Conditional Type Guards

```typescript
// Good - Early return for performance
function processData(data: unknown): string | null {
  if (!isObject(data)) return null;
  if (!hasProperty(data, 'name')) return null;
  if (!isString(data.name)) return null;
  
  return data.name.toUpperCase();
}

// Bad - Nested conditions
function processDataBad(data: unknown): string | null {
  if (isObject(data) && hasProperty(data, 'name') && isString(data.name)) {
    return data.name.toUpperCase();
  }
  return null;
}
```

## Troubleshooting

### Common TypeScript Errors

1. **Property does not exist on type 'unknown'**
   - Solution: Use type guards before accessing properties

2. **Argument of type 'string' is not assignable to parameter of type 'Address'**
   - Solution: Use branded types and validation functions

3. **Object is possibly 'undefined'**
   - Solution: Use optional chaining or type guards

4. **Type 'any' is not assignable to type 'never'**
   - Solution: Add proper type annotations and avoid `any`

### Debug Mode

Enable strict TypeScript checking:

```bash
# Use strict configuration
npx tsc --project tsconfig.strict.json --noEmit

# Check specific files
npx tsc --noEmit src/components/MyComponent.tsx
```

## Future Enhancements

- **Runtime type validation** with automatic schema generation
- **GraphQL integration** with type-safe queries
- **API mocking** with type-safe mock data generation
- **Performance monitoring** for type guard usage
- **Automated type testing** with property-based testing