/// <reference types="vitest" />

import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  build: {
    lib: {
      entry: resolve(__dirname, 'src', 'index.ts'),
      name: 'zhlint',
      fileName: format => `zhlint.${format}.js`
    },
    sourcemap: true
  },
  define: {
    'global.__DEV__': JSON.stringify(mode === 'development')
  },
  test: {}
}));
