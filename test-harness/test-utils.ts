import path from 'node:path'

// Note: None of these files actually exist, but the type
// definition versions of them does.
const getPathToTestHarness = (name: string) => path.resolve(__dirname, `./tests/${name}.test.js`)

export const testHarnessFilePaths = {
  complicated: getPathToTestHarness('complicated'),
  nullable: getPathToTestHarness('nullable'),
  testsInRoot: getPathToTestHarness('tests-in-root'),
  withSkips: getPathToTestHarness('with-skips'),
  hasFailingTest: getPathToTestHarness('has-failing-test'),
  descriptions: {
    itBlockWithNameError: getPathToTestHarness('it-block-with-name-error'),
    testBlockWithNameError: getPathToTestHarness('test-block-with-name-error'),
    describeItBlockWithError: getPathToTestHarness('describe-it-block-with-error'),
    describeTestBlockWithError: getPathToTestHarness('describe-test-block-with-error'),
  },
  doesNotExist: getPathToTestHarness('this-test-harness-does-not-exist'),
}
