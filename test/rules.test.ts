import { describe, test, expect } from 'vitest'

import run, { Options } from '../src/run'

const lint = (...args: [string, Options?]) => run(...args).result

describe('lint by rule', () => {
  test('[hyper-space-option] the existence of spaces around hyper marks', () => {
    expect(lint('xxx`foo` xxx',
      { rules: { hyper: { codeSpace: true }}}
    )).toBe('xxx `foo` xxx')
    expect(lint('xxx `foo`xxx',
      { rules: { hyper: { codeSpace: false }}}
    )).toBe('xxx`foo`xxx')
    expect(lint('xxx `foo`xxx')).toBe('xxx `foo`xxx')
  })
  test('[hyper-space-position] the position of spaces around hyper marks (if any)', () => {
    expect(lint('1', {
      rules: {
        hyper: {
          codeSpace: true
        }
      }
    })).toBe('1')
  })
})
