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
