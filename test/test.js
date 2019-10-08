const lint = require('../src')

describe('check char type', () => {
  test('space', () => {
    expect(lint.checkCharType(' ')).toBe('space')
  })
  test('digit', () => {
    expect(lint.checkCharType('0')).toBe('digit')
  })
  test('latin punctuation', () => {
    expect(lint.checkCharType(',')).toBe('latin-punctuation')
    expect(lint.checkCharType('-')).toBe('latin-punctuation')
    expect(lint.checkCharType('"')).toBe('latin-punctuation')
  })
  test('cjk punctuation', () => {
    expect(lint.checkCharType('，')).toBe('cjk-punctuation')
    expect(lint.checkCharType('。')).toBe('cjk-punctuation')
    expect(lint.checkCharType('”')).toBe('cjk-punctuation')
  })
  test('latin', () => {
    expect(lint.checkCharType('a')).toBe('latin')
    expect(lint.checkCharType('C')).toBe('latin')
    expect(lint.checkCharType('Ô')).toBe('latin')
    expect(lint.checkCharType('Ś')).toBe('latin')
    expect(lint.checkCharType('Ʒ')).toBe('latin')
  })
  test('greek', () => {
    expect(lint.checkCharType('α')).toBe('greek')
  })
  test('cjk', () => {
    expect(lint.checkCharType('中')).toBe('cjk')
    expect(lint.checkCharType('五')).toBe('cjk')
    expect(lint.checkCharType('䔷')).toBe('cjk')
    expect(lint.checkCharType('𢙺')).toBe('cjk')
    // expect(lint.checkCharType('𢙽')).toBe('cjk')
    expect(lint.checkCharType('中')).toBe('cjk')
    expect(lint.checkCharType('⻍')).toBe('cjk')
  })
  test.skip('emoji', () => {
    expect(lint.checkCharType('😀')).toBe('emoji')
  })
})

describe('parser', () => {
  const purify = result => result.map(x => {
    if (Array.isArray(x)) {
      return purify(x)
    }
    return x
  })

  test('遵守JavaScript编码规范非常重要', () => {
    const result = lint.parse('遵守JavaScript编码规范非常重要')
    expect(purify(result)).toEqual([
      { type: 'cjk',   content: '遵守', start: 0, end: 1 },
      { type: 'latin', content: 'JavaScript', start: 2, end: 11 },
      { type: 'cjk',   content: '编码规范非常重要', start: 12, end: 19 }
    ])
    expect(result.left).toBe('')
    expect(result.right).toBe('')
  })
  test('关注(watch)你关心的仓库。', () => {
    const result = lint.parse('关注(watch)你关心的仓库。')
    expect(purify(result)).toEqual([
      { type: 'cjk', content: '关注', start: 0, end: 1 },
      [ { type: 'latin', content: 'watch', start: 3, end: 7 } ],
      { type: 'cjk', content: '你关心的仓库', start: 9, end: 14 },
      { type: 'cjk-punctuation', content: '。', start: 15, end: 15 }
    ])
    expect(result.left).toBe('')
    expect(result.right).toBe('')
    expect(result[1].left).toBe('(')
    expect(result[1].right).toBe(')')
  })
  test('如果你有任何问题，请联系@Vuejs_Events！', () => {
    const result = lint.parse('如果你有任何问题，请联系@Vuejs_Events！')
    expect(purify(result)).toEqual([
      { type: 'cjk',   content: '如果你有任何问题', start: 0, end: 7 },
      { type: 'cjk-punctuation', content: '，', start: 8, end: 8 },
      { type: 'cjk',   content: '请联系', start: 9, end: 11 },
      { type: 'latin', content: '@Vuejs_Events', start: 12, end: 24 },
      { type: 'cjk-punctuation', content: '！', start: 25, end: 25 }
    ])
    expect(result.left).toBe('')
    expect(result.right).toBe('')
  })
  test('每个版本的更新日志见 GitHub 。', () => {
    const result = lint.parse('每个版本的更新日志见 GitHub 。')
    expect(purify(result)).toEqual([
      { type: 'cjk',   content: '每个版本的更新日志见', start: 0, end: 9 },
      { type: 'latin', content: 'GitHub', start: 11, end: 16 },
      { type: 'cjk-punctuation', content: '。', start: 18, end: 18 }
    ])
    expect(result.left).toBe('')
    expect(result.right).toBe('')
  })
  test('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) ', () => {
    const result = lint.parse('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) ')
    expect(purify(result)).toEqual([
      { type: 'latin', content: 'Vue', start: 0, end: 2 },
      { type: 'cjk',   content: '也可以在', start: 4, end: 7 },
      { type: 'latin', content: 'unpkg', start: 9, end: 13 },
      { type: 'cjk',   content: '和', start: 15, end: 15 },
      { type: 'latin', content: 'cdnjs', start: 17, end: 21 },
      { type: 'cjk',   content: '上获取', start: 23, end: 25 },
      [
        { type: 'latin', content: 'cdnjs', start: 29, end: 33 },
        { type: 'cjk',   content: '的版本更新可能略滞后', start: 35, end: 44 }
      ]
    ])
    expect(result.left).toBe('')
    expect(result.right).toBe('')
    expect(result[6].left).toBe('(')
    expect(result[6].right).toBe(')')
  })
  test('对于制作原型或学习,你可以这样使用最新版本:', () => {
    const result = lint.parse('对于制作原型或学习,你可以这样使用最新版本:')
    expect(purify(result)).toEqual([
      { type: 'cjk', content: '对于制作原型或学习', start: 0, end: 8 },
      { type: 'latin-punctuation', content: ',', start: 9, end: 9 },
      { type: 'cjk', content: '你可以这样使用最新版本', start: 10, end: 20 },
      { type: 'latin-punctuation', content: ':', start: 21, end: 21 }
    ])
    expect(result.left).toBe('')
    expect(result.right).toBe('')
  })
  test('该指令的意思是: "将这个元素节点的 title 特性和 Vue 实例的 message 属性保持一致".', () => {
    const result = lint.parse('该指令的意思是: "将这个元素节点的 title 特性和 Vue 实例的 message 属性保持一致".')
    expect(purify(result)).toEqual([
      { type: 'cjk', content: '该指令的意思是', start: 0, end: 6 },
      { type: 'latin-punctuation', content: ': ', start: 7, end: 8 },
      [
        { type: 'cjk',   content: '将这个元素节点的', start: 10, end: 17 },
        { type: 'latin', content: 'title', start: 19, end: 23 },
        { type: 'cjk',   content: '特性和', start: 25, end: 27 },
        { type: 'latin', content: 'Vue', start: 29, end: 31 },
        { type: 'cjk',   content: '实例的', start: 33, end: 35 },
        { type: 'latin', content: 'message', start: 37, end: 43 },
        { type: 'cjk',   content: '属性保持一致', start: 45, end: 50 }
      ],
      { type: 'latin-punctuation', content: '.', start: 52, end: 52 }
    ])
    expect(result.left).toBe('')
    expect(result.right).toBe('')
    expect(result[2].left).toBe('"')
    expect(result[2].right).toBe('"')
  })
})

