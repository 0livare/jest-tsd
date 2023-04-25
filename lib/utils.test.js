import {
  findClosingBraceIndex,
  commentOutLinesAtBetweenIndices,
  findNextNewLine,
  invertStringIndices,
} from './utils'

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

describe('commentOutLinesAtBetweenIndices', () => {
  it('should work for a single line', () => {
    const str = 'const foo = 42'
    const result = commentOutLinesAtBetweenIndices(str, 0)
    expect(result).toBe('//const foo = 42')
  })

  it('should work for two lines', () => {
    const str = `
const foo = 42
const bar = '42'
`
    const result = commentOutLinesAtBetweenIndices(str, 0)
    expect(result).toContain('//const foo = 42')
    expect(result).toContain("//const bar = '42'")
  })

  it('should work for three lines', () => {
    const str = `
const foo = 42
const bar = '42'
just text
`
    const result = commentOutLinesAtBetweenIndices(str, 0)
    expect(result).toContain('//const foo = 42')
    expect(result).toContain("//const bar = '42'")
    expect(result).toContain('//just text')
  })

  it('should be able to comment out just one line', () => {
    const str = `
const foo = 42
const bar = '42'
just text
`
    let result = commentOutLinesAtBetweenIndices(str, 1, 1)
    expect(result).toMatchInlineSnapshot(`
      "
      //const foo = 42
      const bar = '42'
      just text
      "
    `)

    let line2 = str.indexOf('bar')
    result = commentOutLinesAtBetweenIndices(str, line2, line2)
    expect(result).toMatchInlineSnapshot(`
      "
      const foo = 42
      //const bar = '42'
      just text
      "
    `)
  })

  it('should be able to comment out multiple lines', () => {
    const str = `
it('foobar', () => {
  const foo = 42
  const bar = '42'
})

it.skip('foobar', () => {
  const foo = 42
  const bar = '42'
})

it('foobar', () => {
  const foo = 42
  const bar = '42'
})
`
    let start = str.indexOf('it.skip')
    let end = str.indexOf('})', start)

    let result = commentOutLinesAtBetweenIndices(str, start, end)
    expect(result).toMatchInlineSnapshot(`
      "
      it('foobar', () => {
        const foo = 42
        const bar = '42'
      })

      //it.skip('foobar', () => {
      //  const foo = 42
      //  const bar = '42'
      //})

      it('foobar', () => {
        const foo = 42
        const bar = '42'
      })
      "
    `)
  })

  it('should work for combinations of different blocks', () => {
    const str = `
describe.skip('foobar', () => {
  test('foobar', () => {
    const foo = 42
    const bar = '42'
  })
})
    `

    let result = commentOutLinesAtBetweenIndices(str, 0, 103)
    expect(result).toMatchInlineSnapshot(`
      "
      //describe.skip('foobar', () => {
      //  test('foobar', () => {
      //    const foo = 42
      //    const bar = '42'
      //  })
      //})
          "
    `)
  })
})

describe('findNextNewLine', () => {
  it('should detect new line at the beginning', () => {
    const str = `\nabc\n`
    const index = findNextNewLine(str, {start: 0})
    expect(index).toBe(0)
  })

  it('should detect new line at the end', () => {
    const str = `\nabc\n`
    const index = findNextNewLine(str, {start: 0})
    expect(index).toBe(0)
  })

  it('should detect new line after beginning', () => {
    const str = `abc\n123`
    const index = findNextNewLine(str, {start: 0})
    expect(index).toBe(3)
  })

  it('should find closest newline', () => {
    let str = `\nabc\n123\n`
    let index = findNextNewLine(str, {start: 0})
    expect(index).toBe(0)

    index = findNextNewLine(str, {start: index + 1})
    expect(index).toBe(4)

    index = findNextNewLine(str, {start: index + 1})
    expect(index).toBe(8)
  })

  it('should support going backward', () => {
    let str = `\nabc\n123\nfoo\n`

    let index = findNextNewLine(str, {start: str.length, dir: 'backward'})
    expect(index).toBe(12)

    index = findNextNewLine(str, {start: index - 1, dir: 'backward'})
    expect(index).toBe(8)

    index = findNextNewLine(str, {start: index - 1, dir: 'backward'})
    expect(index).toBe(4)

    index = findNextNewLine(str, {start: index - 1, dir: 'backward'})
    expect(index).toBe(0)
  })

  it('should return -1 if no new line exists', () => {
    const str = `abc`
    const index = findNextNewLine(str, {start: 0})
    expect(index).toBe(-1)
  })

  it('should return -1 if no new line exists after start when going forward', () => {
    const str = `abc\n123`
    const index = findNextNewLine(str, {start: 5})
    expect(index).toBe(-1)
  })

  it('should return -1 if no new line exists before start when going backward', () => {
    const str = `abc\n123`
    const index = findNextNewLine(str, {start: 2, dir: 'backward'})
    expect(index).toBe(-1)
  })
})

describe('invertStringIndices', () => {
  it('should be able to skip the first line', () => {
    const str = `
const foo = 42
const bar = '42'
const baz = 40 + 2
`
    const result = invertStringIndices(str, [[0, 5]])
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual([16, 52])
  })

  it('should be able to skip the last line', () => {
    const str = `
const foo = 42
const bar = '42'
const baz = 40 + 2
`
    const result = invertStringIndices(str, [[35, 37]])
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual([0, 31])
  })

  it('should be able to skip the first and last lines', () => {
    const str = `
const foo = 42
const bar = '42'
const baz = 40 + 2
`
    const result = invertStringIndices(str, [
      [0, 5],
      [35, 37],
    ])
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual([16, 31])
  })

  it('should be able to skip multiple ranges', () => {
    const str = `
const foo = 42
const bar = '42'
const baz = 40 + 2
`
    const result = invertStringIndices(str, [[17, 19]])
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual([0, 14])
    expect(result[1]).toEqual([33, 52])
  })
})
