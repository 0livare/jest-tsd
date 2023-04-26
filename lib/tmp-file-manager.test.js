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
})
