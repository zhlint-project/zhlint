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
    const options = { rules: { hyper: { codeSpace: true }}}
    expect(lint('x ** yyy ** z', options)).toBe('x **yyy** z')
    expect(lint('x _** yyy ** _ z', options)).toBe('x _**yyy**_ z')
    expect(lint('x _ ** yyy **_ z', options)).toBe('x _**yyy**_ z')
  })
  test('[punctuation-width-option] format each punctuation into the right width options', () => {
    const options = { rules: { punctuation: {
      halfWidth: `()`,
      fullWidth: `，。：；？！“”‘’`
    }}}
    expect(lint('你好,再见.', options)).toBe('你好，再见。')
    expect(lint('你（好）,再见.', options)).toBe('你(好)，再见。')
    expect(lint('你\'好\',再见.', options)).toBe('你‘好’，再见。')
    expect(lint('你"好",再见.', options)).toBe('你“好”，再见。')
    expect(lint('"你\'好\'",再见.', options)).toBe('“你‘好’”，再见。')

    // keep the single quote between half-width content without spaces
    expect(lint('what\'s up', options)).toBe('what\'s up')
  })
  describe('[punctuation-unify-option] unify the punctuation choices', () => {
    test('simplified', () => {
      const options: Options = { rules: { punctuation: { unified: 'simplified' }}}
      expect(lint(
        '老師說：「你們要記住國父說的『青年要立志做大事，不要做大官』這句話。」',
        options
      )).toBe(
        '老師說：“你們要記住國父說的‘青年要立志做大事，不要做大官’這句話。”'
      )
    })
    test('traditional', () => {
      const options: Options = { rules: { punctuation: { unified: 'traditional' }}}
      expect(lint(
        '老師說：“你們要記住國父說的‘青年要立志做大事，不要做大官’這句話。”',
        options
      )).toBe(
        '老師說：「你們要記住國父說的『青年要立志做大事，不要做大官』這句話。」'
      )
    })
  })
  describe('[space-content-option] the space between content and punctuation', () => {
    // TODO:
  })
})
