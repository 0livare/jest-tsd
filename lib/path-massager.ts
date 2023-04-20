export function convertPathToTypeDefTest(path: string) {
  let testPath = path.replace(/.(test|spec).[jt]sx?$/, `.test-d.ts`)
  if (path.endsWith('x') && !testPath.endsWith('x')) testPath += 'x'
  return testPath
}
