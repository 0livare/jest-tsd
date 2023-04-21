import {parseJsScopeBlocks, findClosingBraceIndex} from './utils'

describe('findClosingBraceIndex', () => {
  it('works for two braces', () => {
    const str = '{}'
    const index = findClosingBraceIndex(str, 0)
    expect(str.substring(index, index + 1)).toBe('}')
    expect(index).toBe(1)
  })

  it('works for a function', () => {
    const str = 'function foo() { return 42; }'
    const index = findClosingBraceIndex(str, 0)
    expect(str.substring(index, index + 1)).toBe('}')
    expect(index).toBe(28)
  })

  it('works for a function with new lines', () => {
    const str = `
function foo() {
  return 42;
}
    `
    const index = findClosingBraceIndex(str, 0)
    expect(str.substring(index, index + 1)).toBe('}')
    expect(index).toBe(31)
  })

  it('ignores braces in comments', () => {
    const str = `
function foo() {
  // this is } comment
  /* this is } comment */
  return 42;
}
    `
    const index = findClosingBraceIndex(str, 0)
    expect(str.substring(index, index + 1)).toBe('}')
    expect(index).toBe(80)
  })

  it('ignores nested functions', () => {
    const str = `
function foo() {
  function bar() {}
  const baz = () => { return "42" }
}
    `
    const index = findClosingBraceIndex(str, 0)
    expect(str.substring(index, index + 1)).toBe('}')
    expect(index).toBe(74)
  })

  it('ignores parent functions', () => {
    const str = `
function foo() {
  function bar() {}
  const baz = () => { return "42" }
}`

    let index = findClosingBraceIndex(str, 19)
    expect(str.substring(index, index + 1)).toBe('}')
    expect(index).toBe(36)

    index = findClosingBraceIndex(str, 35)
    expect(str.substring(index, index + 1)).toBe('}')
    expect(index).toBe(36)
  })

  it('works for a describe()', () => {
    const str = `
describe('foo', () => {
  it('bar', () => {
    expect(42).toBe(42)
  })
})
    `
    const index = findClosingBraceIndex(str, 0)
    expect(str.substring(index, index + 1)).toBe('}')
    expect(index).toBe(74)
  })
})
