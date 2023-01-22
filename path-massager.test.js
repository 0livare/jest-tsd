const { convertPathsToTypeDefTest: convert } = require('./path-massager');

it('should convert all passed paths', () => {
  const result = convert('foo.test.js', 'bar.test.js');
  expect(result).toHaveLength(2);
  expect(result[0]).toBe('foo.test-d.ts');
  expect(result[1]).toBe('bar.test-d.ts');
});

describe('.test.*', () => {
  it('should convert .test.js paths', () => {
    expect(convert('foo.test.js')[0]).toBe('foo.test-d.ts');
    expect(convert('foo.bar.test.js')[0]).toBe('foo.bar.test-d.ts');
    expect(convert('testymctesterson.test.js')[0]).toBe(
      'testymctesterson.test-d.ts'
    );
  });

  it('should convert .test.ts paths', () => {
    expect(convert('foo.test.ts')[0]).toBe('foo.test-d.ts');
    expect(convert('foo.bar.test.ts')[0]).toBe('foo.bar.test-d.ts');
    expect(convert('xtestjsx.test.ts')[0]).toBe('xtestjsx.test-d.ts');
  });

  it('should convert .test.jsx paths', () => {
    expect(convert('foo.test.jsx')[0]).toBe('foo.test-d.tsx');
    expect(convert('foo.bar.test.jsx')[0]).toBe('foo.bar.test-d.tsx');
    expect(convert('xtesttsx.test.jsx')[0]).toBe('xtesttsx.test-d.tsx');
  });

  it('should convert .test.tsx paths', () => {
    expect(convert('foo.test.tsx')[0]).toBe('foo.test-d.tsx');
    expect(convert('foo.bar.test.tsx')[0]).toBe('foo.bar.test-d.tsx');
    expect(convert('xtestjsx.test.tsx')[0]).toBe('xtestjsx.test-d.tsx');
  });
});

describe('.spec.*', () => {
  it('should convert .spec.js paths', () => {
    expect(convert('foo.spec.js')[0]).toBe('foo.test-d.ts');
    expect(convert('foo.bar.spec.js')[0]).toBe('foo.bar.test-d.ts');
    expect(convert('xspecjsx.spec.js')[0]).toBe('xspecjsx.test-d.ts');
  });

  it('should convert .spec.ts paths', () => {
    expect(convert('foo.spec.ts')[0]).toBe('foo.test-d.ts');
    expect(convert('foo.bar.spec.ts')[0]).toBe('foo.bar.test-d.ts');
    expect(convert('xspecjsx.spec.ts')[0]).toBe('xspecjsx.test-d.ts');
  });

  it('should convert .spec.jsx paths', () => {
    expect(convert('foo.spec.jsx')[0]).toBe('foo.test-d.tsx');
    expect(convert('foo.bar.spec.jsx')[0]).toBe('foo.bar.test-d.tsx');
    expect(convert('xspecjsx.spec.jsx')[0]).toBe('xspecjsx.test-d.tsx');
  });

  it('should convert .spec.tsx paths', () => {
    expect(convert('foo.spec.tsx')[0]).toBe('foo.test-d.tsx');
    expect(convert('foo.bar.spec.tsx')[0]).toBe('foo.bar.test-d.tsx');
    expect(convert('xspectsx.spec.tsx')[0]).toBe('xspectsx.test-d.tsx');
  });
});
