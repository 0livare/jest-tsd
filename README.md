# Jest TSD

The easiest way to test your TS types with Jest.

## Install

```bash
# Install with npm
npm i -D jest-tsd @tsd/typescript

# Or install with yarn
yarn add --dev jest-tsd @tsd/typescript
```

> Note: `@tsd/typescript` will be used to compile your type tests. If you have compiling issues, adjust its version to match the version of `typescript` you have installed.

## Setup

1. Create a type definition test file `.test-d.ts` in the same directory with the same name as your Jest test file

   - e.g. If your Jest test is located at `src/dir/foo.test.js`, create a `src/dir/foo.test-d.ts` file
   - In your type definition test you can import the assertion functions from `jest-tsd`

     ```js
     import { expectType } from 'jest-tsd';
     ```

1. Add a test to your Jest test file

   ```js
   import { expectTypeTestsToPassAsync } from 'jest-tsd';

   it('should not produce static type errors', async () => {
     await expectTypeTestsToPassAsync(__filename);
   });
   ```

   > If for some reason your type definition file(s) are not co-located to your Jest test file, you can pass absolute path(s) to them to `expectTypeTestsToPassAsync()` instead of `__filename`.

## Assertions

These assertions are re-exported from [tsd](https://github.com/SamVerschueren/tsd/blob/main/readme.md#assertions).

### expectType&lt;T&gt;(expression: T)

Asserts that the type of `expression` is identical to type `T`.

### expectError&lt;T = any&gt;(expression: T)

Asserts that `expression` throws an error.

### expectNotType&lt;T&gt;(expression: any)

Asserts that the type of `expression` is not identical to type `T`.

### expectAssignable&lt;T&gt;(expression: T)

Asserts that the type of `expression` is assignable to type `T`.

### expectNotAssignable&lt;T&gt;(expression: any)

Asserts that the type of `expression` is not assignable to type `T`.

### expectDeprecated(expression: any)

Asserts that `expression` is marked as [`@deprecated`](https://jsdoc.app/tags-deprecated.html).

### expectNotDeprecated(expression: any)

Asserts that `expression` is not marked as [`@deprecated`](https://jsdoc.app/tags-deprecated.html).
