import {posix, relative, sep} from 'path'
import {codeFrameColumns} from '@babel/code-frame'
import chalk from 'chalk'

import ts, {type SourceFile} from '@tsd/typescript'
import {type TsdResult} from 'tsd-lite'

const NOT_EMPTY_LINE_REGEXP = /^(?!$)/gm
const INDENT = '  '
const BULLET = '\u25cf '

export function formatTsdResults(tsdResults: TsdResult[]) {
  const messages = tsdResults.map((result) => {
    const message = ts.flattenDiagnosticMessageText(result.messageText, '\n')

    if (!result.file || !result.start) return [indentEachLine(message, 2)].join('\n\n')

    const codeFrameAndLocation = getCodeFrameAndLocation(result.file, result.start)
    const testDescription = getTestDescription(result.file, result.start)
    const title = testDescription ? chalk.bold.red(makeTitle(testDescription)) : ''

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
  return indentEachLine(BULLET + title + '\n', 1)
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

function getTestDescription(file: SourceFile, start: number) {
  // Delete everything after the error
  let text = file.text.substring(0, start)
  // Find the last test descriptor remaining in the file
  let index = Math.max(text.lastIndexOf('it:'), text.lastIndexOf('test:'))
  // Delete everything before the test descriptor
  text = text.substring(index)

  let testDescription = text.match(/(it|test):\s+(.+)/i)
  return testDescription ? testDescription[2] : null
}
