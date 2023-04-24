import {findClosingBraceIndex, commentOutLinesAtBetweenIndices, invertStringIndices} from './utils'

export const SKIP_TEST_REGEX = /(xit|it.skip|xtest|test.skip|xdescribe|describe.skip)\s*\(/

export function commentOutSkippedBlocks(fileText: string) {
  let index = 0

  while (index < fileText.length) {
    let sub = fileText.substring(index)
    let subIndex = sub.search(SKIP_TEST_REGEX)
    if (subIndex === -1) break

    let startBlockIndex = index + subIndex
    let endBlockIndex = findClosingBraceIndex(fileText, startBlockIndex)

    // console.info(highlight(fileText, endBlockIndex))
    fileText = commentOutLinesAtBetweenIndices(fileText, startBlockIndex, endBlockIndex)
    // console.info({index, sub, subIndex, startBlockIndex, endBlockIndex, fileText})

    index = endBlockIndex
  }

  return fileText
}

export const ONLY_TEST_REGEX = /(fit|it.only|ftest|test.only|fdescribe|describe.only)\s*\(/

export function commentOutNonOnlyBlocks(fileText: string) {
  const rangesOfOnlys = getIndicesOfAllOnlys(fileText).map(
    (startIndex) => [startIndex, findClosingBraceIndex(fileText, startIndex)] as const,
  )

  const invertedRanges = invertStringIndices(fileText, rangesOfOnlys).reverse()
  // console.info({rangesOfOnlys, invertedRanges})
  // console.info(highlight(fileText, ...invertedRanges.flat()))

  invertedRanges.forEach((range) => {
    fileText = commentOutLinesAtBetweenIndices(fileText, range[0], range[1])
  })

  return fileText
}

function getIndicesOfAllOnlys(fileText: string) {
  const allOnlyIndices = [] as number[]
  let sub = fileText
  let index = 0

  while (index < fileText.length) {
    sub = sub.substring(index)
    index = sub.search(ONLY_TEST_REGEX)
    if (index === -1) break

    allOnlyIndices.push(index)
    index += 1
  }

  return allOnlyIndices
}
