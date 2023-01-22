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

export async function expectTypeTestsToPass(...pathToTypeDefTest: string[]): {
  assertionsCount: number;
  tsdResults: TsdResult;
};

export {
  expectType,
  expectError,
  expectAssignable,
  expectDeprecated,
  expectNotAssignable,
  expectNotDeprecated,
  expectNotType,
};
