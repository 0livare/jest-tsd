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

export async function expectTypeTestsToPass(...pathToTypeDefTest: string[]): {
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
