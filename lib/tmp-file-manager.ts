import fs from 'node:fs/promises'
import path from 'node:path'
// @ts-ignore
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
  if (!pkgDir) throw new Error(`jest-tsd: Could not find package directory for ${filePath}`)

  const tmpFilePath = path.join(
    pkgDir,
    'node_modules',
    'jest-tsd',
    '.tmp-compile-type-def-test.test-d.ts',
  )

  fileText = await adjustImportPaths({
    fileText,
    filePath,
    newCwd: path.dirname(tmpFilePath),
    pkgDir,
  })

  await fs.mkdir(path.dirname(tmpFilePath), {recursive: true})
  await fs.writeFile(tmpFilePath, fileText)
  return tmpFilePath
}

const JS_IMPORT_REGEX = /import .+ from\s+['"](.+)['"]/

/**
 * Change all import paths (both relative and node_module) to be
 * relative to the tmp file's location.
 */
export async function adjustImportPaths(args: {
  fileText: string
  filePath: string
  newCwd: string
  pkgDir: string
}) {
  let {fileText, filePath, newCwd, pkgDir} = args

  const jsRelativeImports = fileText.match(new RegExp(JS_IMPORT_REGEX.source, 'g'))
  if (!jsRelativeImports) return fileText

  for (const jsRelativeImport of jsRelativeImports) {
    let originalImportPath = jsRelativeImport.match(JS_IMPORT_REGEX)?.[1]!
    let newRelativePath = originalImportPath
    const isNodeModule = !originalImportPath.startsWith('.')

    if (isNodeModule) {
      if (!pkgDir) throwError(filePath)
      const pathToNodeModule = path.join(pkgDir, 'node_modules', originalImportPath)
      const pkg = await fs.readFile(path.join(pathToNodeModule, 'package.json'), 'utf8')

      if (!pkg) throwError(filePath)

      let pkgMain = JSON.parse(pkg).main
      newRelativePath = path.join(pathToNodeModule, pkgMain)
    }

    newRelativePath = changeRelativePathBase({
      originalRelativePath: newRelativePath,
      originalCwd: path.dirname(filePath),
      newCwd,
    })

    fileText = fileText.replace(originalImportPath, newRelativePath)
  }

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

function throwError(filePath: string) {
  throw new Error(`jest-tsd: Failed to statically analyze type definition test at ${filePath}`)
}
