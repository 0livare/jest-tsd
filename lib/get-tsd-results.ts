import fs from 'fs/promises'
import pathLib from 'path'
import tsd, {type TsdResult} from 'tsd-lite'
import chalk from 'chalk'
import {file} from 'tmp-promise'

import {convertPathToTypeDefTest} from './path-massager'
import {formatTsdResults} from './formatter'
import {commentOutSkippedBlocks} from './test-def-manipulator'

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

  // const {path} = await file({postfix: '.test-d.ts'})
  // let fileText = await fs.readFile(testFilePath, {encoding: 'utf8'})
  // fileText = commentOutSkippedBlocks(fileText)
  // await fs.writeFile(path, fileText)

  const {assertionsCount, tsdResults} = tsd(testFilePath)

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