describe('travel', () => {
  const purify = result => JSON.parse(JSON.stringify(result))

  test('general travel', () => {
    const records = []
    const tokens = lint.parse('遵守JavaScript编码规范非常重要')
    lint.travel(tokens, () => true, (token, index, tokens, result) => records.push({ token, index, tokens, result }))
    const expectedTokens = [
      { type: 'cjk', content: '遵守', start: 0, end: 1 },
      { type: 'latin', content: 'JavaScript', start: 2, end: 11 },
      { type: 'cjk', content: '编码规范非常重要', start: 12, end: 19 }
    ]
    expect(purify(records)).toEqual([
      { token: expectedTokens[0], tokens: expectedTokens, index: 0, result: true },
      { token: expectedTokens[1], tokens: expectedTokens, index: 1, result: true },
      { token: expectedTokens[2], tokens: expectedTokens, index: 2, result: true }
    ])
  })
  test('filter by type', () => {
    const records = []
    const tokens = lint.parse('遵守JavaScript编码规范非常重要')
    lint.travel(tokens, { type: 'latin' }, (token, index, tokens, result) => records.push({ token, index, tokens, result }))
    const expectedTokens = [
      { type: 'cjk', content: '遵守', start: 0, end: 1 },
      { type: 'latin', content: 'JavaScript', start: 2, end: 11 },
      { type: 'cjk', content: '编码规范非常重要', start: 12, end: 19 }
    ]
    expect(purify(records)).toEqual([
      { token: expectedTokens[1], tokens: expectedTokens, index: 1, result: true },
    ])
  })
  test('filter by string match', () => {
    const records = []
    const tokens = lint.parse('遵守JavaScript编码规范非常重要')
    lint.travel(tokens, '规范', (token, index, tokens, result) => records.push({ token, index, tokens, result }))
    const expectedTokens = [
      { type: 'cjk', content: '遵守', start: 0, end: 1 },
      { type: 'latin', content: 'JavaScript', start: 2, end: 11 },
      { type: 'cjk', content: '编码规范非常重要', start: 12, end: 19 }
    ]
    expect(purify(records)).toEqual([
      { token: expectedTokens[2], tokens: expectedTokens, index: 2, result: ['规范'] },
    ])
  })
  test('filter by regexp match', () => {
    const records = []
    const tokens = lint.parse('遵守JavaScript编码规范非常重要')
    lint.travel(tokens, /[a-z]{3}/, (token, index, tokens, result) => records.push({ token, index, tokens, result }))
    const expectedTokens = [
      { type: 'cjk', content: '遵守', start: 0, end: 1 },
      { type: 'latin', content: 'JavaScript', start: 2, end: 11 },
      { type: 'cjk', content: '编码规范非常重要', start: 12, end: 19 }
    ]
    expect(purify(records)).toEqual([
      { token: expectedTokens[1], tokens: expectedTokens, index: 1, result: ['ava'] },
    ])
  })
  test('filter by function', () => {
    const records = []
    const tokens = lint.parse('遵守JavaScript编码规范非常重要')
    lint.travel(tokens, (token, index, tokens) => index, (token, index, tokens, result) => records.push({ token, index, tokens, result }))
    const expectedTokens = [
      { type: 'cjk', content: '遵守', start: 0, end: 1 },
      { type: 'latin', content: 'JavaScript', start: 2, end: 11 },
      { type: 'cjk', content: '编码规范非常重要', start: 12, end: 19 }
    ]
    expect(purify(records)).toEqual([
      { token: expectedTokens[1], tokens: expectedTokens, index: 1, result: 1 },
      { token: expectedTokens[2], tokens: expectedTokens, index: 2, result: 2 }
    ])
  })
})

