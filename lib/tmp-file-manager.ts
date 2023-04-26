import fs from 'node:fs/promises'
import path from 'node:path'
import {packageDirectory} from 'pkg-dir'

export async function createTmpFile(args: {
  /** Path to `.test-d.ts` file */
  filePath: string
  /** Contents of`.test-d.ts` file */
  fileText: string
}) {
  let {filePath, fileText} = args

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

  fileText = adjustRelativeImportPaths({
    fileText,
    filePath,
    newCwd: path.dirname(tmpFilePath),
  })

  await fs.mkdir(path.dirname(tmpFilePath), {recursive: true})
  await fs.writeFile(tmpFilePath, fileText)
  return tmpFilePath
}

const JS_IMPORT_REGEX = /from\s+['"](\..*)['"]/

export function adjustRelativeImportPaths(args: {
  fileText: string
  filePath: string
  newCwd: string
}) {
  let {fileText, filePath, newCwd} = args

  const jsRelativeImports = fileText.match(new RegExp(JS_IMPORT_REGEX.source, 'g'))
  if (!jsRelativeImports) return fileText

  jsRelativeImports.forEach((jsRelativeImport) => {
    const originalRelativePath = jsRelativeImport.match(JS_IMPORT_REGEX)?.[1]!
    const newRelativePath = changeRelativePathBase({
      originalRelativePath,
      originalCwd: path.dirname(filePath),
      newCwd,
    })

    fileText = fileText.replace(originalRelativePath, newRelativePath)
  })

  return fileText
}

export function changeRelativePathBase(args: {
  originalRelativePath: string
  originalCwd: string
  newCwd: string
}) {
  const {originalRelativePath, originalCwd, newCwd} = args

  const originalResolvedPath = path.resolve(originalCwd, originalRelativePath)
  let newRelativePath = path.relative(newCwd, originalResolvedPath)
  if (!newRelativePath.startsWith('.')) newRelativePath = `./${newRelativePath}`

  return newRelativePath
}
