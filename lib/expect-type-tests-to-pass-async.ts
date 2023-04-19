import {getTsdResults} from './get-tsd-results'

/**
 * A helper function to assist with running static TS type definition tests
 * that utilize tsd.
 *
 * @param pathToTypeDefTest Path to a `.test-d.ts` file. If the passed path
 * doesn't end in `.test-d.tsx?`, a best attempt will be made to change the
 * file extension to be correct.
 *
 * Pro tip: If your Jest test file and your type def test have the same
 * filename excluding the extensions, you can just pass `__filename` to this
 * function.
 */
export async function expectTypeTestsToPassAsync(pathToTypeDefTest: string) {
  const {
    allTestsPassed,
    assertionsCount,
    testFilePath,

    tsdResults,
    shortResults,
    errorCodeFrame,
  } = await getTsdResults(pathToTypeDefTest)

  // Don't pass to jest or log the full results because they make
  // the jest output unreadable. But the full results are still
  // available via the return value though if the user need them
  // for diagnostic purposes.
  if (!allTestsPassed) console.error(errorCodeFrame)
  expect(shortResults).toHaveLength(0)

  return {
    receivedPath: pathToTypeDefTest,
    testFilePath,

    assertionsCount,
    tsdResults,
    shortResults,
  }
}
