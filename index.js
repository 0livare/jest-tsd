const tsdImport = require('tsd-lite');
const tsd = tsdImport.default;

const { convertPathsToTypeDefTest } = require('./path-massager');

async function expectTypeTestsToPassAsync(...pathToTypeDefTest) {
  const testFiles = convertPathsToTypeDefTest(...pathToTypeDefTest);
  const { assertionsCount, tsdResults } = tsd(...testFiles);

  const shortResults = tsdResults.map((r) => ({
    messageText: r.messageText,
    file: {
      pos: r.file.pos,
      end: r.file.end,
      fileName: r.file.fileName,
    },
  }));

  // Don't pass to jest or log the full results because they make
  // the jest output unreadable. But the full results are still
  // available via the return value though if the user need them
  // for diagnostic purposes.
  if (shortResults.length) console.error(shortResults);
  expect(shortResults).toHaveLength(0);

  return {
    assertionsCount,
    tsdResults,
    shortResults,
    receivedPaths: pathToTypeDefTest,
    testFiles,
  };
}

module.exports = {
  expectTypeTestsToPassAsync,

  expectType: tsdImport.expectType,
  expectError: tsdImport.expectError,
  expectAssignable: tsdImport.expectAssignable,
  expectDeprecated: tsdImport.expectDeprecated,
  expectNotAssignable: tsdImport.expectNotAssignable,
  expectNotDeprecated: tsdImport.expectNotDeprecated,
  expectNotType: tsdImport.expectNotType,
};
