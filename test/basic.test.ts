import { describe, test, expect } from 'vitest'

import {
  checkCharType,
  Mark,
  MarkType,
  MutableToken,
  parse,
  travel,
  toMutableResult
} from '../src/parser/index.js'
import join from '../src/join.js'
import findIgnoredMarks from '../src/ignore.js'

const purify = (arr) =>
  arr.map((item) => (Array.isArray(item) ? purify(item) : item))

const clone = (obj) => JSON.parse(JSON.stringify(obj))

const restruct = (str) => join(toMutableResult(parse(str)).tokens)

describe('check char type', () => {
  test('space', () => {
    expect(checkCharType(' ')).toBe('space')
  })
  test('digit', () => {
    expect(checkCharType('0')).toBe('western-letter')
  })
  test('latin punctuation', () => {
    expect(checkCharType(',')).toBe('halfwidth-pause-or-stop')
    expect(checkCharType('-')).toBe('halfwidth-other-punctuation')
    expect(checkCharType('"')).toBe('halfwidth-quotation')
  })
  test('cjk punctuation', () => {
    expect(checkCharType('，')).toBe('fullwidth-pause-or-stop')
    expect(checkCharType('。')).toBe('fullwidth-pause-or-stop')
    expect(checkCharType('”')).toBe('fullwidth-quotation')
  })
  test('latin', () => {
    expect(checkCharType('a')).toBe('western-letter')
    expect(checkCharType('C')).toBe('western-letter')
    expect(checkCharType('Ô')).toBe('western-letter')
    expect(checkCharType('Ś')).toBe('western-letter')
    expect(checkCharType('Ʒ')).toBe('western-letter')
  })
  test('greek', () => {
    expect(checkCharType('α')).toBe('western-letter')
  })
  test('cjk', () => {
    expect(checkCharType('中')).toBe('cjk-char')
    expect(checkCharType('五')).toBe('cjk-char')
    expect(checkCharType('䔷')).toBe('cjk-char')
    expect(checkCharType('𢙺')).toBe('cjk-char')
    expect(checkCharType('𢙽')).toBe('cjk-char')
    expect(checkCharType('中')).toBe('cjk-char')
    expect(checkCharType('⻍')).toBe('cjk-char')
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
        type: 'cjk-char',
        value: '遵守',
        spaceAfter: '',
        index: 0,
        length: 2
      },
      {
        type: 'western-letter',
        value: 'JavaScript',
        spaceAfter: '',
        index: 2,
        length: 10
      },
      {
        type: 'cjk-char',
        value: '编码规范非常重要',
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
      startValue: `(`,
      startIndex: 2,
      endValue: `)`,
      endIndex: 8
    }
    expect(marks).toEqual([mark])
    expect(purify(tokens)).toEqual([
      {
        type: 'cjk-char',
        value: '关注',
        spaceAfter: '',
        index: 0,
        length: 2
      },
      {
        type: 'bracket-mark',
        value: '(',
        spaceAfter: '',
        index: 2,
        length: 1,
        markSide: 'left',
        mark
      },
      {
        type: 'western-letter',
        value: 'watch',
        spaceAfter: '',
        index: 3,
        length: 5
      },
      {
        type: 'bracket-mark',
        value: ')',
        spaceAfter: '',
        index: 8,
        length: 1,
        markSide: 'right',
        mark
      },
      {
        type: 'cjk-char',
        value: '你关心的仓库',
        spaceAfter: '',
        index: 9,
        length: 6
      },
      {
        type: 'fullwidth-pause-or-stop',
        value: '。',
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
        type: 'cjk-char',
        value: '如果你有任何问题',
        spaceAfter: '',
        index: 0,
        length: 8
      },
      {
        type: 'fullwidth-pause-or-stop',
        value: '，',
        spaceAfter: '',
        index: 8,
        length: 1
      },
      {
        type: 'cjk-char',
        value: '请联系',
        spaceAfter: '',
        index: 9,
        length: 3
      },
      {
        type: 'halfwidth-other-punctuation',
        value: '@',
        spaceAfter: '',
        index: 12,
        length: 1
      },
      {
        type: 'western-letter',
        value: 'Vuejs_Events',
        spaceAfter: '',
        index: 13,
        length: 12
      },
      {
        type: 'fullwidth-pause-or-stop',
        value: '！',
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
        type: 'cjk-char',
        value: '每个版本的更新日志见',
        index: 0,
        length: 10,
        spaceAfter: ' '
      },
      {
        type: 'western-letter',
        value: 'GitHub',
        index: 11,
        length: 6,
        spaceAfter: ' '
      },
      {
        type: 'fullwidth-pause-or-stop',
        value: '。',
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
      startValue: `(`,
      startIndex: 27,
      endValue: `)`,
      endIndex: 45
    }
    expect(marks).toEqual([mark])
    expect(purify(tokens)).toEqual([
      {
        type: 'western-letter',
        value: 'Vue',
        index: 0,
        length: 2 - 0 + 1,
        spaceAfter: ' '
      },
      {
        type: 'cjk-char',
        value: '也可以在',
        index: 4,
        length: 7 - 4 + 1,
        spaceAfter: ' '
      },
      {
        type: 'western-letter',
        value: 'unpkg',
        index: 9,
        length: 13 - 9 + 1,
        spaceAfter: ' '
      },
      {
        type: 'cjk-char',
        value: '和',
        index: 15,
        length: 15 - 15 + 1,
        spaceAfter: ' '
      },
      {
        type: 'western-letter',
        value: 'cdnjs',
        index: 17,
        length: 21 - 17 + 1,
        spaceAfter: ' '
      },
      {
        type: 'cjk-char',
        value: '上获取',
        index: 23,
        length: 25 - 23 + 1,
        spaceAfter: ' '
      },
      {
        type: 'bracket-mark',
        value: '(',
        index: 27,
        length: 1,
        markSide: 'left',
        mark,
        spaceAfter: ' '
      },
      {
        type: 'western-letter',
        value: 'cdnjs',
        index: 29,
        length: 33 - 29 + 1,
        spaceAfter: ' '
      },
      {
        type: 'cjk-char',
        value: '的版本更新可能略滞后',
        index: 35,
        length: 44 - 35 + 1,
        spaceAfter: ''
      },
      {
        type: 'bracket-mark',
        value: ')',
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
        type: 'cjk-char',
        value: '对于制作原型或学习',
        index: 0,
        length: 8 - 0 + 1,
        spaceAfter: ''
      },
      {
        type: 'halfwidth-pause-or-stop',
        value: ',',
        index: 9,
        length: 9 - 9 + 1,
        spaceAfter: ''
      },
      {
        type: 'cjk-char',
        value: '你可以这样使用最新版本',
        index: 10,
        length: 20 - 10 + 1,
        spaceAfter: ''
      },
      {
        type: 'halfwidth-pause-or-stop',
        value: ':',
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
        type: 'cjk-char',
        value: '该指令的意思是',
        index: 0,
        length: 6 - 0 + 1,
        spaceAfter: ''
      },
      {
        type: 'halfwidth-pause-or-stop',
        value: ':',
        index: 7,
        length: 8 - 8 + 1,
        spaceAfter: ' '
      },
      [
        {
          type: 'cjk-char',
          value: '将这个元素节点的',
          index: 10 + 1,
          length: 17 - 10 + 1,
          spaceAfter: ' '
        },
        {
          type: 'western-letter',
          value: 'title',
          index: 19 + 1,
          length: 23 - 19 + 1,
          spaceAfter: ' '
        },
        {
          type: 'cjk-char',
          value: '特性和',
          index: 25 + 1,
          length: 27 - 25 + 1,
          spaceAfter: ' '
        },
        {
          type: 'western-letter',
          value: 'Vue',
          index: 29 + 1,
          length: 31 - 29 + 1,
          spaceAfter: ' '
        },
        {
          type: 'cjk-char',
          value: '实例的',
          index: 33 + 1,
          length: 35 - 33 + 1,
          spaceAfter: ' '
        },
        {
          type: 'western-letter',
          value: 'message',
          index: 37 + 1,
          length: 43 - 37 + 1,
          spaceAfter: ' '
        },
        {
          type: 'cjk-char',
          value: '属性保持一致',
          index: 45 + 1,
          length: 50 - 45 + 1,
          spaceAfter: ''
        }
      ],
      {
        type: 'halfwidth-pause-or-stop',
        value: '.',
        index: 52 + 1,
        length: 52 - 52 + 1,
        spaceAfter: ''
      }
    ])
    expect(marks.length).toBe(0)
    expect(groups.length).toBe(1)
    expect(groups[0].startIndex).toBe(9)
    expect(groups[0].startValue).toBe('"')
    expect(groups[0].endIndex).toBe(51 + 1)
    expect(groups[0].endValue).toBe('"')
    expect(groups[0].innerSpaceBefore).toBe(' ')
    // expect(groups[0].rawInnerSpaceBefore).toBe(' ')
  })
})

describe('parser with hyper marks', () => {
  test('X [xxx](xxx) X', () => {
    const hyperMark: Mark = {
      startIndex: 2,
      startValue: '[',
      endIndex: 6,
      endValue: '](xxx)',
      type: MarkType.HYPER
    }
    const { tokens, marks, groups } = parse('X [xxx](xxx) X', [hyperMark])
    expect(purify(tokens)).toEqual([
      {
        type: 'western-letter',
        value: 'X',
        index: 0,
        length: 1,
        spaceAfter: ' '
      },
      {
        type: 'hyper-mark',
        value: '[',
        index: 2,
        length: 1,
        spaceAfter: '',
        markSide: 'left',
        mark: hyperMark
      },
      {
        type: 'western-letter',
        value: 'xxx',
        index: 3,
        length: 3,
        spaceAfter: ''
      },
      {
        type: 'hyper-mark',
        value: '](xxx)',
        index: 6,
        length: 6,
        spaceAfter: ' ',
        markSide: 'right',
        mark: hyperMark
      },
      {
        type: 'western-letter',
        value: 'X',
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
      startValue: '`v-bind:style`',
      endIndex: 14,
      endValue: '',
      type: MarkType.RAW
    }
    const { tokens, marks, groups } = parse('`v-bind:style` 的对象语法', [
      hyperMark
    ])
    expect(purify(tokens)).toEqual([
      {
        type: 'code-content',
        value: '`v-bind:style`',
        index: 0,
        length: 14,
        spaceAfter: ' '
      },
      {
        type: 'cjk-char',
        value: '的对象语法',
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
      type: 'cjk-char',
      value: '遵守',
      index: 0,
      length: 1 - 0 + 1,
      spaceAfter: ''
    },
    {
      type: 'western-letter',
      value: 'JavaScript',
      index: 2,
      length: 11 - 2 + 1,
      spaceAfter: ''
    },
    {
      type: 'cjk-char',
      value: '编码规范非常重要',
      index: 12,
      length: 19 - 12 + 1,
      spaceAfter: ''
    }
  ]
  test('general travel', () => {
    const { tokens } = parse('遵守JavaScript编码规范非常重要')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records: any[] = []
    travel(tokens, (token, index, tokens) =>
      records.push({ token, index, tokens })
    )
    expect(clone(records)).toEqual([
      {
        token: expectedTokens[0],
        tokens: expectedTokens,
        index: 0
      },
      {
        token: expectedTokens[1],
        tokens: expectedTokens,
        index: 1
      },
      {
        token: expectedTokens[2],
        tokens: expectedTokens,
        index: 2
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
    travel(data.tokens, (token: MutableToken) => {
      token.modifiedValue =
        {
          '(': '（',
          ')': '）'
        }[token.value] || token.value
    })
    expect(join(data.tokens)).toBe(`关注（watch）你关心的仓库。`)
  })
})
