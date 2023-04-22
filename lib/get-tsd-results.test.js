import {getTsdResults} from './get-tsd-results'
import path from 'path'

// Note: None of these files actually exist, but the type
// definition versions of them does.
const getPathToTestHarness = (name) => path.resolve(__dirname, `../test-harness/${name}.test.js`)
const testHarnessFilePaths = {
  complicated: getPathToTestHarness('complicated'),
  nullable: getPathToTestHarness('nullable'),
  testsInRoot: getPathToTestHarness('tests-in-root'),
  withSkips: getPathToTestHarness('with-skips'),
  hasFailingTests: getPathToTestHarness('has-failing-tests'),
  doesNotExist: getPathToTestHarness('this-test-harness-does-not-exist'),
}

it('successfully compiles a good type definition test', async () => {
  await getTsdResults(testHarnessFilePaths.complicated)
})

it('throws a helpful error if the type definition test does not exist', async () => {
  await expect(getTsdResults(testHarnessFilePaths.doesNotExist)).rejects.toThrowError(
    'Did you forget to create your `.test-d.ts` file',
  )
})

it.failing('skips over tests that are marked with .skip()', async () => {
  const result = await getTsdResults(testHarnessFilePaths.withSkips)
  expect(result.allTestsPassed).toBe(true)
})

it('detects when tests fail', async () => {
  const result = await getTsdResults(testHarnessFilePaths.hasFailingTests)
  expect(result.allTestsPassed).toBe(false)
  expect(result.shortResults[0].messageText).toBe("Cannot find name 'makeTypescriptAngry'.")
})
