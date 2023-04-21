import {parseJsScopeBlocks} from './utils'

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

  it.failing('works with nested functions', () => {
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
})

function removeWhitespace(str) {
  if (Array.isArray(str)) {
    return str.map(removeWhitespace)
  }
  return str.replace(/\s/g, '')
}