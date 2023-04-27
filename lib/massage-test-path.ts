/** Convert a file path to a Jest test to the path of a type definition test in the same directory */
export function convertPathToTypeDefTest(path: string) {
  let testPath = path.replace(/.(test|spec).[jt]sx?$/, `.test-d.ts`)
  if (path.endsWith('x') && !testPath.endsWith('x')) testPath += 'x'
  return testPath
}
