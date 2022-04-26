import { describe, test, expect } from 'vitest'

import run, { Options } from '../src/run'

const lint = (...args: [string, Options?]) => run(...args).result

describe('lint by rule', () => {
  describe('[hyper-space-option] the existence of spaces around hyper marks', () => {
    test('forcing spaces', () => {
      const options = { rules: { hyper: { codeSpace: true }}}
      expect(lint('xxx`foo`xxx', options)).toBe('xxx `foo` xxx')
      expect(lint('xxx`foo` xxx', options)).toBe('xxx `foo` xxx')
      expect(lint('xxx `foo`xxx', options)).toBe('xxx `foo` xxx')
      expect(lint('xxx `foo` xxx', options)).toBe('xxx `foo` xxx')

      // internal spaces would be kept
      expect(lint('xxx ` foo`xxx', options)).toBe('xxx ` foo` xxx')

      expect(lint('xxx<code>foo</code>xxx', options)).toBe('xxx <code>foo</code> xxx')
      expect(lint('xxx<code>foo</code> xxx', options)).toBe('xxx <code>foo</code> xxx')
      expect(lint('xxx <code>foo</code>xxx', options)).toBe('xxx <code>foo</code> xxx')
      expect(lint('xxx <code>foo</code> xxx', options)).toBe('xxx <code>foo</code> xxx')
    })
    test('forcing no spaces', () => {
      const options = { rules: { hyper: { codeSpace: false }}}
      expect(lint('xxx`foo`xxx', options)).toBe('xxx`foo`xxx')
      expect(lint('xxx`foo` xxx', options)).toBe('xxx`foo`xxx')
      expect(lint('xxx `foo`xxx', options)).toBe('xxx`foo`xxx')
      expect(lint('xxx `foo` xxx', options)).toBe('xxx`foo`xxx')

      expect(lint('xxx<code>foo</code>xxx', options)).toBe('xxx<code>foo</code>xxx')
      expect(lint('xxx<code>foo</code> xxx', options)).toBe('xxx<code>foo</code>xxx')
      expect(lint('xxx <code>foo</code>xxx', options)).toBe('xxx<code>foo</code>xxx')
      expect(lint('xxx <code>foo</code> xxx', options)).toBe('xxx<code>foo</code>xxx')
    })
    test('keep the original spaces', () => {
      const options = undefined
      expect(lint('xxx`foo`xxx', options)).toBe('xxx`foo`xxx')
      expect(lint('xxx`foo` xxx', options)).toBe('xxx`foo` xxx')
      expect(lint('xxx `foo`xxx', options)).toBe('xxx `foo`xxx')
      expect(lint('xxx `foo` xxx', options)).toBe('xxx `foo` xxx')

      expect(lint('xxx<code>foo</code>xxx', options)).toBe('xxx<code>foo</code>xxx')
      expect(lint('xxx<code>foo</code> xxx', options)).toBe('xxx<code>foo</code> xxx')
      expect(lint('xxx <code>foo</code>xxx', options)).toBe('xxx <code>foo</code>xxx')
      expect(lint('xxx <code>foo</code> xxx', options)).toBe('xxx <code>foo</code> xxx')
    })
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
