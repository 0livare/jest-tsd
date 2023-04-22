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

export function commentOutLinesAtBetweenIndices(
  fileText: string,
  start: number,
  end: number = Number.NaN,
) {
  if (Number.isNaN(end)) end = fileText.length

  let text = commentOutLineAtIndex(fileText, start)
  let newLineIndex = start

  while (newLineIndex < end) {
    newLineIndex = findNextNewLine(text, {start: newLineIndex + 1})
    if (newLineIndex === -1) break
    text = splice(text, newLineIndex + 1, 0, '//')
  }
  return text
}

export function findNextNewLine(
  fileText: string,
  args: {start: number; dir?: 'forward' | 'backward'},
) {
  const {start, dir = 'forward'} = args
  if (fileText[start] === '\n') return start

  let index = start

  // console.log('findNextNewLine', {
  //   fileText: print(fileText),
  //   start,
  //   end: fileText.length,
  //   index,
  //   dir,
  // })

  while (index >= 0 && index <= fileText.length && fileText[index] !== '\n') {
    // console.log('inner: ', print(fileText[index]), index)
    const increment = dir === 'forward' ? 1 : -1
    index += increment
  }

  if (index < 0 || index > fileText.length) {
    return -1
  }
  return index
}

function commentOutLineAtIndex(fileText: string, index: number) {
  let startOfLineIndex = findNextNewLine(fileText, {start: index, dir: 'backward'})
  return splice(fileText, startOfLineIndex + 1, 0, '//')
}

function splice(str: string, start: number, delCount = 0, newSubStr = '') {
  return str.slice(0, start) + newSubStr + str.slice(start + Math.abs(delCount))
}

function print(str: string | null | undefined) {
  return `"${String(str).replace(/\n/g, '\\n').replace(/"/g, '\\"')}"`
}
