import typescript from '@rollup/plugin-typescript'
import {nodeResolve} from '@rollup/plugin-node-resolve'

export default {
  input: 'lib/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [typescript(), nodeResolve()],
  external: ['@babel/code-frame', 'chalk', 'tsd-lite', '@tsd/typescript', 'tmp-promise'],
}
