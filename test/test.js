const lint = require('../src')

const { checkCharType, parse } = lint

const purify = arr => arr.map(item => Array.isArray(item) ? purify(item) : item)

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
    const result = parse('遵守JavaScript编码规范非常重要')
    expect(purify(result.tokens)).toEqual([
      { type: 'content-full', content: '遵守', index: 0, length: 2 },
      { type: 'content-half', content: 'JavaScript', index: 2, length: 10 },
      { type: 'content-full', content: '编码规范非常重要', index: 12, length: 8 }
    ])
    expect(result.marks.length).toBe(0)
    expect(result.groups.length).toBe(0)
  })
  test('关注(watch)你关心的仓库。', () => {
    const result = parse('关注(watch)你关心的仓库。')
    const mark = {
      startChar: `(`,
      startIndex: 2,
      endChar: `)`,
      endIndex: 8,
    }
    expect(result.marks).toEqual([mark])
    expect(purify(result.tokens)).toEqual([
      { type: 'content-full', content: '关注', index: 0, length: 2 },
      { type: 'punctuation-mark', content: '(', index: 2, length: 1, markSide: 'left', mark },
      { type: 'content-half', content: 'watch', index: 3, length: 5 },
      { type: 'punctuation-mark', content: ')', index: 8, length: 1, markSide: 'right', mark },
      { type: 'content-full', content: '你关心的仓库', index: 9, length: 6 },
      { type: 'punctuation-full', content: '。', index: 15, length: 1 }
    ])
  })
  test('如果你有任何问题，请联系@Vuejs_Events！', () => {
    const result = parse('如果你有任何问题，请联系@Vuejs_Events！')
    expect(purify(result.tokens)).toEqual([
      { type: 'content-full', content: '如果你有任何问题', index: 0, length: 8 },
      { type: 'punctuation-full', content: '，', index: 8, length: 1 },
      { type: 'content-full', content: '请联系', index: 9, length: 3 },
      { type: 'content-half', content: '@Vuejs_Events', index: 12, length: 13 },
      { type: 'punctuation-full', content: '！', index: 25, length: 1 }
    ])
  })
  test('每个版本的更新日志见 GitHub 。', () => {
    const result = parse('每个版本的更新日志见 GitHub 。')
    expect(purify(result.tokens)).toEqual([
      { type: 'content-full', content: '每个版本的更新日志见', index: 0, length: 10, spaceAfter: ' ' },
      { type: 'content-half', content: 'GitHub', index: 11, length: 6, spaceAfter: ' ' },
      { type: 'punctuation-full', content: '。', index: 18, length: 1 }
    ])
  })
  test('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) ', () => {
    const result = parse('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) ')
    const mark = {
      startChar: `(`,
      startIndex: 27,
      endChar: `)`,
      endIndex: 45,
    }
    expect(result.marks).toEqual([mark])
    expect(purify(result.tokens)).toEqual([
      { type: 'content-half', content: 'Vue', index: 0, length: 2 - 0 + 1, spaceAfter: ' ' },
      { type: 'content-full', content: '也可以在', index: 4, length: 7 - 4 + 1, spaceAfter: ' ' },
      { type: 'content-half', content: 'unpkg', index: 9, length: 13 - 9 + 1, spaceAfter: ' ' },
      { type: 'content-full', content: '和', index: 15, length: 15 - 15 + 1, spaceAfter: ' ' },
      { type: 'content-half', content: 'cdnjs', index: 17, length: 21 - 17 + 1, spaceAfter: ' ' },
      { type: 'content-full', content: '上获取', index: 23, length: 25 - 23 + 1, spaceAfter: ' ' },
      { type: 'punctuation-mark', content: '(', index: 27, length: 1, markSide: 'left', mark, spaceAfter: ' ' },
      { type: 'content-half', content: 'cdnjs', index: 29, length: 33 - 29 + 1, spaceAfter: ' ' },
      { type: 'content-full', content: '的版本更新可能略滞后', index: 35, length: 44 - 35 + 1 },
      { type: 'punctuation-mark', content: ')', index: 45, length: 1, markSide: 'right', mark, spaceAfter: ' ' },
    ])
  })
  test('对于制作原型或学习,你可以这样使用最新版本:', () => {
    const result = parse('对于制作原型或学习,你可以这样使用最新版本:')
    expect(purify(result.tokens)).toEqual([
      { type: 'content-full', content: '对于制作原型或学习', index: 0, length: 8 - 0 + 1 },
      { type: 'punctuation-half', content: ',', index: 9, length: 9 - 9 + 1 },
      { type: 'content-full', content: '你可以这样使用最新版本', index: 10, length: 20 - 10 + 1 },
      { type: 'punctuation-half', content: ':', index: 21, length: 21 - 21 + 1 }
    ])
  })
  test('该指令的意思是: "将这个元素节点的 title 特性和 Vue 实例的 message 属性保持一致".', () => {
    const result = parse('该指令的意思是: "将这个元素节点的 title 特性和 Vue 实例的 message 属性保持一致".')
    expect(purify(result.tokens)).toEqual([
      { type: 'content-full', content: '该指令的意思是', index: 0, length: 6 - 0 + 1 },
      { type: 'punctuation-half', content: ':', index: 7, length: 8 - 8 + 1, spaceAfter: ' ' },
      [
        { type: 'content-full', content: '将这个元素节点的', index: 10, length: 17 - 10 + 1, spaceAfter: ' ' },
        { type: 'content-half', content: 'title', index: 19, length: 23 - 19 + 1, spaceAfter: ' ' },
        { type: 'content-full', content: '特性和', index: 25, length: 27 - 25 + 1, spaceAfter: ' ' },
        { type: 'content-half', content: 'Vue', index: 29, length: 31 - 29 + 1, spaceAfter: ' ' },
        { type: 'content-full', content: '实例的', index: 33, length: 35 - 33 + 1, spaceAfter: ' ' },
        { type: 'content-half', content: 'message', index: 37, length: 43 - 37 + 1, spaceAfter: ' ' },
        { type: 'content-full', content: '属性保持一致', index: 45, length: 50 - 45 + 1 }
      ],
      { type: 'punctuation-half', content: '.', index: 52, length: 52 - 52 + 1 }
    ])
    expect(result.marks.length).toBe(0)
    expect(result.groups.length).toBe(1)
    expect(result.groups[0].startIndex).toBe(9)
    expect(result.groups[0].startChar).toBe('"')
    expect(result.groups[0].endIndex).toBe(51)
    expect(result.groups[0].endChar).toBe('"')
  })
})
