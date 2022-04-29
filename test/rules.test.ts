import { describe, test, expect } from 'vitest'

import run, { Options } from '../src/run'

const lint = (...args: [string, Options?]) => run(...args).result

describe('lint by rule', () => {
  describe('[hyper-code] the existence of spaces around hyper code marks', () => {
    test('forcing spaces', () => {
      const options: Options = { rules: { spaceOutsideCode: true } }
      expect(lint('xxx`foo`xxx', options)).toBe('xxx `foo` xxx')
      expect(lint('xxx`foo` xxx', options)).toBe('xxx `foo` xxx')
      expect(lint('xxx `foo`xxx', options)).toBe('xxx `foo` xxx')
      expect(lint('xxx `foo` xxx', options)).toBe('xxx `foo` xxx')

      // internal spaces would be kept
      expect(lint('xxx ` foo`xxx', options)).toBe('xxx ` foo` xxx')

      expect(lint('xxx<code>foo</code>xxx', options)).toBe(
        'xxx <code>foo</code> xxx'
      )
      expect(lint('xxx<code>foo</code> xxx', options)).toBe(
        'xxx <code>foo</code> xxx'
      )
      expect(lint('xxx <code>foo</code>xxx', options)).toBe(
        'xxx <code>foo</code> xxx'
      )
      expect(lint('xxx <code>foo</code> xxx', options)).toBe(
        'xxx <code>foo</code> xxx'
      )
    })
    test('forcing no spaces', () => {
      const options: Options = { rules: { spaceOutsideCode: false } }
      expect(lint('xxx`foo`xxx', options)).toBe('xxx`foo`xxx')
      expect(lint('xxx`foo` xxx', options)).toBe('xxx`foo`xxx')
      expect(lint('xxx `foo`xxx', options)).toBe('xxx`foo`xxx')
      expect(lint('xxx `foo` xxx', options)).toBe('xxx`foo`xxx')

      expect(lint('xxx<code>foo</code>xxx', options)).toBe(
        'xxx<code>foo</code>xxx'
      )
      expect(lint('xxx<code>foo</code> xxx', options)).toBe(
        'xxx<code>foo</code>xxx'
      )
      expect(lint('xxx <code>foo</code>xxx', options)).toBe(
        'xxx<code>foo</code>xxx'
      )
      expect(lint('xxx <code>foo</code> xxx', options)).toBe(
        'xxx<code>foo</code>xxx'
      )
    })
    test('keep the original spaces', () => {
      const options = undefined
      expect(lint('xxx`foo`xxx', options)).toBe('xxx`foo`xxx')
      expect(lint('xxx`foo` xxx', options)).toBe('xxx`foo` xxx')
      expect(lint('xxx `foo`xxx', options)).toBe('xxx `foo`xxx')
      expect(lint('xxx `foo` xxx', options)).toBe('xxx `foo` xxx')

      expect(lint('xxx<code>foo</code>xxx', options)).toBe(
        'xxx<code>foo</code>xxx'
      )
      expect(lint('xxx<code>foo</code> xxx', options)).toBe(
        'xxx<code>foo</code> xxx'
      )
      expect(lint('xxx <code>foo</code>xxx', options)).toBe(
        'xxx <code>foo</code>xxx'
      )
      expect(lint('xxx <code>foo</code> xxx', options)).toBe(
        'xxx <code>foo</code> xxx'
      )
    })
  })
  test('[hyper-mark] the position of spaces around hyper marks (if any)', () => {
    const options: Options = {
      rules: { noSpaceInsideMark: true }
    }
    expect(lint('x ** yyy ** z', options)).toBe('x **yyy** z')
    expect(lint('x _** yyy ** _ z', options)).toBe('x _**yyy**_ z')
    expect(lint('x _ ** yyy **_ z', options)).toBe('x _**yyy**_ z')
  })
  test('[punctuation-width] format each punctuation into the right width options', () => {
    const options = {
      rules: {
        halfWidthPunctuation: `()`,
        fullWidthPunctuation: `，。：；？！“”‘’`
      }
    }
    expect(lint('你好,再见.', options)).toBe('你好，再见。')
    expect(lint('你（好）,再见.', options)).toBe('你(好)，再见。')
    expect(lint("你'好',再见.", options)).toBe('你‘好’，再见。')
    expect(lint('你"好",再见.', options)).toBe('你“好”，再见。')
    expect(lint('"你\'好\'",再见.', options)).toBe('“你‘好’”，再见。')

    // keep the single quote between half-width content without spaces
    expect(lint("what's up", options)).toBe("what's up")
  })
  describe('[punctuation-unification] unify the punctuation choices', () => {
    test('simplified', () => {
      const options: Options = {
        rules: { unifiedPunctuation: 'simplified' }
      }
      expect(
        lint(
          '老師說：「你們要記住國父說的『青年要立志做大事，不要做大官』這句話。」',
          options
        )
      ).toBe(
        '老師說：“你們要記住國父說的‘青年要立志做大事，不要做大官’這句話。”'
      )
    })
    test('traditional', () => {
      const options: Options = {
        rules: { unifiedPunctuation: 'traditional' }
      }
      expect(
        lint(
          '老師說：“你們要記住國父說的‘青年要立志做大事，不要做大官’這句話。”',
          options
        )
      ).toBe(
        '老師說：「你們要記住國父說的『青年要立志做大事，不要做大官』這句話。」'
      )
    })
  })
  describe('[space-content] the space between content', () => {
    test('one and only one space between half-width content', () => {
      const options: Options = {
        rules: { spaceBetweenHalfWidthContent: true }
      }
      expect(lint('foo bar   baz', options)).toBe('foo bar baz')
    })
    test('no space between full-width content', () => {
      const options: Options = {
        rules: { noSpaceBetweenFullWidthContent: true }
      }
      expect(lint('中文 中文 中 文', options)).toBe('中文中文中文')
    })
    test('one space between mixed-width content', () => {
      const options: Options = {
        rules: { spaceBetweenMixedWidthContent: true }
      }
      expect(lint('中文foo 中文 foo中foo文', options)).toBe(
        '中文 foo 中文 foo 中 foo 文'
      )
    })
    test('no space between mixed-width content', () => {
      const options: Options = {
        rules: { spaceBetweenMixedWidthContent: false }
      }
      expect(lint('中文foo 中文 foo中foo文', options)).toBe(
        '中文foo中文foo中foo文'
      )
    })
  })
  describe('[space-punctuation] the space between content and punctuation', () => {
    test('no space before punctuation', () => {
      const options: Options = {
        rules: { noSpaceBeforePunctuation: true }
      }
      expect(lint('中文 , 一. 二 ；三。四', options)).toBe(
        '中文, 一. 二；三。四'
      )
    })
    test('no space after half-width punctuation', () => {
      const options: Options = {
        rules: { spaceAfterHalfWidthPunctuation: true }
      }
      expect(lint('中文, 中文.中； 文。中文', options)).toBe(
        '中文, 中文. 中； 文。中文'
      )
    })
    test('no space after full-width punctuation', () => {
      const options: Options = {
        rules: { noSpaceAfterFullWidthPunctuation: true }
      }
      expect(lint('中文, 中文.中； 文。中文', options)).toBe(
        '中文, 中文.中；文。中文'
      )
    })
  })
  describe('[space-quote] the space around quotes', () => {
    test('no space inside', () => {
      const options: Options = {
        rules: { noSpaceInsideQuote: true }
      }
      expect(lint('foo " bar " baz', options)).toBe('foo "bar" baz')
      expect(lint('foo “ bar ” baz', options)).toBe('foo “bar” baz')
    })
    test('one space outside', () => {
      const options: Options = {
        rules: { spaceOutsideQuote: true }
      }
      expect(lint('foo " bar " baz', options)).toBe('foo " bar " baz')
      expect(lint('foo “ bar ” baz', options)).toBe('foo “ bar ” baz')
      expect(lint('foo, " bar " , baz', options)).toBe('foo, " bar ", baz')
      expect(lint('foo. “ bar ” . baz', options)).toBe('foo. “ bar ”. baz')
      expect(lint('一 " 二 " 三', options)).toBe('一" 二 "三')
      expect(lint('一 “ 二 ” 三', options)).toBe('一“ 二 ”三')
      expect(lint('一， " 二 " ， 三', options)).toBe('一，" 二 "， 三')
      expect(lint('一。 “ 二 ” 。 三', options)).toBe('一。“ 二 ”。 三')
    })
    test('no space outside', () => {
      const options: Options = {
        rules: { spaceOutsideQuote: false }
      }
      expect(lint('foo " bar " baz', options)).toBe('foo" bar "baz')
      expect(lint('foo “ bar ” baz', options)).toBe('foo“ bar ”baz')
      expect(lint('foo, " bar " , baz', options)).toBe('foo," bar ", baz')
      expect(lint('foo. “ bar ” . baz', options)).toBe('foo.“ bar ”. baz')
      expect(lint('一 " 二 " 三', options)).toBe('一" 二 "三')
      expect(lint('一 “ 二 ” 三', options)).toBe('一“ 二 ”三')
      expect(lint('一， " 二 " ， 三', options)).toBe('一，" 二 "， 三')
      expect(lint('一。 “ 二 ” 。 三', options)).toBe('一。“ 二 ”。 三')
    })
  })
  describe('[space-bracket] the space around brackets', () => {
    test('no space inside', () => {
      const options: Options = {
        rules: { noSpaceInsideBracket: true }
      }
      expect(lint('foo (bar) baz', options)).toBe('foo (bar) baz')
      expect(lint('foo ( bar ) baz', options)).toBe('foo (bar) baz')
      expect(lint('foo （bar） baz', options)).toBe('foo （bar） baz')
      expect(lint('foo （ bar ） baz', options)).toBe('foo （bar） baz')
    })
    test('one space outside', () => {
      const options: Options = {
        rules: { spaceOutsideBracket: true }
      }
      expect(lint('foo(bar)baz', options)).toBe('foo (bar) baz')
      expect(lint('foo ( bar ) baz', options)).toBe('foo ( bar ) baz')
      expect(lint('foo（bar）baz', options)).toBe('foo（bar）baz')
      expect(lint('foo （ bar ） baz', options)).toBe('foo（ bar ）baz')
    })
    test('no space outside', () => {
      const options: Options = {
        rules: { spaceOutsideBracket: false }
      }
      expect(lint('foo(bar)baz', options)).toBe('foo(bar)baz')
      expect(lint('foo ( bar ) baz', options)).toBe('foo( bar )baz')
      expect(lint('foo（bar）baz', options)).toBe('foo（bar）baz')
      expect(lint('foo （ bar ） baz', options)).toBe('foo（ bar ）baz')
    })
  })
  describe.todo('combo cases', () => {
    // TODO:
  })
})

// TODO: validation and messages

// TODO: error handling
