const lint = require('../src')

const spacePunctuation = require('../src/rules/space-punctuation')
const spaceBrackets = require('../src/rules/space-brackets')
const spaceQuotes = require('../src/rules/space-quotes')
const spaceFullWidthContent = require('../src/rules/space-full-width-content')
const unifyPunctuation = require('../src/rules/unify-punctuation')
const preferencesPunctuation = require('../src/rules/preferences-punctuation')
const caseDatetime = require('../src/rules/case-datetime')
const casePlural = require('../src/rules/case-plural')
const caseShortQuote = require('../src/rules/case-short-quote')

const {
  checkCharType,
  parse,
  travel,
  join,
  processRule
} = lint

const purify = arr => arr.map(item => Array.isArray(item) ? purify(item) : item)

const clone = obj => JSON.parse(JSON.stringify(obj))

const restruct = str => join(parse(str).tokens)

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
    // expect(checkCharType('𢙽')).toBe('content-full')
    expect(checkCharType('中')).toBe('content-full')
    expect(checkCharType('⻍')).toBe('content-full')
  })
  test.skip('emoji', () => {
    expect(checkCharType('😀')).toBe('emoji')
  })
})

describe('parser', () => {
  test('遵守JavaScript编码规范非常重要', () => {
    const { tokens, marks, groups } = parse('遵守JavaScript编码规范非常重要')
    expect(purify(tokens)).toEqual([
      { type: 'content-full', raw: '遵守', content: '遵守', index: 0, length: 2 },
      { type: 'content-half', raw: 'JavaScript', content: 'JavaScript', index: 2, length: 10 },
      { type: 'content-full', raw: '编码规范非常重要', content: '编码规范非常重要', index: 12, length: 8 }
    ])
    expect(marks.length).toBe(0)
    expect(groups.length).toBe(0)
  })
  test('关注(watch)你关心的仓库。', () => {
    const { tokens, marks } = parse('关注(watch)你关心的仓库。')
    const mark = {
      startChar: `(`,
      startIndex: 2,
      endChar: `)`,
      endIndex: 8,
    }
    expect(marks).toEqual([mark])
    expect(purify(tokens)).toEqual([
      { type: 'content-full', raw: '关注', content: '关注', index: 0, length: 2 },
      { type: 'punctuation-mark', raw: '(', content: '(', index: 2, length: 1, markSide: 'left', mark },
      { type: 'content-half', raw: 'watch', content: 'watch', index: 3, length: 5 },
      { type: 'punctuation-mark', raw: ')', content: ')', index: 8, length: 1, markSide: 'right', mark },
      { type: 'content-full', raw: '你关心的仓库', content: '你关心的仓库', index: 9, length: 6 },
      { type: 'punctuation-full', raw: '。', content: '。', index: 15, length: 1 }
    ])
  })
  test('如果你有任何问题，请联系@Vuejs_Events！', () => {
    const { tokens } = parse('如果你有任何问题，请联系@Vuejs_Events！')
    expect(purify(tokens)).toEqual([
      { type: 'content-full', raw: '如果你有任何问题', content: '如果你有任何问题', index: 0, length: 8 },
      { type: 'punctuation-full', raw: '，', content: '，', index: 8, length: 1 },
      { type: 'content-full', raw: '请联系', content: '请联系', index: 9, length: 3 },
      { type: 'content-half', raw: '@Vuejs_Events', content: '@Vuejs_Events', index: 12, length: 13 },
      { type: 'punctuation-full', raw: '！', content: '！', index: 25, length: 1 }
    ])
  })
  test('每个版本的更新日志见 GitHub 。', () => {
    const { tokens } = parse('每个版本的更新日志见 GitHub 。')
    expect(purify(tokens)).toEqual([
      { type: 'content-full', raw: '每个版本的更新日志见', content: '每个版本的更新日志见', index: 0, length: 10, rawSpaceAfter: ' ', spaceAfter: ' ' },
      { type: 'content-half', raw: 'GitHub', content: 'GitHub', index: 11, length: 6, rawSpaceAfter: ' ', spaceAfter: ' ' },
      { type: 'punctuation-full', raw: '。', content: '。', index: 18, length: 1 }
    ])
  })
  test('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) ', () => {
    const { tokens, marks } = parse('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) ')
    const mark = {
      startChar: `(`,
      startIndex: 27,
      endChar: `)`,
      endIndex: 45,
    }
    expect(marks).toEqual([mark])
    expect(purify(tokens)).toEqual([
      { type: 'content-half', raw: 'Vue', content: 'Vue', index: 0, length: 2 - 0 + 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
      { type: 'content-full', raw: '也可以在', content: '也可以在', index: 4, length: 7 - 4 + 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
      { type: 'content-half', raw: 'unpkg', content: 'unpkg', index: 9, length: 13 - 9 + 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
      { type: 'content-full', raw: '和', content: '和', index: 15, length: 15 - 15 + 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
      { type: 'content-half', raw: 'cdnjs', content: 'cdnjs', index: 17, length: 21 - 17 + 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
      { type: 'content-full', raw: '上获取', content: '上获取', index: 23, length: 25 - 23 + 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
      { type: 'punctuation-mark', raw: '(', content: '(', index: 27, length: 1, markSide: 'left', mark, rawSpaceAfter: ' ', spaceAfter: ' ' },
      { type: 'content-half', raw: 'cdnjs', content: 'cdnjs', index: 29, length: 33 - 29 + 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
      { type: 'content-full', raw: '的版本更新可能略滞后', content: '的版本更新可能略滞后', index: 35, length: 44 - 35 + 1 },
      { type: 'punctuation-mark', raw: ')', content: ')', index: 45, length: 1, markSide: 'right', mark, rawSpaceAfter: ' ', spaceAfter: ' ' },
    ])
  })
  test('对于制作原型或学习,你可以这样使用最新版本:', () => {
    const { tokens } = parse('对于制作原型或学习,你可以这样使用最新版本:')
    expect(purify(tokens)).toEqual([
      { type: 'content-full', raw: '对于制作原型或学习', content: '对于制作原型或学习', index: 0, length: 8 - 0 + 1 },
      { type: 'punctuation-half', raw: ',', content: ',', index: 9, length: 9 - 9 + 1 },
      { type: 'content-full', raw: '你可以这样使用最新版本', content: '你可以这样使用最新版本', index: 10, length: 20 - 10 + 1 },
      { type: 'punctuation-half', raw: ':', content: ':', index: 21, length: 21 - 21 + 1 }
    ])
  })
  test('该指令的意思是: "将这个元素节点的 title 特性和 Vue 实例的 message 属性保持一致".', () => {
    const { tokens, marks, groups } = parse('该指令的意思是: " 将这个元素节点的 title 特性和 Vue 实例的 message 属性保持一致".')
    expect(purify(tokens)).toEqual([
      { type: 'content-full', raw: '该指令的意思是', content: '该指令的意思是', index: 0, length: 6 - 0 + 1 },
      { type: 'punctuation-half', raw: ':', content: ':', index: 7, length: 8 - 8 + 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
      [
        { type: 'content-full', raw: '将这个元素节点的', content: '将这个元素节点的', index: 10 + 1, length: 17 - 10 + 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
        { type: 'content-half', raw: 'title', content: 'title', index: 19 + 1, length: 23 - 19 + 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
        { type: 'content-full', raw: '特性和', content: '特性和', index: 25 + 1, length: 27 - 25 + 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
        { type: 'content-half', raw: 'Vue', content: 'Vue', index: 29 + 1, length: 31 - 29 + 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
        { type: 'content-full', raw: '实例的', content: '实例的', index: 33 + 1, length: 35 - 33 + 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
        { type: 'content-half', raw: 'message', content: 'message', index: 37 + 1, length: 43 - 37 + 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
        { type: 'content-full', raw: '属性保持一致', content: '属性保持一致', index: 45 + 1, length: 50 - 45 + 1 }
      ],
      { type: 'punctuation-half', raw: '.', content: '.', index: 52 + 1, length: 52 - 52 + 1 }
    ])
    expect(marks.length).toBe(0)
    expect(groups.length).toBe(1)
    expect(groups[0].startIndex).toBe(9)
    expect(groups[0].startChar).toBe('"')
    expect(groups[0].endIndex).toBe(51 + 1)
    expect(groups[0].endChar).toBe('"')
    expect(groups[0].innerSpaceBefore).toBe(' ')
    expect(groups[0].rawInnerSpaceBefore).toBe(' ')
  })
})

describe('travel', () => {
  const { tokens } = parse('遵守JavaScript编码规范非常重要')
  const expectedTokens = [
    { type: 'content-full', raw: '遵守', content: '遵守', index: 0, length: 1 - 0 + 1 },
    { type: 'content-half', raw: 'JavaScript', content: 'JavaScript', index: 2, length: 11 - 2 + 1 },
    { type: 'content-full', raw: '编码规范非常重要', content: '编码规范非常重要', index: 12, length: 19 - 12 + 1 }
  ]
  test('general travel', () => {
    const records = []
    travel(tokens, () => true, (token, index, tokens, result) => records.push({ token, index, tokens, result }))
    expect(clone(records)).toEqual([
      { token: expectedTokens[0], tokens: expectedTokens, index: 0, result: true },
      { token: expectedTokens[1], tokens: expectedTokens, index: 1, result: true },
      { token: expectedTokens[2], tokens: expectedTokens, index: 2, result: true }
    ])
  })
  test('filter by type', () => {
    const records = []
    travel(tokens, { type: 'content-half' }, (token, index, tokens, result) => records.push({ token, index, tokens, result }))
    expect(clone(records)).toEqual([
      { token: expectedTokens[1], tokens: expectedTokens, index: 1, result: true },
    ])
  })
  test('filter by string match', () => {
    const records = []
    travel(tokens, '规范', (token, index, tokens, result) => records.push({ token, index, tokens, result }))
    expect(clone(records)).toEqual([
      { token: expectedTokens[2], tokens: expectedTokens, index: 2, result: ['规范'] },
    ])
  })
  test('filter by regexp match', () => {
    const records = []
    travel(tokens, /[a-z]{3}/, (token, index, tokens, result) => records.push({ token, index, tokens, result }))
    expect(clone(records)).toEqual([
      { token: expectedTokens[1], tokens: expectedTokens, index: 1, result: ['ava'] },
    ])
  })
  test('filter by function', () => {
    const records = []
    travel(tokens, (token, index, tokens) => index, (token, index, tokens, result) => records.push({ token, index, tokens, result }))
    expect(clone(records)).toEqual([
      { token: expectedTokens[1], tokens: expectedTokens, index: 1, result: 1 },
      { token: expectedTokens[2], tokens: expectedTokens, index: 2, result: 2 }
    ])
  })
})

describe('join', () => {
  test('parse and join then return the same', () => {
    expect(restruct('遵守JavaScript编码规范非常重要'))
      .toBe(`遵守JavaScript编码规范非常重要`)
    expect(restruct(`关注(watch)你关心的仓库。`))
      .toBe(`关注(watch)你关心的仓库。`)
    expect(restruct(`Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) `))
      .toBe(`Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) `)
    expect(restruct(`该指令的意思是: "将这个元素节点的 title 特性和 Vue 实例的 message 属性保持一致"`))
      .toBe(`该指令的意思是: "将这个元素节点的 title 特性和 Vue 实例的 message 属性保持一致"`)
  })
})

describe('process rules', () => {
  test('replace half-width brackets into full-width', () => {
    const data = parse(`关注(watch)你关心的仓库。`)
    processRule(
      data,
      {
        filter: { type: 'punctuation-mark' },
        handler: (token, index, group, matched, marks) => {
          token.content = {
            '(': '（',
            ')': '）',
          }[token.content] || token.content
        }
      }
    )
    expect(join(data.tokens)).toBe(`关注（watch）你关心的仓库。`)
  })
})

describe('lint', () => {
  test('space between half-width content and full-width content', () => {
    expect(lint('汉字和English之间需要有空格比如 half width content。'))
      .toBe('汉字和 English 之间需要有空格比如 half width content。')
  })
  test('space beside brackets', () => {
    expect(lint('汉字和Eng(lish之间)需要有空格比如 half width content。'))
      .toBe('汉字和 Eng(lish 之间) 需要有空格比如 half width content。')
    expect(lint('汉字和Eng（lish之间）需要有空格比如 half width content。'))
      .toBe('汉字和 Eng（lish 之间）需要有空格比如 half width content。')
    expect(lint('汉 (字 ) 和Eng（lish之间）需（ 要）有(空格)比如 half w(i)dth content。'))
      .toBe('汉 (字) 和 Eng（lish 之间）需（要）有 (空格) 比如 half w(i)dth content。')
  })
  test('unifies full-width/half-width mixed punctuation usage', () => {
    const rules = [spaceFullWidthContent, unifyPunctuation]
    expect(lint('汉字和English之间需要有空格比如 half width content.', rules))
      .toBe('汉字和 English 之间需要有空格比如 half width content。')
    expect(lint('汉字和"English"之间需要有空格比如 half width content.', rules))
      .toBe('汉字和“English”之间需要有空格比如 half width content。')
    expect(lint('汉字和English之间需要:有；空格比如 half width content.', rules))
      .toBe('汉字和 English 之间需要：有；空格比如 half width content。')
  })
  test('space beside punctuations', () => {
    expect(lint('汉字和Engl,is。h之间,需，要有, 空， 格 ，比 , 如 half width content.', [spacePunctuation]))
      .toBe('汉字和Engl,is。h之间, 需，要有, 空，格，比, 如 half width content.')
  })
})
