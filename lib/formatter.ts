// Mostly copied from jest-runner-tsd
// https://github.com/jest-community/jest-runner-tsd/blob/main/src/formatter.js

import {posix, relative, sep} from 'path'
import {codeFrameColumns} from '@babel/code-frame'
import chalk from 'chalk'

import ts, {type SourceFile} from '@tsd/typescript'
import {type TsdResult} from 'tsd-lite'

const NOT_EMPTY_LINE_REGEXP = /^(?!$)/gm
const INDENT = '  '
const BULLET = '\u25cf '

function indentEachLine(lines: string, level: number) {
  return lines.replace(NOT_EMPTY_LINE_REGEXP, INDENT.repeat(level))
}
function makeTitle(title: string) {
  return indentEachLine(BULLET + title + '\n', 1)
}
function normalizeSlashes(input: string) {
  return input.split(sep).join(posix.sep)
}

function getCodeFrameAndLocation(file: SourceFile, start: number | undefined) {
  if (start === undefined) return

  const {line, character} = file.getLineAndCharacterOfPosition(start)

  const codeFrame = codeFrameColumns(
    file.text,
    {start: {line: line + 1, column: character + 1}},
    {highlightCode: true, linesAbove: 0, linesBelow: 0},
  )

  const location =
    chalk.dim('at ') +
    chalk.cyan(normalizeSlashes(relative('', file.fileName))) +
    chalk.dim(':' + (line + 1) + ':' + (character + 1))

  return [codeFrame, indentEachLine(location, 1)].join('\n\n')
}

export function formatTsdResults(tsdResults: TsdResult[]) {
  const title = chalk.bold.red(makeTitle('tsd typecheck'))

  const messages = tsdResults.map((result) => {
    const message = ts.flattenDiagnosticMessageText(result.messageText, '\n')

    const codeFrameAndLocation = result.file
      ? getCodeFrameAndLocation(result.file, result.start)
      : undefined

    return codeFrameAndLocation === undefined
      ? [indentEachLine(message, 2)].join('\n\n')
      : [indentEachLine(message, 2), indentEachLine(codeFrameAndLocation, 2)].join('\n\n')
  })

  return [title, messages.join('\n\n'), ''].join('\n')
}
