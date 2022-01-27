import { describe, test, expect } from 'vitest'

import run, { Options } from '../src/run'
import {
  CharType,
  checkCharType,
  Mark,
  MarkType,
  MutableToken,
  parse,
  SingleTokenType,
  toMutableResult,
  travel
} from '../src/parser'
import join from '../src/join'
import processRule from '../src/process-rule'
import findIgnoredMarks from '../src/ignore'

import spacePunctuation from '../src/rules/space-punctuation'
import spaceBrackets from '../src/rules/space-brackets'
import spaceQuotes from '../src/rules/space-quotes'
import spaceFullWidthContent from '../src/rules/space-full-width-content'
import unifyPunctuation from '../src/rules/unify-punctuation'
import caseTraditional from '../src/rules/case-traditional'
import caseDatetime from '../src/rules/case-datetime'
import caseDatetimeZh from '../src/rules/case-datetime-zh'

const lint = (...args) => run(...(args as [string, Options])).result

const purify = (arr) =>
  arr.map((item) => (Array.isArray(item) ? purify(item) : item))

const clone = (obj) => JSON.parse(JSON.stringify(obj))

const restruct = (str) => join(toMutableResult(parse(str)).tokens)

describe('check char type', () => {
  test('space', () => {
    expect(checkCharType(' ')).toBe('space')
  })
  test('digit', () => {
    expect(checkCharType('0')).toBe('content-half')
  })
  test('latin punctuation', () => {
    expect(checkCharType(',')).toBe('punctuation-half')
    expect(checkCharType('-')).toBe('punctuation-half')
    expect(checkCharType('"')).toBe('punctuation-half')
  })
  test('cjk punctuation', () => {
    expect(checkCharType('，')).toBe('punctuation-full')
    expect(checkCharType('。')).toBe('punctuation-full')
    expect(checkCharType('”')).toBe('punctuation-full')
  })
  test('latin', () => {
    expect(checkCharType('a')).toBe('content-half')
    expect(checkCharType('C')).toBe('content-half')
    expect(checkCharType('Ô')).toBe('content-half')
    expect(checkCharType('Ś')).toBe('content-half')
    expect(checkCharType('Ʒ')).toBe('content-half')
  })
  test('greek', () => {
    expect(checkCharType('α')).toBe('content-half')
  })
  test('cjk', () => {
    expect(checkCharType('中')).toBe('content-full')
    expect(checkCharType('五')).toBe('content-full')
    expect(checkCharType('䔷')).toBe('content-full')
    expect(checkCharType('𢙺')).toBe('content-full')
    expect(checkCharType('𢙽')).toBe('content-full')
    expect(checkCharType('中')).toBe('content-full')
    expect(checkCharType('⻍')).toBe('content-full')
  })
  test('emoji', () => {
    expect(checkCharType('😀')).toBe('unknown')
  })
})

