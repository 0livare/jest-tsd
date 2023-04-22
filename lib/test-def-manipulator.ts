import {findClosingBraceIndex, commentOutLinesAtBetweenIndices} from './utils'

export function commentOutSkippedBlocks(fileText: string) {
  let index = 0
  let itrs = 0

  while (index < fileText.length && ++itrs < 20) {
    let sub = fileText.substring(index)
    let subIndex = sub.search(/(describe|test|it)\.skip/)
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
