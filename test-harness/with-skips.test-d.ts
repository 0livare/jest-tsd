import {expectType, expectError, expectAssignable, expectNotAssignable} from 'tsd-lite'
import {Nullable} from './nullable'

test('Array.from() can be called with a variety of types', () => {
  Array.from('foo')
  Array.from(new Set())
  Array.from([1, 2, 3])
  Array.from({length: 3}, (_, i) => i)
})

test.skip('Adding two numbers should produce a number', () => {
  makeTypescriptAngry()
})

test('A plain object should not have a filter function', () => {
  expectError({}.filter((x: any) => x))
})

describe.skip('built in types', () => {
  test('Partial<T> should make all keys optional', () => {
    expectAssignable<Partial<{a: string; b: string}>>({})
  })
})

describe('Nullable', () => {
  makeTypescriptAngry()

  it('should allow null, undefined, and the specified type', () => {
    makeTypescriptAngry()
  })

  it('should not allow other types', () => {
    makeTypescriptAngry()
  })
})
