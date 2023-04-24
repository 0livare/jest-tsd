import {commentOutSkippedBlocks, commentOutNonOnlyBlocks} from './test-def-manipulator'

describe('commentOutSkippedBlocks', () => {
  it('should work for "it" blocks', () => {
    const str = `
it('foobar', () => {
  const foo = 42
})

it.skip('foobar', () => {
  const foo = 42
})

it('foobar', () => {
  const foo = 42
})
    `
    let result = commentOutSkippedBlocks(str)
    expect(result).toMatchInlineSnapshot(`
      "
      it('foobar', () => {
        const foo = 42
      })

      //it.skip('foobar', () => {
      //  const foo = 42
      //})

      it('foobar', () => {
        const foo = 42
      })
          "
    `)
  })

  it('should work for "test" blocks', () => {
    const str = `
test.skip('foobar', () => {
  const foo = 42
})

test.skip('foobar', () => {
  const foo = 42
})

test('foobar', () => {
  const foo = 42
})
    `
    let result = commentOutSkippedBlocks(str)
    expect(result).toMatchInlineSnapshot(`
      "
      //test.skip('foobar', () => {
      //  const foo = 42
      //})

      //test.skip('foobar', () => {
      //  const foo = 42
      //})

      test('foobar', () => {
        const foo = 42
      })
          "
    `)
  })

  it('should work for "describe" blocks', () => {
    const str = `
describe('foobar', () => {
  const foo = 42
})

describe.skip('foobar', () => {
  const foo = 42
})

describe.skip('foobar', () => {
  const foo = 42
})
    `
    let result = commentOutSkippedBlocks(str)
    expect(result).toMatchInlineSnapshot(`
      "
      describe('foobar', () => {
        const foo = 42
      })

      //describe.skip('foobar', () => {
      //  const foo = 42
      //})

      //describe.skip('foobar', () => {
      //  const foo = 42
      //})
          "
    `)
  })

  it('should work for combinations of different blocks', () => {
    const str = `
describe.skip('foobar', () => {
  test('foobar', () => {
    const foo = 42
  })
})
    `

    let result = commentOutSkippedBlocks(str)
    expect(result).toMatchInlineSnapshot(`
      "
      //describe.skip('foobar', () => {
      //  test('foobar', () => {
      //    const foo = 42
      //  })
      //})
          "
    `)
  })
})

describe('commentOutNonOnlyBlocks', () => {
  it('should not comment out an only block', () => {
    const str = `
it.only('foobar', () => {
  const foo = 42
})`
    let result = commentOutNonOnlyBlocks(str)
    expect(result).toBe(str)
  })

  it('should work for "it" blocks', () => {
    const str = `
it('foobar', () => {
  const foo = 42
})

it.only('foobar', () => {
  const foo = 42
})

it('foobar', () => {
  const foo = 42
})
    `
    let result = commentOutNonOnlyBlocks(str)
    expect(result).toMatchInlineSnapshot(`
      "
      //it('foobar', () => {
      //  const foo = 42
      //})

      it.only('foobar', () => {
        const foo = 42
      })

      //it('foobar', () => {
      //  const foo = 42
      //})
      //    "
    `)
  })

  it('should work for "test" blocks', () => {
    const str = `
test.only('foobar', () => {
  const foo = 42
})

test.only('foobar', () => {
  const foo = 42
})

test('foobar', () => {
  const foo = 42
})
    `
    let result = commentOutNonOnlyBlocks(str)
    expect(result).toMatchInlineSnapshot(`
      "
      test.only('foobar', () => {
        const foo = 42
      })

      test.only('foobar', () => {
        const foo = 42
      })

      //test('foobar', () => {
      //  const foo = 42
      //})
      //    "
    `)
  })

  it('should work for "describe" blocks', () => {
    const str = `
describe.only('foobar', () => {
  const foo = 42
})

describe('foobar', () => {
  const foo = 42
})

describe('foobar', () => {
  const foo = 42
})
    `
    let result = commentOutNonOnlyBlocks(str)
    expect(result).toMatchInlineSnapshot(`
      "
      describe.only('foobar', () => {
        const foo = 42
      })

      //describe('foobar', () => {
      //  const foo = 42
      //})
      //
      //describe('foobar', () => {
      //  const foo = 42
      //})
      //    "
    `)
  })

  it('should work for combinations of different blocks', () => {
    const str = `
describe.only('foobar', () => {
  test('foobar', () => {
    const foo = 42
  })
})

test('foobar', () => {
  const foo = 42
})
    `

    let result = commentOutNonOnlyBlocks(str)
    expect(result).toMatchInlineSnapshot(`
      "
      describe.only('foobar', () => {
        test('foobar', () => {
          const foo = 42
        })
      })

      //test('foobar', () => {
      //  const foo = 42
      //})
      //    "
    `)
  })
})