describe('parser', () => {
  test('遵守JavaScript编码规范非常重要', () => {
    const { tokens, marks, groups } = parse('遵守JavaScript编码规范非常重要')
    expect(purify(tokens)).toEqual([
      {
        type: 'content-full',
        content: '遵守',
        spaceAfter: '',
        index: 0,
        length: 2
      },
      {
        type: 'content-half',
        content: 'JavaScript',
        spaceAfter: '',
        index: 2,
        length: 10
      },
      {
        type: 'content-full',
        content: '编码规范非常重要',
        spaceAfter: '',
        index: 12,
        length: 8
      }
    ])
    expect(marks.length).toBe(0)
    expect(groups.length).toBe(0)
  })
  test('关注(watch)你关心的仓库。', () => {
    const { tokens, marks } = parse('关注(watch)你关心的仓库。')
    const mark = {
      type: 'brackets',
      startContent: `(`,
      startIndex: 2,
      endContent: `)`,
      endIndex: 8
    }
    expect(marks).toEqual([mark])
    expect(purify(tokens)).toEqual([
      {
        type: 'content-full',
        content: '关注',
        spaceAfter: '',
        index: 0,
        length: 2
      },
      {
        type: 'mark-brackets',
        content: '(',
        spaceAfter: '',
        index: 2,
        length: 1,
        markSide: 'left',
        mark
      },
      {
        type: 'content-half',
        content: 'watch',
        spaceAfter: '',
        index: 3,
        length: 5
      },
      {
        type: 'mark-brackets',
        content: ')',
        spaceAfter: '',
        index: 8,
        length: 1,
        markSide: 'right',
        mark
      },
      {
        type: 'content-full',
        content: '你关心的仓库',
        spaceAfter: '',
        index: 9,
        length: 6
      },
      {
        type: 'punctuation-full',
        content: '。',
        spaceAfter: '',
        index: 15,
        length: 1
      }
    ])
  })
  test('如果你有任何问题，请联系@Vuejs_Events！', () => {
    const { tokens } = parse('如果你有任何问题，请联系@Vuejs_Events！')
    expect(purify(tokens)).toEqual([
      {
        type: 'content-full',
        content: '如果你有任何问题',
        spaceAfter: '',
        index: 0,
        length: 8
      },
      {
        type: 'punctuation-full',
        content: '，',
        spaceAfter: '',
        index: 8,
        length: 1
      },
      {
        type: 'content-full',
        content: '请联系',
        spaceAfter: '',
        index: 9,
        length: 3
      },
      {
        type: 'content-half',
        content: '@Vuejs_Events',
        spaceAfter: '',
        index: 12,
        length: 13
      },
      {
        type: 'punctuation-full',
        content: '！',
        spaceAfter: '',
        index: 25,
        length: 1
      }
    ])
  })
  test('每个版本的更新日志见 GitHub 。', () => {
    const { tokens } = parse('每个版本的更新日志见 GitHub 。')
    expect(purify(tokens)).toEqual([
      {
        type: 'content-full',
        content: '每个版本的更新日志见',
        index: 0,
        length: 10,
        spaceAfter: ' '
      },
      {
        type: 'content-half',
        content: 'GitHub',
        index: 11,
        length: 6,
        spaceAfter: ' '
      },
      {
        type: 'punctuation-full',
        content: '。',
        index: 18,
        length: 1,
        spaceAfter: ''
      }
    ])
  })
  test('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) ', () => {
    const { tokens, marks } = parse(
      'Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) '
    )
    const mark = {
      type: 'brackets',
      startContent: `(`,
      startIndex: 27,
      endContent: `)`,
      endIndex: 45
    }
    expect(marks).toEqual([mark])
    expect(purify(tokens)).toEqual([
      {
        type: 'content-half',
        content: 'Vue',
        index: 0,
        length: 2 - 0 + 1,
        spaceAfter: ' '
      },
      {
        type: 'content-full',
        content: '也可以在',
        index: 4,
        length: 7 - 4 + 1,
        spaceAfter: ' '
      },
      {
        type: 'content-half',
        content: 'unpkg',
        index: 9,
        length: 13 - 9 + 1,
        spaceAfter: ' '
      },
      {
        type: 'content-full',
        content: '和',
        index: 15,
        length: 15 - 15 + 1,
        spaceAfter: ' '
      },
      {
        type: 'content-half',
        content: 'cdnjs',
        index: 17,
        length: 21 - 17 + 1,
        spaceAfter: ' '
      },
      {
        type: 'content-full',
        content: '上获取',
        index: 23,
        length: 25 - 23 + 1,
        spaceAfter: ' '
      },
      {
        type: 'mark-brackets',
        content: '(',
        index: 27,
        length: 1,
        markSide: 'left',
        mark,
        spaceAfter: ' '
      },
      {
        type: 'content-half',
        content: 'cdnjs',
        index: 29,
        length: 33 - 29 + 1,
        spaceAfter: ' '
      },
      {
        type: 'content-full',
        content: '的版本更新可能略滞后',
        index: 35,
        length: 44 - 35 + 1,
        spaceAfter: ''
      },
      {
        type: 'mark-brackets',
        content: ')',
        index: 45,
        length: 1,
        markSide: 'right',
        mark,
        spaceAfter: ' '
      }
    ])
  })
  test('对于制作原型或学习,你可以这样使用最新版本:', () => {
    const { tokens } = parse('对于制作原型或学习,你可以这样使用最新版本:')
    expect(purify(tokens)).toEqual([
      {
        type: 'content-full',
        content: '对于制作原型或学习',
        index: 0,
        length: 8 - 0 + 1,
        spaceAfter: ''
      },
      {
        type: 'punctuation-half',
        content: ',',
        index: 9,
        length: 9 - 9 + 1,
        spaceAfter: ''
      },
      {
        type: 'content-full',
        content: '你可以这样使用最新版本',
        index: 10,
        length: 20 - 10 + 1,
        spaceAfter: ''
      },
      {
        type: 'punctuation-half',
        content: ':',
        index: 21,
        length: 21 - 21 + 1,
        spaceAfter: ''
      }
    ])
  })
  test('该指令的意思是: "将这个元素节点的 title 特性和 Vue 实例的 message 属性保持一致".', () => {
    const { tokens, marks, groups } = parse(
      '该指令的意思是: " 将这个元素节点的 title 特性和 Vue 实例的 message 属性保持一致".'
    )
    expect(purify(tokens)).toEqual([
      {
        type: 'content-full',
        content: '该指令的意思是',
        index: 0,
        length: 6 - 0 + 1,
        spaceAfter: ''
      },
      {
        type: 'punctuation-half',
        content: ':',
        index: 7,
        length: 8 - 8 + 1,
        spaceAfter: ' '
      },
      [
        {
          type: 'content-full',
          content: '将这个元素节点的',
          index: 10 + 1,
          length: 17 - 10 + 1,
          spaceAfter: ' '
        },
        {
          type: 'content-half',
          content: 'title',
          index: 19 + 1,
          length: 23 - 19 + 1,
          spaceAfter: ' '
        },
        {
          type: 'content-full',
          content: '特性和',
          index: 25 + 1,
          length: 27 - 25 + 1,
          spaceAfter: ' '
        },
        {
          type: 'content-half',
          content: 'Vue',
          index: 29 + 1,
          length: 31 - 29 + 1,
          spaceAfter: ' '
        },
        {
          type: 'content-full',
          content: '实例的',
          index: 33 + 1,
          length: 35 - 33 + 1,
          spaceAfter: ' '
        },
        {
          type: 'content-half',
          content: 'message',
          index: 37 + 1,
          length: 43 - 37 + 1,
          spaceAfter: ' '
        },
        {
          type: 'content-full',
          content: '属性保持一致',
          index: 45 + 1,
          length: 50 - 45 + 1,
          spaceAfter: ''
        }
      ],
      {
        type: 'punctuation-half',
        content: '.',
        index: 52 + 1,
        length: 52 - 52 + 1,
        spaceAfter: ''
      }
    ])
    expect(marks.length).toBe(0)
    expect(groups.length).toBe(1)
    expect(groups[0].startIndex).toBe(9)
    expect(groups[0].startContent).toBe('"')
    expect(groups[0].endIndex).toBe(51 + 1)
    expect(groups[0].endContent).toBe('"')
    expect(groups[0].innerSpaceBefore).toBe(' ')
    // expect(groups[0].rawInnerSpaceBefore).toBe(' ')
  })
})

