const lint = require('../src')

const markHyper = require('../src/rules/mark-hyper')
const spacePunctuation = require('../src/rules/space-punctuation')
const spaceBrackets = require('../src/rules/space-brackets')
const spaceQuotes = require('../src/rules/space-quotes')
const spaceFullWidthContent = require('../src/rules/space-full-width-content')
const unifyPunctuation = require('../src/rules/unify-punctuation')
const caseTraditional = require('../src/rules/case-traditional')
const caseDatetime = require('../src/rules/case-datetime')
const casePlural = require('../src/rules/case-plural')
const caseShortQuote = require('../src/rules/case-short-quote')

const markdownParser = require('../src/parsers/md')

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
      type: 'brackets',
      startChar: `(`,
      startIndex: 2,
      endChar: `)`,
      endIndex: 8,
    }
    expect(marks).toEqual([mark])
    expect(purify(tokens)).toEqual([
      { type: 'content-full', raw: '关注', content: '关注', index: 0, length: 2 },
      { type: 'mark-brackets', raw: '(', content: '(', index: 2, length: 1, markSide: 'left', mark },
      { type: 'content-half', raw: 'watch', content: 'watch', index: 3, length: 5 },
      { type: 'mark-brackets', raw: ')', content: ')', index: 8, length: 1, markSide: 'right', mark },
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
      type: 'brackets',
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
      { type: 'mark-brackets', raw: '(', content: '(', index: 27, length: 1, markSide: 'left', mark, rawSpaceAfter: ' ', spaceAfter: ' ' },
      { type: 'content-half', raw: 'cdnjs', content: 'cdnjs', index: 29, length: 33 - 29 + 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
      { type: 'content-full', raw: '的版本更新可能略滞后', content: '的版本更新可能略滞后', index: 35, length: 44 - 35 + 1 },
      { type: 'mark-brackets', raw: ')', content: ')', index: 45, length: 1, markSide: 'right', mark, rawSpaceAfter: ' ', spaceAfter: ' ' },
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

describe('parser with hyper marks', () => {
  test('X [xxx](xxx) X', () => {
    const hyperMark = { startIndex: 2, startChar: '[', endIndex: 6, endChar: '](xxx)', type: 'md' }
    const { tokens, marks, groups } = parse('X [xxx](xxx) X', [hyperMark])
    expect(purify(tokens)).toEqual([
      { type: 'content-half', raw: 'X', content: 'X', index: 0, length: 1, rawSpaceAfter: ' ', spaceAfter: ' ' },
      { type: 'mark-md', raw: '[', content: '[', index: 2, length: 1, markSide: 'left', mark: hyperMark },
      { type: 'content-half', raw: 'xxx', content: 'xxx', index: 3, length: 3 },
      { type: 'mark-md', raw: '](xxx)', content: '](xxx)', index: 6, length: 6, markSide: 'right', mark: hyperMark, rawSpaceAfter: ' ', spaceAfter: ' ' },
      { type: 'content-half', raw: 'X', content: 'X', index: 13, length: 1 }
    ])
    expect(marks).toEqual([hyperMark])
    expect(groups.length).toBe(0)
  })
  test('`v-bind:style` 的对象语法', () => {
    const hyperMark = { startIndex: 0, startChar: '`', endIndex: 13, endChar: '`', type: 'raw' }
    const { tokens, marks, groups } = parse('`v-bind:style` 的对象语法', [hyperMark])
    expect(purify(tokens)).toEqual([
      { type: 'mark-raw', raw: '`', content: '`', index: 0, length: 1, markSide: 'left', mark: hyperMark },
      { type: 'content-hyper', raw: 'v-bind:style', content: 'v-bind:style', index: 1, length: 12 },
      { type: 'mark-raw', raw: '`', content: '`', index: 13, length: 1, markSide: 'right', mark: hyperMark, rawSpaceAfter: ' ', spaceAfter: ' ' },
      { type: 'content-full', raw: '的对象语法', content: '的对象语法', index: 15, length: 5 }
    ])
    expect(marks).toEqual([hyperMark])
    expect(groups.length).toBe(0)
  })
})

describe('parser with markdown', () => {
  test('single paragraph', () => {
    const text = 'X [xxx](xxx) X *y* __x__ `ss` _0_ ~~asd~~ *asf**asf**adsf*'
    const result = markdownParser(text)
    const marks = [
      { type: 'hyper', meta: 'link', startIndex: 2, startChar: '[', endIndex: 6, endChar: '](xxx)' },
      { type: 'hyper', meta: 'emphasis', startIndex: 15, startChar: '*', endIndex: 17, endChar: '*' },
      { type: 'hyper', meta: 'strong', startIndex: 19, startChar: '__', endIndex: 22, endChar: '__' },
      { type: 'raw', meta: 'inlineCode', startIndex: 25, endIndex: 29, startChar: '`ss`', endChar: '' },
      { type: 'hyper', meta: 'emphasis', startIndex: 30, startChar: '_', endIndex: 32, endChar: '_' },
      { type: 'hyper', meta: 'delete', startIndex: 34, startChar: '~~', endIndex: 39, endChar: '~~' },
      { type: 'hyper', meta: 'emphasis', startIndex: 42, startChar: '*', endIndex: 57, endChar: '*' },
      { type: 'hyper', meta: 'strong', startIndex: 46, startChar: '**', endIndex: 51, endChar: '**' }
    ]
    expect(result.length).toBe(1)
    expect(result[0].value).toBe(text)
    expect(result[0].marks).toEqual(marks)
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
        filter: { type: 'mark-brackets' },
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
  test('space beside quotes', () => {
    expect(lint(`汉"字'和'English之间"需“要‘有’空”格比如 h'a'lf "width" content.`, [spaceQuotes]))
      .toBe(`汉 "字 '和' English之间" 需“要‘有’空”格比如 h 'a' lf "width" content.`)
  })
  test('traditional characters', () => {
    expect(lint(`老師說：「你們要記住國父說的『青年要立志做大事，不要做大官』這句話。」`, [caseTraditional]))
      .toBe(`老師說：“你們要記住國父說的‘青年要立志做大事，不要做大官’這句話。”`)
    expect(lint(`孔子曰：「求，周任有言曰：『陳力就列，不能則止。』危而不持，顛而不扶，則將焉用彼相矣？」`, [caseTraditional]))
      .toBe(`孔子曰：“求，周任有言曰：‘陳力就列，不能則止。’危而不持，顛而不扶，則將焉用彼相矣？”`)
    expect(lint(`我們雖不敢希望每個人能有范文正公「先天下之憂而憂，後天下之樂而樂」的大志向，但至少要有陶侃勤懇不懈的精神`, [caseTraditional]))
      .toBe(`我們雖不敢希望每個人能有范文正公“先天下之憂而憂，後天下之樂而樂”的大志向，但至少要有陶侃勤懇不懈的精神`)
    expect(lint(`所謂忠恕，也就是「盡己之心，推己及人」的意思。`, [caseTraditional]))
      .toBe(`所謂忠恕，也就是“盡己之心，推己及人”的意思。`)
  })
  test('hyper marks', () => {
    expect(lint('X [xxx](xxx) X')).toBe('X [xxx](xxx) X')
  })
  test.skip('special cases', () => {
    const replaceCharMap = {
      '《': '『',
      '〈': '「',
      '〉': '」',
      '》': '』',
    }
    expect(lint('关注《watch》你关心的仓库。', { replaceCharMap }))
      .toBe('关注『watch』你关心的仓库。')
    expect(lint('关注〈watch〉你关心的仓库。', { replaceCharMap }))
      .toBe('关注「watch」你关心的仓库。')

    expect(lint('2019年06月26号 2019-06-26 12:00 3 minite(s) left. 1+1=2', {
      spaceBetweenLatinAndCjk: true,
      spaceBesideBrackets: 'outside',
      spaceBesidePunctuation: 'right-for-latin',
      replace: [
        { input: /(\d+) 年 (\d+) 月 (\d+) ([日号])/g, output: '$1年$2月$3$4' },
        { input: /(\d+)\- (\d+)\- (\d+)/g, output: '$1-$2-$3' },
        { input: /(\d+)\: (\d+)/g, output: '$1:$2' },
        { input: /([a-z]) \(s\) /g, output: '$1(s) ' },
        { input: /(\S)\+(\s)/g, output: '$1 +$2' },
        { input: /(\S)\=(\s)/g, output: '$1 =$2' }
      ]
    })).toBe('2019年06月26号 2019-06-26 12:00 3 minite(s) left. 1 + 1 = 2')
  })
})
