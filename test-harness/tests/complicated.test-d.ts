import {expectType, expectError, expectAssignable, expectNotAssignable} from 'tsd-lite'
import {Nullable} from '../nullable'

test('Array.from() can be called with a variety of types', () => {
  Array.from('foo')
  Array.from(new Set())
  Array.from([1, 2, 3])
  Array.from({length: 3}, (_, i) => i)
})

test.skip('Adding two numbers should produce a number', () => {
  expectType<number>(1 + 1)
  expectType<number>(2 + 2)
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
  it('should allow null, undefined, and the specified type', () => {
    expectAssignable<Nullable<string>>(null)
    expectAssignable<Nullable<string>>(undefined)
    expectAssignable<Nullable<string>>('abc')
    expectAssignable<Nullable<string>>('')
    expectAssignable<Nullable<number>>(0)
    expectAssignable<Nullable<number>>(null)
    expectAssignable<Nullable<number>>(undefined)
    expectAssignable<Nullable<'abc'>>('abc')
    expectAssignable<Nullable<'abc'>>(null)
    expectAssignable<Nullable<'abc'>>(undefined)
  })

  it('should not allow other types', () => {
    expectNotAssignable<Nullable<string>>(0)
    expectNotAssignable<Nullable<string>>(1)
    expectNotAssignable<Nullable<string>>(false)
    expectNotAssignable<Nullable<'abc'>>('123')
  })
})
