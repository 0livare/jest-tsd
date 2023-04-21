import {posix, relative, sep} from 'path'
import {codeFrameColumns} from '@babel/code-frame'
import chalk from 'chalk'
import ts, {type SourceFile} from '@tsd/typescript'
import {type TsdResult} from 'tsd-lite'

import {regexLastIndexOf, findClosingBraceIndex} from './utils'

const NOT_EMPTY_LINE_REGEXP = /^(?!$)/gm
const INDENT = '  '
const BULLET = '\u25cf '

export function formatTsdResults(tsdResults: TsdResult[]) {
  const messages = tsdResults.map((result) => {
    const message = ts.flattenDiagnosticMessageText(result.messageText, '\n')

    if (!result.file || !result.start) return [indentEachLine(message, 2)].join('\n\n')

    const codeFrameAndLocation = getCodeFrameAndLocation(result.file, result.start)
    const testDescribe = getTestDescribe(result.file, result.start)
    const testName = getTestName(result.file, result.start)

    let title = null
    if (testDescribe && testName) {
      title = makeTitle(testDescribe + ' > ' + testName)
    } else if (testDescribe || testName) {
      title = makeTitle(testDescribe! ?? testName!)
    }

    return [title, indentEachLine(message, 2), indentEachLine(codeFrameAndLocation, 2)]
      .filter(Boolean)
      .join('\n\n')
  })

  return [messages.join('\n\n'), ''].join('\n')
}

function indentEachLine(lines: string, level: number) {
  return lines.replace(NOT_EMPTY_LINE_REGEXP, INDENT.repeat(level))
}
function makeTitle(title: string) {
  return chalk.bold.red(indentEachLine(BULLET + title + '\n', 1))
}
function normalizeSlashes(input: string) {
  return input.split(sep).join(posix.sep)
}

function getCodeFrameAndLocation(file: SourceFile, start: number) {
  const {line, character} = file.getLineAndCharacterOfPosition(start)

  const codeFrame = codeFrameColumns(
    file.text,
    {start: {line: line + 1, column: character + 1}},
    {highlightCode: true, linesAbove: 2, linesBelow: 2},
  )

  const location =
    chalk.dim('at ') +
    chalk.cyan(normalizeSlashes(relative('', file.fileName))) +
    chalk.dim(':' + (line + 1) + ':' + (character + 1))

  return [codeFrame, indentEachLine(location, 1)].join('\n\n')
}

const TEST_DESCRIPTOR_REGEXP = /(it|test)\s*\(\s*['"](.+)['"]/i

function getTestName(file: SourceFile, indexOfError: number) {
  // Delete everything after the error
  let text = file.text.substring(0, indexOfError)
  // Find the last test descriptor remaining in the file
  let index = regexLastIndexOf(text, TEST_DESCRIPTOR_REGEXP)
  // Delete everything before the test descriptor
  text = text.substring(index)

  let testDescription = text.match(TEST_DESCRIPTOR_REGEXP)
  return testDescription ? testDescription[2] : null
}

const DESCRIBE_REGEXP = /describe\s*\(\s*['"](.+)['"]/i

function getTestDescribe(file: SourceFile, indexOfError: number) {
  // Delete everything after the error
  let text = file.text.substring(0, indexOfError)

  // Find the most recent describe
  // aka. Find the last describe remaining in the file
  let indexOfDescribe = regexLastIndexOf(text, DESCRIBE_REGEXP)

  const describeEndIndex = findClosingBraceIndex(file.text, indexOfDescribe)
  const isErrorWithinDescribe = indexOfError < describeEndIndex

  if (!isErrorWithinDescribe) return null

  // Delete everything before the describe
  text = text.substring(indexOfDescribe)

  let testDescription = text.match(DESCRIBE_REGEXP)
  return testDescription ? testDescription[1] : null
}
