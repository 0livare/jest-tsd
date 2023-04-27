import {convertPathToTypeDefTest as convert} from './massage-test-path'

it('should convert a path', () => {
  const result = convert('foo.test.js')
  expect(result).toBe('foo.test-d.ts')
})

it("DOESN'T convert paths that are already .test-d.ts", () => {
  expect(convert('foo.test-d.ts')).toBe('foo.test-d.ts')
  expect(convert('foo.test-d.tsx')).toBe('foo.test-d.tsx')
})

describe('.test.*', () => {
  it('should convert .test.js paths', () => {
    expect(convert('foo.test.js')).toBe('foo.test-d.ts')
    expect(convert('foo.bar.test.js')).toBe('foo.bar.test-d.ts')
    expect(convert('testymctesterson.test.js')).toBe('testymctesterson.test-d.ts')
  })

  it('should convert .test.ts paths', () => {
    expect(convert('foo.test.ts')).toBe('foo.test-d.ts')
    expect(convert('foo.bar.test.ts')).toBe('foo.bar.test-d.ts')
    expect(convert('xtestjsx.test.ts')).toBe('xtestjsx.test-d.ts')
  })

  it('should convert .test.jsx paths', () => {
    expect(convert('foo.test.jsx')).toBe('foo.test-d.tsx')
    expect(convert('foo.bar.test.jsx')).toBe('foo.bar.test-d.tsx')
    expect(convert('xtesttsx.test.jsx')).toBe('xtesttsx.test-d.tsx')
  })

  it('should convert .test.tsx paths', () => {
    expect(convert('foo.test.tsx')).toBe('foo.test-d.tsx')
    expect(convert('foo.bar.test.tsx')).toBe('foo.bar.test-d.tsx')
    expect(convert('xtestjsx.test.tsx')).toBe('xtestjsx.test-d.tsx')
  })
})

describe('.spec.*', () => {
  it('should convert .spec.js paths', () => {
    expect(convert('foo.spec.js')).toBe('foo.test-d.ts')
    expect(convert('foo.bar.spec.js')).toBe('foo.bar.test-d.ts')
    expect(convert('xspecjsx.spec.js')).toBe('xspecjsx.test-d.ts')
  })

  it('should convert .spec.ts paths', () => {
    expect(convert('foo.spec.ts')).toBe('foo.test-d.ts')
    expect(convert('foo.bar.spec.ts')).toBe('foo.bar.test-d.ts')
    expect(convert('xspecjsx.spec.ts')).toBe('xspecjsx.test-d.ts')
  })

  it('should convert .spec.jsx paths', () => {
    expect(convert('foo.spec.jsx')).toBe('foo.test-d.tsx')
    expect(convert('foo.bar.spec.jsx')).toBe('foo.bar.test-d.tsx')
    expect(convert('xspecjsx.spec.jsx')).toBe('xspecjsx.test-d.tsx')
  })

  it('should convert .spec.tsx paths', () => {
    expect(convert('foo.spec.tsx')).toBe('foo.test-d.tsx')
    expect(convert('foo.bar.spec.tsx')).toBe('foo.bar.test-d.tsx')
    expect(convert('xspectsx.spec.tsx')).toBe('xspectsx.test-d.tsx')
  })
})
