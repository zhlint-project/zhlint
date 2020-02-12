const lint = require('../src')
const markdownParser = require('../src/parsers/md')

test.todo = test.skip

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
  test('dots in URL', () => {
    // ## Vue。js 是什么
    expect(lint('## Vue.js 是什么'))
      .toBe('## Vue.js 是什么')
  })
  test('dots in URL 2', () => {
    // www。vuejs。org
    expect(lint('www.vuejs.org'))
      .toBe('www.vuejs.org')
  })
  test('dots in URL 3', () => {
    // freeze
    expect(lint('https://vuejs.org'))
      .toBe('https://vuejs.org')
  })
  test('slash character', () => {
    expect(lint('想知道 Vue 与其它库/框架有哪些区别'))
      .toBe('想知道 Vue 与其它库/框架有哪些区别')
  })
  test('special characters', () => {
    // Vue (读音 /vju/，类似于 **view**)
    expect(lint('Vue (读音 /vjuː/，类似于 **view**)'))
      .toBe('Vue (读音 /vjuː/，类似于 **view**)')
  })
  test('space between raw content', () => {
    // 我们 <a id="modal-player" href="#"> 制作了一个视频 </a>
    expect(lint('我们<a id="modal-player" href="#">制作了一个视频</a>'))
      .toBe('我们<a id="modal-player" href="#">制作了一个视频</a>')
  })
  test.todo('space between raw content 2', () => {
    // 我们 <a id="modal-player" href="#"> 制作了一个视频 </a>
    expect(lint('Hello<a id="modal-player" href="#">制作了一个视频</a>World'))
      .toBe('Hello <a id="modal-player" href="#">制作了一个视频</a> World')
  })
  test.todo('space between raw content 3', () => {
    // 或者你也可以 <a href="https://gist.githubusercontent.com/chrisvfritz/7f8d7d63000b48493c336e48b3db3e52/raw/ed60c4e5d5c6fec48b0921edaed0cb60be30e87c/index.html" target="_blank" download="index.html" rel="noopener noreferrer"> 创建一个 <code>。 html </code> 文件 <a/>
    expect(lint('或者你也可以<a href="https://gist.githubusercontent.com/chrisvfritz/7f8d7d63000b48493c336e48b3db3e52/raw/ed60c4e5d5c6fec48b0921edaed0cb60be30e87c/index.html" target="_blank" download="index.html" rel="noopener noreferrer">创建一个 <code>.html</code> 文件<a/>'))
      .toBe('或者你也可以<a href="https://gist.githubusercontent.com/chrisvfritz/7f8d7d63000b48493c336e48b3db3e52/raw/ed60c4e5d5c6fec48b0921edaed0cb60be30e87c/index.html" target="_blank" download="index.html" rel="noopener noreferrer">创建一个 <code>.html</code> 文件<a/>')
  })
  test.todo('content in link URL', () => {
    // crash
    // [安装教程](/guide/installation。html)
    // expect(lint('[安装教程](/guide/installation.html)'))
    //   .toBe('[安装教程](/guide/installation.html)')
  })
  test.todo('content in link URL 2', () => {
    // 你也可以查阅[ 这个 Scrimba 上的系列教程](https：//scrimba。com/g/gvuedocs)
    // expect(lint('你也可以查阅[这个 Scrimba 上的系列教程](https://scrimba.com/g/gvuedocs)'))
    //   .toBe('你也可以查阅[这个 Scrimba 上的系列教程](https://scrimba.com/g/gvuedocs)')
  })
  test.todo('raw content', () => {
    // {% raw %}<div id="app" class="demo">...</div>{% raw %}
    expect(lint('{% raw %}\n<div id="app" class="demo">...</div>\n{% raw %}'))
      .toBe('{% raw %}\n<div id="app" class="demo">...</div>\n{% raw %}')
  })
  test('empty lines', () => {})
})
