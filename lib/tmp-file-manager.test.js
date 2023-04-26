import {changeRelativePathBase, adjustRelativeImportPaths} from './tmp-file-manager'

describe('changeRelativePathBase', () => {
  it('changes the base of a relative path', async () => {
    // 'foo/bar/baz.ts', 'foo', 'baz'
    const result = await changeRelativePathBase({
      originalRelativePath: '../foo/bar.ts',
      originalCwd: '/root/one/two/three',
      newCwd: '/root/four',
    })

    // Relative path to `/root/one/two/foo/bar.ts` from `/root/four`
    expect(result).toBe('../one/two/foo/bar.ts')
  })

  it('changes the base of a relative path into a current dir path', async () => {
    // 'foo/bar/baz.ts', 'foo', 'baz'
    const result = await changeRelativePathBase({
      originalRelativePath: '../two/bar.ts',
      originalCwd: '/root/one',
      newCwd: '/root/two',
    })

    // Relative path to `/root/one/two/foo/bar.ts` from `/root/four`
    expect(result).toBe('./bar.ts')
  })
})

describe('adjustRelativeImportPaths', () => {
  it('adjusts a current dir import path', () => {
    const input = `import {bar} from './bar'`
    const result = adjustRelativeImportPaths({
      fileText: input,
      filePath: '/root/foo.js',
      newCwd: '/root/one',
    })
    expect(result).toBe(`import {bar} from '../bar'`)
  })

  it('adjusts a single parent dir import path', () => {
    const input = `import bar from '../bar'`
    const result = adjustRelativeImportPaths({
      fileText: input,
      filePath: '/root/one/two/foo.js',
      newCwd: '/root/three',
    })
    expect(result).toBe(`import bar from '../one/bar'`)
  })

  it('adjusts a multiple parent dir import path', () => {
    const input = `import { bar } from '../../../bar'`
    const result = adjustRelativeImportPaths({
      fileText: input,
      filePath: '/root/one/two/three/four/five/foo.js',
      newCwd: '/root/six',
    })
    expect(result).toBe(`import { bar } from '../one/two/bar'`)
  })

  it('adjusts an import path into a current dir path', () => {
    const input = `import { bar } from '../three/bar'`
    const result = adjustRelativeImportPaths({
      fileText: input,
      filePath: '/root/one/foo.js',
      newCwd: '/root/three',
    })
    expect(result).toBe(`import { bar } from './bar'`)
  })

  it('adjusts multiple import paths at the same time', () => {
    const input = `
import {bar} from './bar'
import bar from '../bar'
import { bar } from '../../../bar
import { bar } from '../../../../../six/bar'
`

    const result = adjustRelativeImportPaths({
      fileText: input,
      filePath: '/root/one/two/three/four/five/foo.js',
      newCwd: '/root/six',
    })

    expect(result).toMatchInlineSnapshot(`
      "
      import {bar} from '../one/two/three/four/five/bar'
      import bar from '../one/two/three/four/bar'
      import { bar } from '../../../bar
      import { bar } from './bar'
      "
    `)
  })
})
