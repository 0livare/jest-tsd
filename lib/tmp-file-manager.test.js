import path from 'node:path'
import {changeRelativePathBase, adjustImportPaths} from './tmp-file-manager'

describe('changeRelativePathBase', () => {
  describe('relative paths', () => {
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

  describe('adjustImportPaths', () => {
    it('adjusts a relative current dir import path', async () => {
      const input = `import {bar} from './bar'`
      const result = await adjustImportPaths({
        fileText: input,
        filePath: '/root/foo.js',
        newCwd: '/root/one',
      })
      expect(result).toBe(`import {bar} from '../bar'`)
    })

    it('adjusts a relative single parent dir import path', async () => {
      const input = `import bar from '../bar'`
      const result = await adjustImportPaths({
        fileText: input,
        filePath: '/root/one/two/foo.js',
        newCwd: '/root/three',
      })
      expect(result).toBe(`import bar from '../one/bar'`)
    })

    it('adjusts a relative multiple parent dir import path', async () => {
      const input = `import { bar } from '../../../bar'`
      const result = await adjustImportPaths({
        fileText: input,
        filePath: '/root/one/two/three/four/five/foo.js',
        newCwd: '/root/six',
      })
      expect(result).toBe(`import { bar } from '../one/two/bar'`)
    })

    it('adjusts an import path into a current dir path', async () => {
      const input = `import { bar } from '../three/bar'`
      const result = await adjustImportPaths({
        fileText: input,
        filePath: '/root/one/foo.js',
        newCwd: '/root/three',
      })
      expect(result).toBe(`import { bar } from './bar'`)
    })

    it('adjusts multiple relative import paths at the same time', async () => {
      const input = `
import {bar} from './bar'
import bar from '../bar'
import { bar } from '../../../bar
import { bar } from '../../../../../six/bar'
`

      const result = await adjustImportPaths({
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

  describe('node module imports', () => {
    it('adjusts a node module import path', async () => {
      // The node module here must be a real node_module that exists in the node_modules folder of this project
      const fileText = `import {foo} from 'jest'`
      const filePath = path.resolve(__dirname, 'foo.js')
      const newCwd = path.resolve(__dirname, 'one')
      const pkgDir = path.resolve(__dirname, '..')

      const result = await adjustImportPaths({fileText, filePath, newCwd, pkgDir})
      expect(result).toBe(`import {foo} from '../../node_modules/jest/build/index.js'`)
    })
  })
})
