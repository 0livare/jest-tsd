import {parseJsScopeBlocks, findClosingBraceIndex} from './utils'

describe('parseJsScopeBlocks', () => {
  it('returns an empty array when no functions are found', () => {
    const str = 'This is not a function'
    const functions = parseJsScopeBlocks(str)
    expect(functions).toEqual([])
  })

  it('returns a single function block', () => {
    const str = 'function add(a, b) { return a + b; }'
    const functions = parseJsScopeBlocks(str)
    expect(functions).toEqual(['{ return a + b; }'])
  })

  it('returns multiple function blocks', () => {
    const str = `
      function add(a, b) { 
        return a + b; 
      }
      
      function subtract(a, b) { 
        return a - b; 
      }
    `
    const functions = parseJsScopeBlocks(str)

    expect(functions).toEqual([
      '{ \n        return a + b; \n      }',
      '{ \n        return a - b; \n      }',
    ])
  })

  it('ignores function blocks inside single line comments', () => {
    const str = `
      function foo() {
        console.log('foo');
      }
      
      // function bar() { return 42; }
    `
    const functions = parseJsScopeBlocks(str)

    expect(functions).toHaveLength(1)
    expect(removeWhitespace(functions)).toEqual(removeWhitespace(["{console.log('foo');}"]))
  })

  it('ignores function blocks inside a simple string', () => {
    const str = `'function() { return "hi" }'`
    const functions = parseJsScopeBlocks(str)

    expect(functions).toHaveLength(0)
  })

  it('ignores function blocks inside strings', () => {
    const str = `
      function foo() {
        console.log('This is not a function: function() { return "hello"; }');
      }
    `
    const functions = parseJsScopeBlocks(str)

    expect(functions).toHaveLength(1)
    expect(removeWhitespace(functions)).toEqual(
      removeWhitespace([
        '{console.log(\'This is not a function: function() { return "hello"; }\');}',
      ]),
    )
  })

  it('ignores function blocks inside block comments', () => {
    const str = `/* function bar() { return 42; } */`

    const functions = parseJsScopeBlocks(str)

    expect(functions).toHaveLength(0)
  })

  it('ignores function blocks inside block comments', () => {
    const str = `
      function foo() {
        console.log('foo');
      }
      
      /* function bar() { return 42; } */
    `
    const functions = parseJsScopeBlocks(str)

    expect(functions).toHaveLength(1)
    expect(removeWhitespace(functions)).toEqual(removeWhitespace(["{console.log('foo');}"]))
  })

  it('works with functions nested 2 levels deep', () => {
    const str = `
      function foo() {
        function bar() {
          return 42;
        }
      }
    `
    const functions = parseJsScopeBlocks(str)

    expect(functions).toHaveLength(2)
    expect(removeWhitespace(functions)).toEqual(
      removeWhitespace(['{function bar() {return 42;}}', '{return 42;}']),
    )
  })

  it('works with functions nested 3 levels deep', () => {
    const str = `
      function foo() {
        function bar() {
          return () => { return 42 }
        }
      }
    `
    const functions = parseJsScopeBlocks(str)

    expect(functions).toHaveLength(3)
    expect(removeWhitespace(functions)).toEqual(
      removeWhitespace([
        '{function bar() {return () => { return 42 }}}',
        '{return () => { return 42 }}',
        '{ return 42 }',
      ]),
    )
  })
})

function removeWhitespace(str) {
  if (Array.isArray(str)) {
    return str.map(removeWhitespace)
  }
  return str.replace(/\s/g, '')
}

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