describe('parser with hyper marks', () => {
  test('X [xxx](xxx) X', () => {
    const hyperMark: Mark = {
      startIndex: 2,
      startContent: '[',
      endIndex: 6,
      endContent: '](xxx)',
      type: MarkType.HYPER
    }
    const { tokens, marks, groups } = parse('X [xxx](xxx) X', [hyperMark])
    expect(purify(tokens)).toEqual([
      {
        type: 'content-half',
        content: 'X',
        index: 0,
        length: 1,
        spaceAfter: ' '
      },
      {
        type: 'mark-hyper',
        content: '[',
        index: 2,
        length: 1,
        spaceAfter: '',
        markSide: 'left',
        mark: hyperMark
      },
      {
        type: 'content-half',
        content: 'xxx',
        index: 3,
        length: 3,
        spaceAfter: ''
      },
      {
        type: 'mark-hyper',
        content: '](xxx)',
        index: 6,
        length: 6,
        spaceAfter: ' ',
        markSide: 'right',
        mark: hyperMark
      },
      {
        type: 'content-half',
        content: 'X',
        index: 13,
        length: 1,
        spaceAfter: ''
      }
    ])
    expect(marks).toEqual([hyperMark])
    expect(groups.length).toBe(0)
  })
  test('`v-bind:style` 的对象语法', () => {
    const hyperMark = {
      startIndex: 0,
      startContent: '`v-bind:style`',
      endIndex: 14,
      endContent: '',
      type: MarkType.RAW
    }
    const { tokens, marks, groups } = parse('`v-bind:style` 的对象语法', [
      hyperMark
    ])
    expect(purify(tokens)).toEqual([
      {
        type: 'content-hyper',
        content: '`v-bind:style`',
        index: 0,
        length: 14,
        spaceAfter: ' '
      },
      {
        type: 'content-full',
        content: '的对象语法',
        index: 15,
        length: 5,
        spaceAfter: ''
      }
    ])
    expect(marks).toEqual([hyperMark])
    expect(groups.length).toBe(0)
  })
})

