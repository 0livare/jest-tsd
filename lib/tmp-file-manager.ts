import path from 'path'
import fs from 'fs/promises'
import {packageDirectory} from 'pkg-dir'

export async function createTmpFile(args: {
  /** Path to `.test-d.ts` file */
  filePath: string
  /** Contents of`.test-d.ts` file */
  fileText: string
}) {
  const {filePath, fileText} = args

  const pkgDir = await packageDirectory({
    cwd: path.dirname(filePath),
  })
  if (!pkgDir) throw new Error(`Could not find package directory for ${filePath}`)

  const tmpFilePath = path.join(
    pkgDir,
    'node_modules',
    'jest-tsd',
    '.tmp-compile-type-def-test.test-d.ts',
  )
}

function adjustRelativeImportPaths(args: {fileText: string; filePath: string}) {
  let {fileText, filePath} = args

  const relativeImportPaths = fileText.match(/from\s+['"](\..*)['"]/g)
  if (!relativeImportPaths) return fileText

  relativeImportPaths.forEach((originalRelativePath) => {
    const newRelativePath = changeRelativePathBase({
      originalRelativePath,
      originalCwdOrFile: filePath,
      newCwd: path.dirname(filePath),
    })

    fileText = fileText.replace(originalRelativePath, newRelativePath)
  })

  return fileText
}

function changeRelativePathBase(args: {
  originalRelativePath: string
  originalCwdOrFile: string
  newCwd: string
}) {
  const {originalRelativePath, originalCwdOrFile, newCwd} = args

  const originalResolvedPath = path.resolve(path.dirname(originalCwdOrFile), originalRelativePath)
  const newRelativePath = path.relative(newCwd, originalResolvedPath)

  return newRelativePath
}
