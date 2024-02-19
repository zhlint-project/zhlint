import { describe, test, expect } from 'vitest'

import { Options } from '../src/run.js'
import { ValidationTarget } from '../src/report.js'
import {
  BRACKET_NOSPACE_INSIDE,
  CODE_SPACE_OUTSIDE,
  CONTENT_SPACE_HALF_WIDTH,
  MARKDOWN_NOSPACE_INSIDE,
  PUNCTUATION_FULL_WIDTH,
  PUNCTUATION_NOSPACE_BEFORE,
  PUNCTUATION_UNIFICATION,
  QUOTATION_NOSPACE_INSIDE
} from '../src/rules/messages.js'

import { getOutput, lint, options } from './prepare.js'

describe('lint by rules', () => {
  // NOTE: the side spaces won't be recognized in latest remark parser
  test.skip('[space-trim] trim the spaces', () => {
    const options: Options = { rules: { trimSpace: true } }
    expect(getOutput(' `foo` "foo" ')).toBe(' `foo` "foo" ')
    expect(getOutput(' `foo` "foo" ', options)).toBe('`foo` "foo"')
    expect(getOutput(' foo bar   ', options)).toBe('foo bar')
    expect(getOutput('中文, 中文. ', options)).toBe('中文, 中文.')
    expect(getOutput('中文, 中文.中； 文。 ', options)).toBe(
      '中文, 中文.中； 文。'
    )
    expect(getOutput(' " bar " ', options)).toBe('" bar "')
    expect(getOutput(' (bar) ', options)).toBe('(bar)')
  })
  // NOTE: this is an invalid mark in latest remark parser
  test.skip('[hyper-mark] the position of spaces around hyper marks (if any)', () => {
    const options: Options = {
      rules: { noSpaceInsideHyperMark: true }
    }
    expect(lint('x ** yyy ** z', options)).toEqual({
      output: 'x **yyy** z',
      warnings: [
        {
          index: 4,
          target: ValidationTarget.SPACE_AFTER,
          message: MARKDOWN_NOSPACE_INSIDE
        },
        {
          index: 8,
          target: ValidationTarget.SPACE_AFTER,
          message: MARKDOWN_NOSPACE_INSIDE
        }
      ]
    })
    expect(getOutput('x _** yyy ** _ z', options)).toBe('x _**yyy**_ z')
    expect(getOutput('x _ ** yyy **_ z', options)).toBe('x _**yyy**_ z')

    expect(getOutput('_ ** yyy **_', options)).toBe('_**yyy**_')
  })
  describe('[hyper-code] the existence of spaces around hyper code marks', () => {
    test('forcing spaces', () => {
      const options: Options = { rules: { spaceOutsideCode: true } }
      expect(lint('xxx`foo`xxx', options)).toEqual({
        output: 'xxx `foo` xxx',
        warnings: [
          {
            index: 3,
            target: ValidationTarget.SPACE_AFTER,
            message: CODE_SPACE_OUTSIDE
          },
          {
            index: 8,
            target: ValidationTarget.SPACE_AFTER,
            message: CODE_SPACE_OUTSIDE
          }
        ]
      })
      expect(getOutput('xxx`foo` xxx', options)).toBe('xxx `foo` xxx')
      expect(getOutput('xxx `foo`xxx', options)).toBe('xxx `foo` xxx')
      expect(getOutput('xxx `foo` xxx', options)).toBe('xxx `foo` xxx')

      // internal spaces would be kept
      expect(getOutput('xxx ` foo`xxx', options)).toBe('xxx ` foo` xxx')

      expect(lint('xxx<code>foo</code>xxx', options)).toEqual({
        output: 'xxx <code>foo</code> xxx',
        warnings: [
          {
            index: 3,
            target: ValidationTarget.SPACE_AFTER,
            message: CODE_SPACE_OUTSIDE
          },
          {
            index: 19,
            target: ValidationTarget.SPACE_AFTER,
            message: CODE_SPACE_OUTSIDE
          }
        ]
      })
      expect(getOutput('xxx<code>foo</code> xxx', options)).toBe(
        'xxx <code>foo</code> xxx'
      )
      expect(getOutput('xxx <code>foo</code>xxx', options)).toBe(
        'xxx <code>foo</code> xxx'
      )
      expect(getOutput('xxx <code>foo</code> xxx', options)).toBe(
        'xxx <code>foo</code> xxx'
      )
    })
    test('forcing no spaces', () => {
      const options: Options = { rules: { spaceOutsideCode: false } }
      expect(getOutput('xxx`foo`xxx', options)).toBe('xxx`foo`xxx')
      expect(getOutput('xxx`foo` xxx', options)).toBe('xxx`foo`xxx')
      expect(getOutput('xxx `foo`xxx', options)).toBe('xxx`foo`xxx')
      expect(getOutput('xxx `foo` xxx', options)).toBe('xxx`foo`xxx')

      expect(getOutput('xxx<code>foo</code>xxx', options)).toBe(
        'xxx<code>foo</code>xxx'
      )
      expect(getOutput('xxx<code>foo</code> xxx', options)).toBe(
        'xxx<code>foo</code>xxx'
      )
      expect(getOutput('xxx <code>foo</code>xxx', options)).toBe(
        'xxx<code>foo</code>xxx'
      )
      expect(getOutput('xxx <code>foo</code> xxx', options)).toBe(
        'xxx<code>foo</code>xxx'
      )
    })
    test('keep the original spaces', () => {
      const options = undefined
      expect(getOutput('xxx`foo`xxx', options)).toBe('xxx`foo`xxx')
      expect(getOutput('xxx`foo` xxx', options)).toBe('xxx`foo` xxx')
      expect(getOutput('xxx `foo`xxx', options)).toBe('xxx `foo`xxx')
      expect(getOutput('xxx `foo` xxx', options)).toBe('xxx `foo` xxx')

      expect(getOutput('xxx<code>foo</code>xxx', options)).toBe(
        'xxx<code>foo</code>xxx'
      )
      expect(getOutput('xxx<code>foo</code> xxx', options)).toBe(
        'xxx<code>foo</code> xxx'
      )
      expect(getOutput('xxx <code>foo</code>xxx', options)).toBe(
        'xxx <code>foo</code>xxx'
      )
      expect(getOutput('xxx <code>foo</code> xxx', options)).toBe(
        'xxx <code>foo</code> xxx'
      )
    })
  })
  test('[punctuation-width] format each punctuation into the right width options', () => {
    const options = {
      rules: {
        halfwidthPunctuation: `()`,
        fullwidthPunctuation: `，。：；？！“”‘’`
      }
    }
    expect(lint('你好,再见.', options)).toEqual({
      output: '你好，再见。',
      warnings: [
        {
          index: 3,
          target: ValidationTarget.VALUE,
          message: PUNCTUATION_FULL_WIDTH
        },
        {
          index: 6,
          target: ValidationTarget.VALUE,
          message: PUNCTUATION_FULL_WIDTH
        }
      ]
    })
    expect(getOutput('你（好）,再见.', options)).toBe('你(好)，再见。')
    expect(getOutput("你'好',再见.", options)).toBe('你‘好’，再见。')
    expect(getOutput('你"好",再见.', options)).toBe('你“好”，再见。')
    expect(getOutput('"你\'好\'",再见.', options)).toBe('“你‘好’”，再见。')

    // keep the single quotation between half-width content without spaces
    expect(getOutput("what's up", options)).toBe("what's up")
  })
  describe('[punctuation-unification] unify the punctuation choices', () => {
    test('simplified', () => {
      const options: Options = {
        rules: { unifiedPunctuation: 'simplified' }
      }
      expect(
        lint(
          // Any better example?
          '老師說：「你們要記住國父說的『青年要立志做大事，不要做大官』這句話。」',
          options
        )
      ).toEqual({
        output:
          '老師說：“你們要記住國父說的‘青年要立志做大事，不要做大官’這句話。”',
        warnings: [
          {
            index: 4,
            target: ValidationTarget.START_VALUE,
            message: PUNCTUATION_UNIFICATION
          },
          {
            index: 34,
            target: ValidationTarget.END_VALUE,
            message: PUNCTUATION_UNIFICATION
          },
          {
            index: 14,
            target: ValidationTarget.START_VALUE,
            message: PUNCTUATION_UNIFICATION
          },
          {
            index: 29,
            target: ValidationTarget.END_VALUE,
            message: PUNCTUATION_UNIFICATION
          }
        ]
      })

      // unify other common punctuations
      expect(getOutput('中●文', options)).toBe('中·文')
    })
    test('traditional', () => {
      const options: Options = {
        rules: { unifiedPunctuation: 'traditional' }
      }
      expect(
        getOutput(
          '老師說：“你們要記住國父說的‘青年要立志做大事，不要做大官’這句話。”',
          options
        )
      ).toBe(
        '老師說：「你們要記住國父說的『青年要立志做大事，不要做大官』這句話。」'
      )

      // unify other common punctuations
      expect(getOutput('中●文', options)).toBe('中·文')
    })
    test('specified other common punctuations', () => {
      expect(
        getOutput('中●文', {
          rules: {
            unifiedPunctuation: {
              default: false
            }
          }
        })
      ).toBe('中●文')

      expect(
        getOutput('中●文', {
          rules: {
            unifiedPunctuation: {
              default: false,
              '·': ['●', '•', '·', '‧', '・']
            }
          }
        })
      ).toBe('中·文')
    })
  })
  describe('[space-content] the space between content', () => {
    test('one and only one space between half-width content', () => {
      const options: Options = {
        rules: { spaceBetweenHalfwidthContent: true }
      }
      expect(lint('foo bar   baz', options)).toEqual({
        output: 'foo bar baz',
        warnings: [
          {
            index: 7,
            target: ValidationTarget.SPACE_AFTER,
            message: CONTENT_SPACE_HALF_WIDTH
          }
        ]
      })
    })
    test('no space between full-width content', () => {
      const options: Options = {
        rules: { noSpaceBetweenFullwidthContent: true }
      }
      expect(getOutput('中文 中文 中 文', options)).toBe('中文中文中文')
    })
    test('one space between mixed-width content', () => {
      const options: Options = {
        rules: { spaceBetweenMixedwidthContent: true }
      }
      expect(getOutput('中文foo 中文 foo中foo文', options)).toBe(
        '中文 foo 中文 foo 中 foo 文'
      )
    })
    test('no space between mixed-width content', () => {
      const options: Options = {
        rules: { spaceBetweenMixedwidthContent: false }
      }
      expect(getOutput('中文foo 中文 foo中foo文', options)).toBe(
        '中文foo中文foo中foo文'
      )
    })
  })
  describe('[space-punctuation] the space between content and punctuation', () => {
    test('no space before punctuation', () => {
      const options: Options = {
        rules: { noSpaceBeforePauseOrStop: true }
      }
      expect(lint('中文 , 一. 二 ；三。四', options)).toEqual({
        output: '中文, 一. 二；三。四',
        warnings: [
          {
            index: 2,
            target: ValidationTarget.SPACE_AFTER,
            message: PUNCTUATION_NOSPACE_BEFORE
          },
          {
            index: 9,
            target: ValidationTarget.SPACE_AFTER,
            message: PUNCTUATION_NOSPACE_BEFORE
          }
        ]
      })
      expect(getOutput('foo, " bar " , baz', options)).toBe('foo, " bar ", baz')
      expect(getOutput('foo. “ bar ” . baz', options)).toBe('foo. “ bar ”. baz')
      expect(getOutput('一， " 二 " ， 三', options)).toBe('一， " 二 "， 三')
      expect(getOutput('一。 “ 二 ” 。 三', options)).toBe('一。 “ 二 ”。 三')
      expect(getOutput('foo, " bar " , baz', options)).toBe('foo, " bar ", baz')
      expect(getOutput('foo. “ bar ” . baz', options)).toBe('foo. “ bar ”. baz')
      expect(getOutput('一， " 二 " ， 三', options)).toBe('一， " 二 "， 三')
      expect(getOutput('一。 “ 二 ” 。 三', options)).toBe('一。 “ 二 ”。 三')
    })
    test('one space after half-width punctuation', () => {
      const options: Options = {
        rules: { spaceAfterHalfwidthPauseOrStop: true }
      }
      expect(getOutput('中文, 中文.中； 文。中文', options)).toBe(
        '中文, 中文. 中； 文。中文'
      )
      expect(getOutput('foo," bar " , baz', options)).toBe('foo, " bar " , baz')
      expect(getOutput('foo.“ bar ” . baz', options)).toBe('foo. “ bar ” . baz')
    })
    test('no space after full-width punctuation', () => {
      const options: Options = {
        rules: { noSpaceAfterFullwidthPauseOrStop: true }
      }
      expect(getOutput('中文, 中文.中； 文。中文', options)).toBe(
        '中文, 中文.中；文。中文'
      )
      expect(getOutput('一， " 二 " ， 三', options)).toBe('一，" 二 " ，三')
      expect(getOutput('一。 “ 二 ” 。 三', options)).toBe('一。“ 二 ” 。三')
    })
  })
  describe('[space-quotation] the space around quotations', () => {
    test('no space inside', () => {
      const options: Options = {
        rules: {
          noSpaceInsideQuotation: true
        }
      }
      expect(lint('foo " bar " baz', options)).toEqual({
        output: 'foo "bar" baz',
        warnings: [
          {
            index: 5,
            target: ValidationTarget.INNER_SPACE_BEFORE,
            message: QUOTATION_NOSPACE_INSIDE
          },
          {
            index: 9,
            target: ValidationTarget.SPACE_AFTER,
            message: QUOTATION_NOSPACE_INSIDE
          }
        ]
      })
      expect(getOutput('foo “ bar ” baz', options)).toBe('foo “bar” baz')
    })
    test('one space outside half quotation', () => {
      const options: Options = {
        rules: {
          spaceOutsideHalfwidthQuotation: true
        }
      }
      expect(getOutput('foo " bar " baz', options)).toBe('foo " bar " baz')
      expect(getOutput('foo “ bar ” baz', options)).toBe('foo “ bar ” baz')

      expect(getOutput('一 " 二 " 三', options)).toBe('一 " 二 " 三')
    })
    test('no space outside half quotation', () => {
      const options: Options = {
        rules: {
          spaceOutsideHalfwidthQuotation: false
        }
      }
      expect(getOutput('foo " bar " baz', options)).toBe('foo" bar "baz')
      expect(getOutput('一 " 二 " 三', options)).toBe('一" 二 "三')
      expect(getOutput('一 “ 二 ” 三', options)).toBe('一 “ 二 ” 三')
    })
    test('no space outside full quotation', () => {
      const options: Options = {
        rules: {
          noSpaceOutsideFullwidthQuotation: true
        }
      }
      expect(getOutput('一 “ 二 ” 三', options)).toBe('一“ 二 ”三')
      expect(getOutput('foo “ bar ” baz', options)).toBe('foo“ bar ”baz')
      expect(getOutput('一 “ 二 ” 三', options)).toBe('一“ 二 ”三')
    })
    test('with adjustedFullWidthOption option', () => {
      const options: Options = {
        rules: {
          noSpaceOutsideFullwidthQuotation: true,
          adjustedFullwidthPunctuation: `“”‘’`
        }
      }
      expect(getOutput('一 “ 二 ” 三', options)).toBe('一 “ 二 ” 三')
      expect(getOutput('foo “ bar ” baz', options)).toBe('foo “ bar ” baz')
      expect(getOutput('一 “ 二 ” 三', options)).toBe('一 “ 二 ” 三')
    })
  })
  describe('[space-bracket] the space around brackets', () => {
    test('no space inside', () => {
      const options: Options = {
        rules: { noSpaceInsideBracket: true }
      }
      expect(lint('foo (bar) baz', options)).toEqual({
        output: 'foo (bar) baz',
        warnings: []
      })
      expect(lint('foo ( bar ) baz', options)).toEqual({
        output: 'foo (bar) baz',
        warnings: [
          {
            index: 5,
            target: ValidationTarget.SPACE_AFTER,
            message: BRACKET_NOSPACE_INSIDE
          },
          {
            index: 9,
            target: ValidationTarget.SPACE_AFTER,
            message: BRACKET_NOSPACE_INSIDE
          }
        ]
      })
      expect(getOutput('foo （bar） baz', options)).toBe('foo （bar） baz')
      expect(getOutput('foo （ bar ） baz', options)).toBe('foo （bar） baz')
    })
    test('one space outside halfwidth bracket', () => {
      const options: Options = {
        rules: {
          spaceOutsideHalfwidthBracket: true
        }
      }
      expect(getOutput('foo ( bar ) baz', options)).toBe('foo ( bar ) baz')
      expect(getOutput("'foo'(bar)'baz'", options)).toBe("'foo' (bar) 'baz'")

      // skip content x bracket x content without space
      expect(getOutput('foo(bar)baz', options)).toBe('foo(bar)baz')
    })
    test('one space outside fullwidth bracket', () => {
      const options: Options = {
        rules: { noSpaceOutsideFullwidthBracket: true }
      }
      // expect(getOutput('foo（bar）baz', options)).toBe('foo（bar）baz')
      expect(getOutput('foo （ bar ） baz', options)).toBe('foo（ bar ）baz')
    })
    test('no space outside halfwidth bracket', () => {
      const options: Options = {
        rules: { spaceOutsideHalfwidthBracket: false }
      }
      expect(getOutput('foo(bar)baz', options)).toBe('foo(bar)baz')
      expect(getOutput('foo ( bar ) baz', options)).toBe('foo( bar )baz')
    })
    test('with adjustedFullWidthOption option', () => {
      const options: Options = {
        rules: {
          spaceOutsideHalfwidthBracket: true,
          adjustedFullwidthPunctuation: `‘’“”`
        }
      }
      expect(getOutput('‘foo’(bar)‘baz’', options)).toBe('‘foo’ (bar) ‘baz’')
    })
  })
  describe('[skip-pure-western] skip the content with full of western letters and punctuations', () => {
    test('skip pure western', () => {
      const options: Options = {
        rules: {
          skipPureWestern: true,
          halfwidthPunctuation: `()[]{}`,
          fullwidthPunctuation: `，。：；？！“”‘’`,
          adjustedFullwidthPunctuation: `“”‘’`,
          unifiedPunctuation: 'simplified'
        }
      }
      expect(lint('foo,bar,baz', options)).toEqual({
        output: 'foo,bar,baz',
        warnings: []
      })
    })
    test('handle mixed content', () => {
      const options: Options = {
        rules: {
          skipPureWestern: true,
          halfwidthPunctuation: `()[]{}`,
          fullwidthPunctuation: `，。：；？！“”‘’`,
          adjustedFullwidthPunctuation: `“”‘’`,
          unifiedPunctuation: 'simplified'
        }
      }
      expect(lint('中文,bar,中文', options)).toEqual({
        output: '中文，bar，中文',
        warnings: [
          {
            index: 3,
            target: ValidationTarget.VALUE,
            message: PUNCTUATION_FULL_WIDTH
          },
          {
            index: 7,
            target: ValidationTarget.VALUE,
            message: PUNCTUATION_FULL_WIDTH
          }
        ]
      })
    })
  })
})