describe('find ignored marks', () => {
  test('only start text', () => {
    expect(findIgnoredMarks('abcdefghijklmn', [{ textStart: 'cde' }])).toEqual([
      { start: 2, end: 5 }
    ])
    expect(findIgnoredMarks('abcdefghijklmn', [{ textStart: 'cdx' }])).toEqual(
      []
    )
  })
  test('start text + prefix', () => {
    expect(
      findIgnoredMarks('abcdefghijklmn', [{ prefix: 'b', textStart: 'cde' }])
    ).toEqual([{ start: 2, end: 5 }])
    expect(
      findIgnoredMarks('abcdefghijklmn', [{ prefix: 'b', textStart: 'cdx' }])
    ).toEqual([])
  })
  test('start text + end', () => {
    expect(
      findIgnoredMarks('abcdefghijklmn', [{ textStart: 'cd', textEnd: 'f' }])
    ).toEqual([{ start: 2, end: 6 }])
    expect(
      findIgnoredMarks('abcdefghijklmn', [{ textStart: 'cd', textEnd: 'x' }])
    ).toEqual([])
    expect(
      findIgnoredMarks('abcdefghijklmn', [{ textStart: 'x', textEnd: 'def' }])
    ).toEqual([])
    expect(
      findIgnoredMarks('abcdefghijklmn', [{ textStart: 'x', textEnd: 'x' }])
    ).toEqual([])
  })
  test('start + end + suffix', () => {
    expect(
      findIgnoredMarks('abcdefghijklmn', [
        { textStart: 'cd', textEnd: 'f', suffix: 'g' }
      ])
    ).toEqual([{ start: 2, end: 6 }])
    expect(
      findIgnoredMarks('abcdefghijklmn', [
        { textStart: 'cd', textEnd: 'f', suffix: 'x' }
      ])
    ).toEqual([])
    expect(
      findIgnoredMarks('abcdefghijklmn', [
        { textStart: 'x', textEnd: 'f', suffix: 'g' }
      ])
    ).toEqual([])
    expect(
      findIgnoredMarks('abcdefghijklmn', [
        { textStart: 'x', textEnd: 'x', suffix: 'g' }
      ])
    ).toEqual([])
  })
  test('multiple matches', () => {
    expect(
      findIgnoredMarks('abcdefghijklmnabcdefghijklmn', [
        { textStart: 'cd', textEnd: 'f', suffix: 'g' }
      ])
    ).toEqual([
      { start: 2, end: 6 },
      { start: 16, end: 20 }
    ])
  })
  test('multiple cases', () => {
    expect(
      findIgnoredMarks('abcdefghijklmnabcdefghijklmn', [
        { textStart: 'cd', textEnd: 'f', suffix: 'g' },
        { textStart: 'hij' }
      ])
    ).toEqual([
      { start: 2, end: 6 },
      { start: 7, end: 10 },
      { start: 16, end: 20 },
      { start: 21, end: 24 }
    ])
  })
})

