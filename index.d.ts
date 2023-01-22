import {
  expectType,
  expectError,
  expectAssignable,
  expectDeprecated,
  expectNotAssignable,
  expectNotDeprecated,
  expectNotType,
  TsdResult,
} from 'tsd-lite';

type ShortTsdResult = {
  messageText: TsdResult['messageText'];
  file: {
    pos: number;
    end: number;
    fileName: string;
  };
};

/**
 * A helper function to assist with running static TS type definition tests
 * that utilize tsd.
 *
 * @param pathToTypeDefTest Paths to `.test-d.ts` files. If the passed paths
 * do not end in `.test-d.tsx?`, a best attempt will be made to change the
 * file extension to be correct.
 *
 * Pro tip: If your Jest test file and your type def test have the same
 * filename excluding the extensions, you can just pass __filename to this
 * function.
 */
export async function expectTypeTestsToPassAsync(
  ...pathToTypeDefTest: string[]
): {
  assertionsCount: number;
  tsdResults: ShortTsdResult;
};

export {
  expectType,
  expectError,
  expectNotType,
  expectAssignable,
  expectNotAssignable,
  expectDeprecated,
  expectNotDeprecated,
};