describe('plain text', () => {
  // token types
  // - cjk
  // - latin
  // - cjk-punc
  // - latin-punc
  // - group

  // - [ ] cjk-cjk: keep
  // - [x] cjk-latin: spaceBetweenLatinAndCjk
  // - [x] cjk->group: spaceBesideBrackets
  // - [x] cjk->cjk-punc: spaceBesidePunctuation
  // - [x] cjk->latin-punc: spaceBesidePunctuation

  // - [ ] latin-latin: keep
  // - [x] latin->cjk: spaceBetweenLatinAndCjk
  // - [x] latin->group: spaceBesideBrackets
  // - [x] latin->cjk-punc: spaceBesidePunctuation
  // - [x] latin->latin-punc: spaceBesidePunctuation

  // - [ ] cjk-punc-cjk-punc: keep
  // - [x] cjk-punc->cjk: spaceBesidePunctuation
  // - [x] cjk-punc-latin: spaceBesidePunctuation
  // - [ ] cjk-punc->latin-punc: keep
  // - [ ] cjk-punc->group: spaceBesideBrackets

  // - [ ] latin-punc-latin-punc: keep
  // - [x] latin-punc->cjk: spaceBesidePunctuation
  // - [x] latin-punc-latin: spaceBesidePunctuation
  // - [ ] latin-punc->cjk-punc: keep
  // - [ ] latin-punc->group: spaceBesideBrackets

  // - [ ] group->group: spaceBesideBrackets
  // - [x] group->latin: spaceBesideBrackets
  // - [x] group->cjk: spaceBesideBrackets
  // - [ ] group->latin-punc: spaceBesideBrackets
  // - [ ] group->cjk-punc: spaceBesideBrackets

  test('space bewteen latin and cjk chars', () => {
    expect(lint('遵守JavaScript 编码规范非常重要'))
      .toBe('遵守JavaScript 编码规范非常重要')
    expect(lint('遵守JavaScript 编码规范非常重要', {}))
      .toBe('遵守JavaScript 编码规范非常重要')
    expect(lint('遵守JavaScript 编码规范非常重要', { spaceBetweenLatinAndCjk: 'keep' }))
      .toBe('遵守JavaScript 编码规范非常重要')
    expect(lint('遵守JavaScript编码规范非常重要', { spaceBetweenLatinAndCjk: true }))
      .toBe('遵守 JavaScript 编码规范非常重要')
    expect(lint('遵守JavaScript编码规范非常重要', { spaceBetweenLatinAndCjk: false }))
      .toBe('遵守JavaScript编码规范非常重要')

    expect(lint('关注(watch) 你关心的仓库。', { spaceBetweenLatinAndCjk: true }))
      .toBe('关注(watch) 你关心的仓库。')
    expect(lint('关注(watch) 你关心的仓库。', { spaceBetweenLatinAndCjk: false }))
      .toBe('关注(watch) 你关心的仓库。')
    expect(lint('关注(watch) 你关心的仓库。', { spaceBetweenLatinAndCjk: 'keep' }))
      .toBe('关注(watch) 你关心的仓库。')

    expect(lint('如果你有任何问题，请联系@Vuejs_Events！', { spaceBetweenLatinAndCjk: true }))
      .toBe('如果你有任何问题，请联系 @Vuejs_Events！')
    expect(lint('每个版本的更新日志见 GitHub 。', { spaceBetweenLatinAndCjk: true }))
      .toBe('每个版本的更新日志见 GitHub 。')
    expect(lint('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) ', { spaceBetweenLatinAndCjk: true }))
      .toBe('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后)')
   })

  test('space beside groups', () => {
    expect(lint('关注(watch) 你关心的仓库。'))
      .toBe('关注(watch) 你关心的仓库。')
    expect(lint('关注(watch) 你关心的仓库。', {}))
      .toBe('关注(watch) 你关心的仓库。')
    expect(lint('关注(watch) 你关心的仓库。', { spaceBesideBrackets: 'inside' }))
      .toBe('关注( watch )你关心的仓库。')
    expect(lint('关注(watch) 你关心的仓库。', { spaceBesideBrackets: 'outside' }))
      .toBe('关注 (watch) 你关心的仓库。')
    expect(lint('关注(watch) 你关心的仓库。', { spaceBesideBrackets: 'both' }))
      .toBe('关注 ( watch ) 你关心的仓库。')
    expect(lint('关注(watch) 你关心的仓库。', { spaceBesideBrackets: false }))
      .toBe('关注(watch)你关心的仓库。')
    expect(lint('关注(watch) 你关心的仓库。', { spaceBesideBrackets: 'keep' }))
      .toBe('关注(watch) 你关心的仓库。')

    expect(lint('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) ', { spaceBesideBrackets: 'inside' }))
      .toBe('Vue 也可以在 unpkg 和 cdnjs 上获取( cdnjs 的版本更新可能略滞后 )')
    expect(lint('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) ', { spaceBesideBrackets: 'outside' }))
      .toBe('Vue 也可以在 unpkg 和 cdnjs 上获取 (cdnjs 的版本更新可能略滞后)')
    expect(lint('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) ', { spaceBesideBrackets: 'both' }))
      .toBe('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后 )')
    expect(lint('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) ', { spaceBesideBrackets: false }))
      .toBe('Vue 也可以在 unpkg 和 cdnjs 上获取(cdnjs 的版本更新可能略滞后)')
    expect(lint('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) ', { spaceBesideBrackets: 'keep' }))
      .toBe('Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后)')
   })
    
  test('space beside punctuations', () => {
    expect(lint('Hello,如果你有任何问题，请联系@Vuejs_Events！'))
      .toBe('Hello,如果你有任何问题，请联系@Vuejs_Events！')
    expect(lint('Hello,如果你有任何问题，请联系@Vuejs_Events！', {}))
      .toBe('Hello,如果你有任何问题，请联系@Vuejs_Events！')
    expect(lint('Hello,如果你有任何问题，请联系@Vuejs_Events！', { spaceBesidePunctuation: false }))
      .toBe('Hello,如果你有任何问题，请联系@Vuejs_Events！')
    expect(lint('Hello , 如果你有任何问题 ， 请联系@Vuejs_Events！', { spaceBesidePunctuation: false }))
      .toBe('Hello,如果你有任何问题，请联系@Vuejs_Events！')
    expect(lint('Hello,如果你有任何问题，请联系@Vuejs_Events ！', { spaceBesidePunctuation: 'right' }))
      .toBe('Hello, 如果你有任何问题， 请联系@Vuejs_Events！')
    expect(lint('Hello , 如果你有任何问题 ， 请联系@Vuejs_Events ！', { spaceBesidePunctuation: 'right' }))
      .toBe('Hello, 如果你有任何问题， 请联系@Vuejs_Events！')
    expect(lint('Hello,如果你有任何问题，请联系@Vuejs_Events！', { spaceBesidePunctuation: 'right-for-latin' }))
      .toBe('Hello, 如果你有任何问题，请联系@Vuejs_Events！')
    expect(lint('Hello , 如果你有任何问题 ， 请联系@Vuejs_Events ！', { spaceBesidePunctuation: 'right-for-latin' }))
      .toBe('Hello, 如果你有任何问题，请联系@Vuejs_Events！')
    expect(lint('Hello,如果你有任何问题，请联系@Vuejs_Events！', { spaceBesidePunctuation: 'keep' }))
      .toBe('Hello,如果你有任何问题，请联系@Vuejs_Events！')
    expect(lint('Hello , 如果你有任何问题 ， 请联系@Vuejs_Events ！', { spaceBesidePunctuation: 'keep' }))
      .toBe('Hello , 如果你有任何问题 ， 请联系@Vuejs_Events ！')
  })

  test('half-width/full-width punctuations', () => {
    expect(lint('Hello,如果你有任何问题，请联系@Vuejs_Events！'))
      .toBe('Hello,如果你有任何问题，请联系@Vuejs_Events！')
    expect(lint('Hello,如果你有任何问题，请联系@Vuejs_Events！', {}))
      .toBe('Hello,如果你有任何问题，请联系@Vuejs_Events！')
    expect(lint('Hello,如果你有任何问题，请联系@Vuejs_Events！', { punctuationWidth: 'half' }))
      .toBe('Hello,如果你有任何问题,请联系@Vuejs_Events!')
    expect(lint('Hello,如果你有任何问题，请联系@Vuejs_Events！', { punctuationWidth: 'half', spaceBesidePunctuation: 'right' }))
      .toBe('Hello, 如果你有任何问题, 请联系@Vuejs_Events!')
    expect(lint('Hello,如果你有任何问题，请联系@Vuejs_Events！', { punctuationWidth: 'full', spaceBesidePunctuation: 'right-for-latin' }))
      .toBe('Hello，如果你有任何问题，请联系@Vuejs_Events！')
    expect(lint('Hello,如果你有任何问题，请联系@Vuejs_Events！', { punctuationWidth: 'keep' }))
      .toBe('Hello,如果你有任何问题，请联系@Vuejs_Events！')
  })

  test('half-width/full-width brackets', () => {
    expect(lint('关注(watch) 你关心的仓库。'))
      .toBe('关注(watch) 你关心的仓库。')
    expect(lint('关注(watch) 你关心的仓库。', {}))
      .toBe('关注(watch) 你关心的仓库。')
    expect(lint('关注(watch) 你关心的仓库。', { bracketsWidth: 'half' }))
      .toBe('关注(watch) 你关心的仓库。')
    expect(lint('关注（watch） 你关心的仓库。', { bracketsWidth: 'half' }))
      .toBe('关注(watch) 你关心的仓库。')
    expect(lint('关注(watch) 你关心的仓库。', { bracketsWidth: 'full' }))
      .toBe('关注（watch） 你关心的仓库。')
    expect(lint('关注（watch） 你关心的仓库。', { bracketsWidth: 'full' }))
      .toBe('关注（watch） 你关心的仓库。')
    expect(lint('关注(watch) 你关心的仓库。', { bracketsWidth: 'keep' }))
      .toBe('关注(watch) 你关心的仓库。')
  })

  test('half-width/full-width quotes', () => {
    expect(lint('关注"watch" 你关心的仓库。'))
      .toBe('关注"watch" 你关心的仓库。')
    expect(lint('关注"watch" 你关心的仓库。', {}))
      .toBe('关注"watch" 你关心的仓库。')
    expect(lint('关注“watch” 你关心的仓库。', { quotesWidth: 'half' }))
      .toBe('关注"watch" 你关心的仓库。')
    expect(lint('关注"watch" 你关心的仓库。', { quotesWidth: 'half' }))
      .toBe('关注"watch" 你关心的仓库。')
    expect(lint('关注"watch" 你关心的仓库。', { quotesWidth: 'full' }))
      .toBe('关注“watch” 你关心的仓库。')
    expect(lint('关注“watch” 你关心的仓库。', { quotesWidth: 'full' }))
      .toBe('关注“watch” 你关心的仓库。')
    expect(lint('关注"watch" 你关心的仓库。', { quotesWidth: 'keep' }))
      .toBe('关注"watch" 你关心的仓库。')
  })

  test.only('punctuations replacement', () => {
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
        { linted: /(\d+) 年 (\d+) 月 (\d+) ([日号])/g, output: '$1年$2月$3$4' },
        { linted: /(\d+)\- (\d+)\- (\d+)/g, output: '$1-$2-$3' },
        { linted: /(\d+)\: (\d+)/g, output: '$1:$2' },
        { linted: /([a-z]) \(s\) /g, output: '$1(s) ' },
        { linted: /(\S)\+(\s)/g, output: '$1 +$2' },
        { linted: /(\S)\=(\s)/g, output: '$1 =$2' }
      ]
    })).toBe('2019年06月26号 2019-06-26 12:00 3 minite(s) left. 1 + 1 = 2')
  })
})

describe.skip('markdown', () => {
  // todo
})

describe.skip('html', () => {
  // todo
})