describe('travel', () => {
  const expectedTokens = [
    {
      type: 'content-full',
      content: '遵守',
      index: 0,
      length: 1 - 0 + 1,
      spaceAfter: ''
    },
    {
      type: 'content-half',
      content: 'JavaScript',
      index: 2,
      length: 11 - 2 + 1,
      spaceAfter: ''
    },
    {
      type: 'content-full',
      content: '编码规范非常重要',
      index: 12,
      length: 19 - 12 + 1,
      spaceAfter: ''
    }
  ]
  test('general travel', () => {
    const { tokens } = parse('遵守JavaScript编码规范非常重要')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records: any[] = []
    travel(
      tokens,
      () => true,
      (token, index, tokens, result) =>
        records.push({ token, index, tokens, result })
    )
    expect(clone(records)).toEqual([
      {
        token: expectedTokens[0],
        tokens: expectedTokens,
        index: 0,
        result: true
      },
      {
        token: expectedTokens[1],
        tokens: expectedTokens,
        index: 1,
        result: true
      },
      {
        token: expectedTokens[2],
        tokens: expectedTokens,
        index: 2,
        result: true
      }
    ])
  })
  test('filter by type', () => {
    const { tokens } = parse('遵守JavaScript编码规范非常重要')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records: any[] = []
    travel(
      tokens,
      { type: CharType.CONTENT_HALF },
      (token, index, tokens, result) =>
        records.push({ token, index, tokens, result })
    )
    expect(clone(records)).toEqual([
      {
        token: expectedTokens[1],
        tokens: expectedTokens,
        index: 1,
        result: true
      }
    ])
  })
  test('filter by string match', () => {
    const { tokens } = parse('遵守JavaScript编码规范非常重要')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records: any[] = []
    travel(tokens, '规范', (token, index, tokens, result) =>
      records.push({ token, index, tokens, result })
    )
    expect(clone(records)).toEqual([
      {
        token: expectedTokens[2],
        tokens: expectedTokens,
        index: 2,
        result: ['规范']
      }
    ])
  })
  test('filter by regexp match', () => {
    const { tokens } = parse('遵守JavaScript编码规范非常重要')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records: any[] = []
    travel(tokens, /[a-z]{3}/, (token, index, tokens, result) =>
      records.push({ token, index, tokens, result })
    )
    expect(clone(records)).toEqual([
      {
        token: expectedTokens[1],
        tokens: expectedTokens,
        index: 1,
        result: ['ava']
      }
    ])
  })
  test('filter by function', () => {
    const { tokens } = parse('遵守JavaScript编码规范非常重要')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records: any[] = []
    travel(
      tokens,
      (_, index) => !!index,
      (token, index, tokens, result) =>
        records.push({ token, index, tokens, result })
    )
    expect(clone(records)).toEqual([
      {
        token: expectedTokens[1],
        tokens: expectedTokens,
        index: 1,
        result: true
      },
      {
        token: expectedTokens[2],
        tokens: expectedTokens,
        index: 2,
        result: true
      }
    ])
  })
})

