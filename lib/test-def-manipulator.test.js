import {commentOutSkippedBlocks} from './test-def-manipulator'

describe('commentOutSkippedBlocks', () => {
  it('should work for "it" blocks', () => {
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
    let result = commentOutSkippedBlocks(str)
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

  it('should work for "test" blocks', () => {
    const str = `
test.skip('foobar', () => {
  const foo = 42
  const bar = '42'
})

test.skip('foobar', () => {
  const foo = 42
  const bar = '42'
})

test('foobar', () => {
  const foo = 42
  const bar = '42'
})
    `
    let result = commentOutSkippedBlocks(str)
    expect(result).toMatchInlineSnapshot(`
      "
      //test.skip('foobar', () => {
      //  const foo = 42
      //  const bar = '42'
      //})

      //test.skip('foobar', () => {
      //  const foo = 42
      //  const bar = '42'
      //})

      test('foobar', () => {
        const foo = 42
        const bar = '42'
      })
          "
    `)
  })

  it('should work for "describe" blocks', () => {
    const str = `
describe('foobar', () => {
  const foo = 42
  const bar = '42'
})

describe.skip('foobar', () => {
  const foo = 42
  const bar = '42'
})

describe.skip('foobar', () => {
  const foo = 42
  const bar = '42'
})
    `
    let result = commentOutSkippedBlocks(str)
    expect(result).toMatchInlineSnapshot(`
      "
      describe('foobar', () => {
        const foo = 42
        const bar = '42'
      })

      //describe.skip('foobar', () => {
      //  const foo = 42
      //  const bar = '42'
      //})

      //describe.skip('foobar', () => {
      //  const foo = 42
      //  const bar = '42'
      //})
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

    let result = commentOutSkippedBlocks(str)
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
