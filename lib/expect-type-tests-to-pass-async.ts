import fs from 'fs/promises'
import tsd, {type TsdResult} from 'tsd-lite'

import {convertPathToTypeDefTest} from './path-massager'
import {formatTsdResults} from './formatter'

type ShortTsdResult = {
  messageText: TsdResult['messageText']
  file: {
    pos: number | undefined
    end: number | undefined
    fileName: string | undefined
  }
}

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
  const testFile = convertPathToTypeDefTest(pathToTypeDefTest)

  try {
    await fs.access(testFile, fs.constants.F_OK)
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException
    throw new Error(`The type definition test at "${err.path}" does not exist"`)
  }

  const {assertionsCount, tsdResults} = tsd(testFile)

  const shortResults: ShortTsdResult[] = tsdResults.map((r) => ({
    messageText: r.messageText,
    file: {
      pos: r.file?.pos,
      end: r.file?.end,
      fileName: r.file?.fileName,
    },
  }))

  // Don't pass to jest or log the full results because they make
  // the jest output unreadable. But the full results are still
  // available via the return value though if the user need them
  // for diagnostic purposes.
  if (shortResults.length) console.error(formatTsdResults(tsdResults))
  expect(shortResults).toHaveLength(0)

  return {
    assertionsCount,
    tsdResults,
    shortResults,
    receivedPath: pathToTypeDefTest,
    testFile,
  }
}