describe('join', () => {
  test('parse and join then return the same', () => {
    expect(restruct('遵守JavaScript编码规范非常重要')).toBe(
      `遵守JavaScript编码规范非常重要`
    )
    expect(restruct(`关注(watch)你关心的仓库。`)).toBe(
      `关注(watch)你关心的仓库。`
    )
    expect(
      restruct(
        `Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) `
      )
    ).toBe(`Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) `)
    expect(
      restruct(
        `该指令的意思是: "将这个元素节点的 title 特性和 Vue 实例的 message 属性保持一致"`
      )
    ).toBe(
      `该指令的意思是: "将这个元素节点的 title 特性和 Vue 实例的 message 属性保持一致"`
    )
  })
})

describe('process rules', () => {
  test('replace half-width brackets into full-width', () => {
    const data = toMutableResult(parse(`关注(watch)你关心的仓库。`))
    processRule(data, {
      filter: { type: SingleTokenType.MARK_BRACKETS },
      handler: (token: MutableToken) => {
        token.modifiedContent =
          {
            '(': '（',
            ')': '）'
          }[token.content] || token.content
      }
    })
    expect(join(data.tokens)).toBe(`关注（watch）你关心的仓库。`)
  })
})

describe('lint by rule', () => {
  test('space between half-width content and full-width content', () => {
    expect(
      lint('汉字和English之间需要有空格比如 half width content。', {
        rules: [spaceFullWidthContent]
      })
    ).toBe('汉字和 English 之间需要有空格比如 half width content。')
  })
  test('space beside brackets', () => {
    const rules = [spaceFullWidthContent, spaceBrackets]
    expect(
      lint('汉字和Eng(lish之间)需要有空格比如 half width content。', { rules })
    ).toBe('汉字和 Eng(lish 之间) 需要有空格比如 half width content。')
    expect(
      lint('汉字和Eng（lish之间）需要有空格比如 half width content。', {
        rules
      })
    ).toBe('汉字和 Eng（lish 之间）需要有空格比如 half width content。')
    expect(
      lint(
        '汉 (字 ) 和Eng（lish之间）需（ 要）有(空格)比如 half w(i)dth content。',
        { rules }
      )
    ).toBe(
      '汉 (字) 和 Eng（lish 之间）需（要）有 (空格) 比如 half w(i)dth content。'
    )
  })
  test('unifies full-width/half-width mixed punctuation usage', () => {
    const rules = [spaceFullWidthContent, unifyPunctuation]
    expect(
      lint('汉字和English之间需要有空格比如 half width content.', { rules })
    ).toBe('汉字和 English 之间需要有空格比如 half width content。')
    expect(
      lint('汉字和"English"之间需要有空格比如 half width content.', { rules })
    ).toBe('汉字和“English”之间需要有空格比如 half width content。')
    expect(
      lint('汉字和English之间需要:有；空格比如 half width content.', { rules })
    ).toBe('汉字和 English 之间需要：有；空格比如 half width content。')
  })
  test('space beside punctuations', () => {
    expect(
      lint(
        '汉字和Engl,is。h之间,需，要有, 空， 格 ，比 , 如 half width content.',
        { rules: [spacePunctuation] }
      )
    ).toBe('汉字和Engl,is。h之间, 需，要有, 空，格，比, 如 half width content.')
  })
  test('space beside quotes', () => {
    expect(
      lint(`汉"字'和'English之间"需“要‘有’空”格比如 h'a'lf "width" content.`, {
        rules: [spaceQuotes]
      })
    ).toBe(
      `汉 "字 '和' English之间" 需“要‘有’空”格比如 h'a'lf "width" content.`
    )
  })
  test('traditional characters', () => {
    expect(
      lint(
        `老師說：「你們要記住國父說的『青年要立志做大事，不要做大官』這句話。」`,
        { rules: [caseTraditional] }
      )
    ).toBe(`老師說：“你們要記住國父說的‘青年要立志做大事，不要做大官’這句話。”`)
    expect(
      lint(
        `孔子曰：「求，周任有言曰：『陳力就列，不能則止。』危而不持，顛而不扶，則將焉用彼相矣？」`,
        { rules: [caseTraditional] }
      )
    ).toBe(
      `孔子曰：“求，周任有言曰：‘陳力就列，不能則止。’危而不持，顛而不扶，則將焉用彼相矣？”`
    )
    expect(
      lint(
        `我們雖不敢希望每個人能有范文正公「先天下之憂而憂，後天下之樂而樂」的大志向，但至少要有陶侃勤懇不懈的精神`,
        { rules: [caseTraditional] }
      )
    ).toBe(
      `我們雖不敢希望每個人能有范文正公“先天下之憂而憂，後天下之樂而樂”的大志向，但至少要有陶侃勤懇不懈的精神`
    )
    expect(
      lint(`所謂忠恕，也就是「盡己之心，推己及人」的意思。`, {
        rules: [caseTraditional]
      })
    ).toBe(`所謂忠恕，也就是“盡己之心，推己及人”的意思。`)
  })
  test('datetime', () => {
    const rules = [
      spaceFullWidthContent,
      spacePunctuation,
      caseDatetime,
      caseDatetimeZh
    ]
    expect(lint('2019年06月26号 2019-06-26 12:00', { rules })).toBe(
      '2019年06月26号 2019-06-26 12:00'
    )
  })
  test('abbr', () => {
    expect(lint('运行时 + 编译器 vs. 只包含运行时')).toBe(
      '运行时 + 编译器 vs. 只包含运行时'
    )
  })
})