describe('lint by cases', () => {
  test('[case-linebreak] keep the linebreaks', () => {
    expect(
      getOutput(
        `
  > foo  
  > bar 
  > baz
    `.trim(),
        options
      )
    ).toBe(
      `
  > foo  
  > bar 
  > baz
    `.trim()
    )
  })
  test('[case-zh-units]', () => {
    expect(getOutput('2019年06月26号 2019-06-26 12:00', options)).toBe(
      '2019年06月26号 2019-06-26 12:00'
    )
    expect(getOutput('1《测试》2【测试】3「测试」4（测试）', options)).toBe(
      '1《测试》2【测试】3 “测试” 4 (测试)'
    )
    expect(getOutput('1？2！', options)).toBe('1？2！')
  })
  test('[case-abbrs]', () => {
    expect(getOutput('运行时 + 编译器 vs. 只包含运行时', options)).toBe(
      '运行时 + 编译器 vs. 只包含运行时'
    )
  })
  test('[case] backslash', () => {
    expect(
      getOutput('This\\# is \\#not a heading but a normal hash', options)
    ).toBe('This\\# is \\#not a heading but a normal hash')
    expect(getOutput('这个\\#是普通的 \\# 井号而不是标题', options)).toBe(
      '这个\\#是普通的 \\# 井号而不是标题'
    )
  })
  test('[case] ellipsis', () => {
    expect(getOutput('aaa...bbb', options)).toBe('aaa...bbb')
    expect(getOutput('aaa... bbb', options)).toBe('aaa... bbb')
    expect(getOutput('aaa ...bbb', options)).toBe('aaa ...bbb')
    expect(getOutput('`aaa` ... `bbb`', options)).toBe('`aaa` ... `bbb`')
  })
  test('[case] URL', () => {
    expect(getOutput('Vue.js 是什么', options)).toBe('Vue.js 是什么')
    expect(getOutput('www.vuejs.org', options)).toBe('www.vuejs.org')
    expect(getOutput('https://vuejs.org', options)).toBe('https://vuejs.org')
  })
  test('[case] slash character', () => {
    expect(getOutput('想知道 Vue 与其它库/框架有哪些区别', options)).toBe(
      '想知道 Vue 与其它库/框架有哪些区别'
    )
  })
  test('[case] special characters', () => {
    expect(getOutput('Vue (读音 /vjuː/，类似于)', options)).toBe(
      'Vue (读音 /vjuː/，类似于)'
    )
  })
  test('[case] half-content x mark x half-content', () => {
    expect(getOutput('a__[b](x)__c', options)).toBe('a__[b](x)__c')
  })
  test('[case] plural brackets', () => {
    expect(getOutput('3 minite(s) left', options)).toBe('3 minite(s) left')
  })
  test('[case] single quotation for shorthand', () => {
    expect(getOutput(`how many user's here`, options)).toBe(
      `how many user's here`
    )
    expect(getOutput(`how many users' items here`, options)).toBe(
      `how many users' items here`
    )
    expect(getOutput(`what's going on`, options)).toBe(`what's going on`)
  })
  test('[case] math exp', () => {
    expect(getOutput('1+1=2', options)).toBe('1+1=2')
    expect(getOutput('a|b', options)).toBe('a|b')
    expect(getOutput('a | b', options)).toBe('a | b')
    expect(getOutput('a||b', options)).toBe('a||b')
    expect(getOutput('a || b', options)).toBe('a || b')
  })
  test('[case] arrow chars', () => {
    expect(getOutput('Chrome 顶部导航 > 窗口 > 任务管理', options)).toBe(
      'Chrome 顶部导航 > 窗口 > 任务管理'
    )
  })
  test('[case] curly brackets', () => {
    expect(getOutput('# 简介 {#introduction}', options)).toBe(
      '# 简介 {#introduction}'
    )
    expect(getOutput('# 简介{#introduction}', options)).toBe(
      '# 简介 {#introduction}'
    )
    expect(getOutput('### 托管模式 {#takeover-mode}', options)).toBe(
      '### 托管模式 {#takeover-mode}'
    )
  })
})
