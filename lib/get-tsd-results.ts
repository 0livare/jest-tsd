import fs from 'fs/promises'
import path from 'path'
import tsd, {type TsdResult} from 'tsd-lite'
import chalk from 'chalk'

import {convertPathToTypeDefTest} from './path-massager'
import {formatTsdResults} from './formatter'
import {
  commentOutSkippedBlocks,
  SKIP_TEST_REGEX,
  ONLY_TEST_REGEX,
  commentOutNonOnlyBlocks,
} from './test-def-manipulator'

type ShortTsdResult = {
  messageText: TsdResult['messageText']
  file: {
    pos: number | undefined
    end: number | undefined
    fileName: string | undefined
  }
}

export async function getTsdResults(pathToTypeDefTest: string) {
  const testFilePath = convertPathToTypeDefTest(pathToTypeDefTest)
  await ensureTestFileExists({testFilePath, pathToTypeDefTest})

  let filePathForTsdToCompile = testFilePath
  let fileText = await fs.readFile(testFilePath, {encoding: 'utf8'})
  let tmpFilePath = null

  const hasSkips = fileText.match(SKIP_TEST_REGEX)
  const hasOnlys = fileText.match(ONLY_TEST_REGEX)
  const fileNeedsToBeEdited = hasSkips || hasOnlys

  if (fileNeedsToBeEdited) {
    if (hasOnlys) {
      fileText = commentOutNonOnlyBlocks(fileText)
    } else if (hasSkips) {
      fileText = commentOutSkippedBlocks(fileText)
    }

    tmpFilePath = path.join(path.dirname(pathToTypeDefTest), '.tmp-compile-type-def-test.test-d.ts')
    await fs.writeFile(tmpFilePath, fileText)
    filePathForTsdToCompile = tmpFilePath
  }

  const {assertionsCount, tsdResults} = tsd(filePathForTsdToCompile)
  if (tmpFilePath) fs.rm(tmpFilePath)

  const shortResults: ShortTsdResult[] = tsdResults.map((r) => ({
    messageText: r.messageText,
    file: {
      pos: r.file?.pos,
      end: r.file?.end,
      fileName: r.file?.fileName,
    },
  }))

  return {
    allTestsPassed: shortResults.length === 0,
    assertionsCount,
    testFilePath,

    tsdResults,
    shortResults,
    formattedMaybeErrorResults: formatTsdResults(tsdResults),
  }
}

async function ensureTestFileExists(args: {testFilePath: string; pathToTypeDefTest: string}) {
  const {testFilePath, pathToTypeDefTest} = args

  try {
    await fs.access(testFilePath, fs.constants.F_OK)
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException
    const jestTestFileName = pathToTypeDefTest.split('/').pop()
    throw new Error(
      [
        `No type definition test file found.`,
        `File does not exist: ${err.path}`,
        chalk.bold.yellow(
          `Did you forget to create your \`.test-d.ts\` file for ${jestTestFileName}?`,
        ),
      ].join('\n'),
    )
  }
}
