import {expectError, expectAssignable} from 'tsd-lite'

test.skip('one', () => {
  makeTypescriptAngry()
})

it.skip('two', () => {
  makeTypescriptAngry()
})

test('Array.from() can be called with a variety of types', () => {
  Array.from('foo')
  Array.from(new Set())
  Array.from([1, 2, 3])
  Array.from({length: 3}, (_, i) => i)
})

xit('three', () => {
  makeTypescriptAngry()
})

xtest('four', () => {
  makeTypescriptAngry()
})

test('A plain object should not have a filter function', () => {
  expectError({}.filter((x: any) => x))
})

describe.skip('description', () => {
  makeTypescriptAngry()

  it('five', () => {
    makeTypescriptAngry()
  })

  it('six', () => {
    makeTypescriptAngry()
  })
})

describe('built in types', () => {
  test('Partial<T> should make all keys optional', () => {
    expectAssignable<Partial<{a: string; b: string}>>({})
  })
})

xdescribe('description', () => {
  makeTypescriptAngry()

  it('seven', () => {
    makeTypescriptAngry()
  })

  it('eight', () => {
    makeTypescriptAngry()
  })
})
