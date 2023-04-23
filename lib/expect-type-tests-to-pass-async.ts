import {getTsdResults} from './get-tsd-results'

expect.extend({
  __noTypeErrors(received, {allTestsPassed, formattedMaybeErrorResults, shortResults}) {
    return {
      message: () => formattedMaybeErrorResults,
      pass: allTestsPassed,
    }
  },
})

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
    formattedMaybeErrorResults,
  } = await getTsdResults(pathToTypeDefTest)

  // @ts-ignore
  expect(shortResults).__noTypeErrors({
    allTestsPassed,
    formattedMaybeErrorResults,
    shortResults,
  })

  return {
    receivedPath: pathToTypeDefTest,
    testFilePath,

    assertionsCount,
    tsdResults,
    shortResults,
  }
}
