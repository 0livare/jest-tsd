import {getTsdResults} from './get-tsd-results'
import {testHarnessFilePaths} from '../test-harness/test-utils'

it.only('works in node_modules', async () => {
  const result = await getTsdResults(
    '/Users/zposten/dev/jest-tsd/node_modules/_foo/complicated.test-d.ts',
  )
  expect(result.allTestsPassed).toBe(true)
})

it('successfully compiles a passing type definition test', async () => {
  const result = await getTsdResults(testHarnessFilePaths.complicated)
  expect(result.allTestsPassed).toBe(true)
})

it('throws a helpful error if the type definition test does not exist', async () => {
  await expect(getTsdResults(testHarnessFilePaths.doesNotExist)).rejects.toThrowError(
    'Did you forget to create your `.test-d.ts` file',
  )
})

it('skips over tests that are marked with .skip()', async () => {
  const result = await getTsdResults(testHarnessFilePaths.withSkips)
  expect(result.allTestsPassed).toBe(true)
})

it('detects when tests fail', async () => {
  const result = await getTsdResults(testHarnessFilePaths.hasFailingTest)
  expect(result.allTestsPassed).toBe(false)
  expect(result.shortResults[0].messageText).toBe("Cannot find name 'makeTypescriptAngry'.")
})

describe('test descriptions', () => {
  it('includes the test name in the error results for test() blocks', async () => {
    const result = await getTsdResults(testHarnessFilePaths.descriptions.testBlockWithNameError)
    expect(result.allTestsPassed).toBe(false)
    expect(result.formattedMaybeErrorResults).toContain('one two three')
  })

  it('includes the test name in the error results for it() blocks', async () => {
    const result = await getTsdResults(testHarnessFilePaths.descriptions.itBlockWithNameError)
    expect(result.allTestsPassed).toBe(false)
    expect(result.formattedMaybeErrorResults).toContain('one two three')
  })

  it('includes the describe and test name in the error results for describe() > test() blocks', async () => {
    const result = await getTsdResults(testHarnessFilePaths.descriptions.describeTestBlockWithError)
    expect(result.allTestsPassed).toBe(false)
    expect(result.formattedMaybeErrorResults).toContain('description > one two three')
  })

  it('includes the describe and test name in the error results for describe() > it() blocks', async () => {
    const result = await getTsdResults(testHarnessFilePaths.descriptions.describeItBlockWithError)
    expect(result.allTestsPassed).toBe(false)
    expect(result.formattedMaybeErrorResults).toContain('description > one two three')
  })
})
