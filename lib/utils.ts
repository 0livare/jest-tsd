/**
 * Like `String.prototype.lastIndexOf` but with a regex
 * See: https://stackoverflow.com/a/274094/2517147
 */
export function regexLastIndexOf(
  string: string,
  regex: RegExp,
  startPos: number | undefined = undefined,
) {
  // Force the regex to have the global flag
  regex = regex.global
    ? regex
    : new RegExp(regex.source, 'g' + (regex.ignoreCase ? 'i' : '') + (regex.multiline ? 'm' : ''))

  // startPos default to the end of the string
  if (typeof startPos == 'undefined') {
    startPos = string.length
  } else if (startPos < 0) {
    startPos = 0
  }

  let stringToWorkWith = string.substring(0, startPos + 1)
  let lastIndexOf = -1
  let nextStop = 0
  let result: RegExpExecArray | null | undefined = undefined

  while ((result = regex.exec(stringToWorkWith)) != null) {
    lastIndexOf = result.index
    regex.lastIndex = ++nextStop
  }

  return lastIndexOf
}

/**
 * Look for the first closing brace in the string starting at `openBraceIndex`,
 * and return the index of the closing brace that matches with that open brace.
 */
export function findClosingBraceIndex(str: string, openBraceIndex: number) {
  let openBraces = 0
  let inLineComment = false
  let inBlockComment = false
  let inString = false

  for (let i = openBraceIndex; i < str.length; i++) {
    if ((str[i] === '"' || str[i] === "'") && !inLineComment && !inBlockComment) {
      inString = !inString
    } else if (str[i] === '/' && str[i + 1] === '/' && !inString && !inBlockComment) {
      inLineComment = true
      i++
    } else if (str[i] === '\n' && inLineComment) {
      inLineComment = false
    } else if (str[i] === '/' && str[i + 1] === '*' && !inString && !inLineComment) {
      inBlockComment = true
      i++
    } else if (str[i] === '*' && str[i + 1] === '/' && inBlockComment) {
      inBlockComment = false
      i++
    } else if (str[i] === '{' && !inLineComment && !inBlockComment && !inString) {
      openBraces++
    } else if (str[i] === '}' && !inLineComment && !inBlockComment && !inString) {
      openBraces--
      if (openBraces === 0) return i
    }
  }

  return -1
}

/**
 * Take a string that represents a JavaScript-like file, and prepend `//` to each line
 * between `start` and `end` (inclusive) indices of the string.
 *
 * If `end` is not provided, then comment out all lines from `start` to the end of the file.
 *
 * **Note**: `start` and `end` represent string indices, not line numbers.
 */
export function commentOutLinesAtBetweenIndices(
  fileText: string,
  start: number,
  end: number = Number.NaN,
) {
  if (Number.isNaN(end)) {
    end = fileText.length
  } else {
    let endOfEndLine = findNextNewLine(fileText, {start: end})
    if (endOfEndLine < 0) end = fileText.length
    else end = endOfEndLine - 1
  }

  // console.info('to be done: ', {fileText: highlight(fileText, start, end), start, end, originalEnd})
  while (start <= end) {
    let prevNewLine = findNextNewLine(fileText, {start: end, dir: 'backward'})
    // console.info({prevNewLine, fileText: highlight(fileText, prevNewLine + 1), start, end})
    if (prevNewLine < 0) {
      if (start === 0) {
        prevNewLine = -1 // Minus one here because the splice adds 1 to get to 0
      } else break
    }

    fileText = splice(fileText, prevNewLine + 1, 0, '//')
    end = prevNewLine - 1
  }
  return fileText
}

/**
 * Starting from `start` string index, and working either forward or backward
 * (depending on the `dir` argument), return the index of the next newline
 * character in the string.
 */
export function findNextNewLine(
  fileText: string,
  args: {start: number; dir?: 'forward' | 'backward'},
) {
  const {start, dir = 'forward'} = args
  if (fileText[start] === '\n') return start

  let index = start
  // console.info('findNextNewLine', {fileText: print(fileText), start, end: fileText.length, index})

  while (index >= 0 && index <= fileText.length && fileText[index] !== '\n') {
    // console.info('inner: ', print(fileText[index]), index)
    const increment = dir === 'forward' ? 1 : -1
    index += increment
  }

  if (index < 0 || index > fileText.length) {
    return -1
  }
  return index
}

function splice(str: string, start: number, delCount = 0, newSubStr = '') {
  return str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount))
}

// For debugging
function highlight(str: string, ...indices: number[]) {
  for (let i = indices.length - 1; i >= 0; i--) {
    const index = indices[i]!
    str = splice(str, index + 1, 0, '<<<')
    str = splice(str, index, 0, '>>>')
  }
  return str
}

// For debugging
function print(str: string | null | undefined) {
  return `"${String(str).replace(/\n/g, '\\n').replace(/"/g, '\\"')}"`
}

export function invertStringIndices(str: string, ranges: Array<readonly [number, number]>) {
  let invertedRanges: Array<[number, number]> = []
  if (!ranges.length) return invertedRanges

  const beforeFirst = findNextNewLine(str, {start: ranges[0]![0], dir: 'backward'}) - 1
  invertedRanges.push([0, beforeFirst])

  for (let i = 0; i < ranges.length; i++) {
    const [start, end] = ranges[i]!
    const [nextStart, nextEnd] = ranges[i + 1] ?? []

    const afterEnd = findNextNewLine(str, {start: end, dir: 'forward'}) + 1
    const beforeNextStart = nextStart
      ? findNextNewLine(str, {start: nextStart, dir: 'backward'}) - 1
      : str.length

    invertedRanges.push([afterEnd, beforeNextStart])
  }
}
