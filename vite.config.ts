/// <reference types="vitest" />

import { resolve } from 'path'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig((env) => {
  const { mode } = env
  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'src', 'index.ts'),
        name: 'zhlint',
        fileName: (format) => `zhlint.${format}.js`
      },
      sourcemap: true
    },
    define: {
      'globalThis.__DEV__': mode === 'development'
    },
    plugins: [nodePolyfills()],
    test: {
      coverage: {
        reporter: ['text', 'json', 'html']
      }
    }
  }
})