describe('lint special/edge cases', () => {
  test('URL', () => {
    expect(lint('Vue.js 是什么')).toBe('Vue.js 是什么')
    expect(lint('www.vuejs.org')).toBe('www.vuejs.org')
    expect(lint('https://vuejs.org')).toBe('https://vuejs.org')
  })
  test('slash character', () => {
    expect(lint('想知道 Vue 与其它库/框架有哪些区别')).toBe(
      '想知道 Vue 与其它库/框架有哪些区别'
    )
  })
  test('special characters', () => {
    expect(lint('Vue (读音 /vjuː/，类似于)')).toBe('Vue (读音 /vjuː/，类似于)')
  })
  test('plural brackets', () => {
    expect(lint('3 minite(s) left')).toBe('3 minite(s) left')
  })
  test('single quote for shorthand', () => {
    expect(lint(`how many user's here`)).toBe(`how many user's here`)
    expect(lint(`how many users' items here`)).toBe(
      `how many users' items here`
    )
    expect(lint(`what's going on`)).toBe(`what's going on`)
  })
  test('math exp', () => {
    expect(lint('1+1=2')).toBe('1 + 1 = 2')
    expect(lint('a|b')).toBe('a|b')
    expect(lint('a| b')).toBe('a | b')
    expect(lint('a |b')).toBe('a | b')
    expect(lint('a | b')).toBe('a | b')
    expect(lint('a||b')).toBe('a||b')
    expect(lint('a|| b')).toBe('a || b')
    expect(lint('a ||b')).toBe('a || b')
    expect(lint('a || b')).toBe('a || b')
  })
  test('arrow chars', () => {
    expect(lint('Chrome 顶部导航 > 窗口 > 任务管理')).toBe(
      'Chrome 顶部导航 > 窗口 > 任务管理'
    )
  })
  // https://github.com/Jinjiang/zhlint/issues/23
  test('two dots only', () => {
    expect(lint('..')).toBe(
      '..'
    )
  })
})

describe('lint with different arguments', () => {
  test('stirng[] argument for rules', () => {
    expect(
      lint('汉字和English之间需要有空格比如 half width content。', {
        rules: ['space-full-width-content']
      })
    ).toBe('汉字和 English 之间需要有空格比如 half width content。')
  })
  test('ignored cases', () => {
    expect(
      lint('汉字和English之间需要有空格比如 half width content。', {
        ignoredCases: [{ textStart: '和English之间' }]
      })
    ).toBe('汉字和English之间需要有空格比如 half width content。')
  })
})
