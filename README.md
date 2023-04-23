# Jest TSD

The easiest way to test your TypeScript types with Jest.

- Zero-config
- Works with your current Jest setup
- Jest outputs specific, contextual, helpful error messages when tests fail
- Supports `test()`, `it()`, `describe()`, `.skip`, and `.only` in type tests
- Write your regular tests in either JavaScript or TypeScript

## Why

Because `jest-tsd` is the easiest to set up, easiest to use, least config option for testing your types with Jest, no matter what your current Jest setup looks like.

<!-- prettier-ignore -->
| ‎                                                                    | jest-tsd  | [jest-runner-tsd][2] | [tsd-lite][3] | [tsd][4] | [DIY w/tsc][0] | [DIY w/ts-jest][1] |
| --------------------------------------------------------------------------- | --------  | -------------------- | ------------- | -------- | -------------- | ------------------ |
| Is integrated with Jest                                                     | **x**     |  x                   |               |          |                | <sub>requires you to be using ts-jest to run all your tests</sub> |
| Integrates with your existing Jest setup                                    | **x**     |                      |               |          | ?              | ?                   |
| Only requires a single Jest config                                           | **x**     |                      |      n/a      | n/a      | x              | x                   |
| Outputs specific, contextual, helpful errors                                 | **x**     |  x                   |               |          |                | x                  |
| Outputs type test errors alongside all other test errors for that module    | **x**     |                      |               |          |                | x                  |
| Comes packaged with type based `expect` functions                           | **x**     |  x                   |      x        | x        |                |                    |
| Supports `test()`, `it()`, `describe()`, `.skip`, and `.only` in type tests | **x**     |                      |               |          |                | x                  |
| Allows your non-type tests to be written in JS **or** TS                    | **x**     |                      |      x        | x        |                |                    |

[0]: https://twitter.com/mattpocockuk/status/1646452575665893377
[1]: https://github.com/statelyai/xstate/blob/534f31d0f8942574bd460ea22a914c41a8aee6f3/packages/core/test/typegenTypes.test.ts
[2]: https://github.com/jest-community/jest-runner-tsd
[3]: https://github.com/mrazauskas/tsd-lite
[4]: https://github.com/SamVerschueren/tsd

## Install

```bash
# Install with npm
npm i -D jest-tsd @tsd/typescript

# Or install with yarn
yarn add --dev jest-tsd @tsd/typescript
```

> Note: `@tsd/typescript` will be used to compile your type tests. If you have compiling issues, adjust its version to match the version of `typescript` you have installed.

## Setup

Type tests are written in a separate `.test-d.ts` file from the rest of your tests, and then run from within your test file by calling `expectTypeTestsToPassAsync()`.

1. Call `expectTypeTestsToPassAsync()` in your Jest test file

   ```js
   // src/dir/foo.test.[jt]s

   import {expectTypeTestsToPassAsync} from 'jest-tsd'

   it('should not produce static type errors', async () => {
     await expectTypeTestsToPassAsync(__filename)
   })
   ```

   > If for some reason your `.test-d.ts` type definition test file is not co-located to your Jest test file, you can pass the definition test file's absolute path to `expectTypeTestsToPassAsync()` (instead of `__filename`).

1. Create a type definition test file `.test-d.ts` in the same directory with the same name as your Jest test file

   - e.g. If your Jest test is located at `src/dir/foo.test.js`, create a `src/dir/foo.test-d.ts` file
   - In your type definition test you can import the [assertion functions](#assertions) from `jest-tsd`

     ```ts
     // src/dir/foo.test-d.ts

     import {
       expectType,
       expectError,
       expectNotType,
       expectAssignable,
       expectNotAssignable,
       expectDeprecated,
       expectNotDeprecated,
     } from 'jest-tsd'

     test('Adding two numbers should produce a number', () => {
       expectType<number>(1 + 1)
       expectType<number>(2 + 2)
     })

     test('Partial<T> should make all keys optional', () => {
       expectAssignable<Partial<{a: string; b: string}>>({})
     })

     describe('arrays', () => {
       test('Array.from() can be called with a variety of types', () => {
         Array.from('foo')
         Array.from(new Set())
         Array.from([1, 2, 3])
         Array.from({length: 3}, (_, i) => i)
       })

       test('A plain object should not have a filter function', () => {
         expectError({}.filter((x: any) => x))
       })
     })
     ```

Keep in mind that your type definition tests aren't run or compiled, they are only statically analyzed by the compiler, and because of that you cannot use any dynamic statements. Meaning, you cannot use dynamic test names, or the `test.each`, `test.runIf`, `test.skipIf`, `test.concurrent` APIs. But you can use other familiar APIs, like `test`, `it`, `describe`, `.skip` and `.todo`.

## Assertions

These assertions are re-exported from tsd-lite:

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
