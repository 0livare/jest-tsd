const tsdImport = require('tsd-lite');
const tsd = tsdImport.default;

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
async function expectTypeTestsToPass(...pathToTypeDefTest) {
  const testFiles = pathToTypeDefTest.map((p) => {
    let testPath = p.replace(/.test.[jt]sx?$/, `.test-d.ts`);
    if (p.endsWith('x')) testPath += 'x';
    return testPath;
  });

  const { assertionsCount, tsdResults } = tsd(...testFiles);

  const results = tsdResults.map((r) => ({
    messageText: r.messageText,
    file: {
      pos: r.file.pos,
      end: r.file.end,
      fileName: r.file.fileName,
    },
  }));

  if (tsdResults.length) console.error(results);
  expect(results).toHaveLength(0);

  return { assertionsCount, tsdResults };
}

module.exports = {
  expectTypeTestsToPass,

  expectType: tsdImport.expectType,
  expectError: tsdImport.expectError,
  expectAssignable: tsdImport.expectAssignable,
  expectDeprecated: tsdImport.expectDeprecated,
  expectNotAssignable: tsdImport.expectNotAssignable,
  expectNotDeprecated: tsdImport.expectNotDeprecated,
  expectNotType: tsdImport.expectNotType,
};
