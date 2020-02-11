const lint = require('../src')
const markdownParser = require('../src/parsers/md')

describe('parser with markdown', () => {
  test('single paragraph', () => {
    const text = 'X [xxx](xxx) X *y* __x__ `ss` _0_ ~~asd~~ *asf**asf**adsf*'
    const result = markdownParser(text)
    const marks = [
      { type: 'hyper', meta: 'link', startIndex: 2, startContent: '[', endIndex: 6, endContent: '](xxx)' },
      { type: 'hyper', meta: 'emphasis', startIndex: 15, startContent: '*', endIndex: 17, endContent: '*' },
      { type: 'hyper', meta: 'strong', startIndex: 19, startContent: '__', endIndex: 22, endContent: '__' },
      { type: 'raw', meta: 'inlineCode', startIndex: 25, endIndex: 29, startContent: '`ss`', endContent: '' },
      { type: 'hyper', meta: 'emphasis', startIndex: 30, startContent: '_', endIndex: 32, endContent: '_' },
      { type: 'hyper', meta: 'delete', startIndex: 34, startContent: '~~', endIndex: 39, endContent: '~~' },
      { type: 'hyper', meta: 'emphasis', startIndex: 42, startContent: '*', endIndex: 57, endContent: '*' },
      { type: 'hyper', meta: 'strong', startIndex: 46, startContent: '**', endIndex: 51, endContent: '**' }
    ]
    expect(result.length).toBe(1)
    expect(result[0].value).toBe(text)
    expect(result[0].marks).toEqual(marks)
  })
})

describe('lint', () => {
  test('single paragraph', () => {
    expect(lint('X[ xxx ](xxx)X`hello`world'))
      .toBe('X [xxx](xxx) X `hello` world')
  })
  test('frontmatter', () => {
    expect(lint('---\ntitle: 介绍\ntype: guide\norder: 2\n---\n## Vue 是什么\n'))
      .toBe('---\ntitle: 介绍\ntype: guide\norder: 2\n---\n## Vue 是什么\n')
  })
})
