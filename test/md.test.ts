import { describe, test, expect } from 'vitest'

import run from '../src/run.js'
import markdownParser from '../src/hypers/md.js'
import { ParsedStatus } from '../src/hypers/types.js'
import { options } from './prepare.js'

const getOutput = (str: string) => run(str, options).result

describe('parser with markdown', () => {
  test('[md parser] single paragraph', () => {
    const text = 'X [xxx](xxx) X *y* __x__ `ss` _0_ ~~asd~~ *asf**asf**adsf*'
    const data: ParsedStatus = {
      value: text,
      modifiedValue: text,
      ignoredByRules: [],
      ignoredByParsers: [],
      blocks: [
        {
          value: text,
          marks: [],
          start: 0,
          end: text.length - 1
        }
      ]
    }
    const result = markdownParser(data).blocks
    const marks = [
      {
        type: 'hyper',
        meta: 'link',
        startIndex: 2,
        startValue: '[',
        endIndex: 6,
        endValue: '](xxx)'
      },
      {
        type: 'hyper',
        meta: 'emphasis',
        startIndex: 15,
        startValue: '*',
        endIndex: 17,
        endValue: '*'
      },
      {
        type: 'hyper',
        meta: 'strong',
        startIndex: 19,
        startValue: '__',
        endIndex: 22,
        endValue: '__'
      },
      {
        type: 'raw',
        meta: 'inlineCode',
        startIndex: 25,
        endIndex: 29,
        startValue: '`ss`',
        endValue: ''
      },
      {
        type: 'hyper',
        meta: 'emphasis',
        startIndex: 30,
        startValue: '_',
        endIndex: 32,
        endValue: '_'
      },
      {
        type: 'hyper',
        meta: 'delete',
        startIndex: 34,
        startValue: '~~',
        endIndex: 39,
        endValue: '~~'
      },
      {
        type: 'hyper',
        meta: 'emphasis',
        startIndex: 42,
        startValue: '*',
        endIndex: 57,
        endValue: '*'
      },
      {
        type: 'hyper',
        meta: 'strong',
        startIndex: 46,
        startValue: '**',
        endIndex: 51,
        endValue: '**'
      }
    ]
    expect(result.length).toBe(1)
    expect(result[0].value).toBe(text)
    expect(result[0].marks).toEqual(marks)
  })
})

describe('markdown lint', () => {
  test('[md] single paragraph', () => {
    expect(getOutput('中文 X[ xxx ](xxx)X`hello`world')).toBe(
      '中文 X [xxx](xxx) X `hello` world'
    )
  })
  test('[md] frontmatter', () => {
    expect(
      getOutput('---\ntitle: 介绍\ntype: guide\norder: 2\n---\n## Vue 是什么\n')
    ).toBe('---\ntitle: 介绍\ntype: guide\norder: 2\n---\n## Vue 是什么\n')
  })
  test('[md] space between raw content', () => {
    // 我们 <a id="modal-player" href="#"> 制作了一个视频 </a>
    expect(
      getOutput('我们<a id="modal-player" href="#">制作了一个视频</a>')
    ).toBe('我们<a id="modal-player" href="#">制作了一个视频</a>')
  })
  test('[md] space between raw content 2', () => {
    // 我们 <a id="modal-player" href="#"> 制作了一个视频 </a>
    expect(
      getOutput('Hello<a id="modal-player" href="#">制作了一个视频</a>World')
    ).toBe('Hello <a id="modal-player" href="#">制作了一个视频</a> World')
  })
  test('[md] space between raw content 3', () => {
    // 创建一个 <code>。 html</code> 文件<a/>
    expect(getOutput('创建一个 <code>.html</code> 文件')).toBe(
      '创建一个 <code>.html</code> 文件'
    )
  })
  test('[md] raw content', () => {
    // {% raw %}<div id="app" class="demo">...</div>{% raw %}
    expect(
      getOutput(
        '中文 {% raw %}\n<div id="app" class="demo">...</div>\n{% raw %}'
      )
    ).toBe('中文 {% raw %}\n<div id="app" class="demo">...</div>\n{% raw %}')
  })
  test('[md] empty lines', () => {
    expect(getOutput('中文 a\n\nb\n\nc')).toBe('中文 a\n\nb\n\nc')
  })
  test('[md] inline code', () => {
    expect(getOutput(`改进 \`<todo-item>\` 组件`)).toBe(
      `改进 \`<todo-item>\` 组件`
    )
  })
  test('[md] footnote + inline code at the end', () => {
    expect(
      getOutput(
        '这样写将始终添加 `errorClass`，但是只有在 `isActive` 是 truthy<sup>[[1]](#footnote-1)</sup> 时才添加 `activeClass`。'
      )
    ).toBe(
      '这样写将始终添加 `errorClass`，但是只有在 `isActive` 是 truthy<sup>[[1]](#footnote-1)</sup> 时才添加 `activeClass`。'
    )
  })
  test('[md] space between "&" punctuation', () => {
    expect(getOutput('## 访问元素 & 组件')).toBe('## 访问元素 & 组件')
  })
  test('[md] duplicated space outside hyper content', () => {
    expect(
      getOutput(
        '那么你可以通过 [`$forceUpdate`](../api/#vm-forceUpdate) 来做这件事。'
      )
    ).toBe(
      '那么你可以通过 [`$forceUpdate`](../api/#vm-forceUpdate) 来做这件事。'
    )
  })
  test('[md] opposite side of hyper mark and bracket mark', () => {
    expect(
      getOutput(
        '注意 **`v-slot` 只能添加在 `<template>` 上** (只有[一种例外情况](#独占默认插槽的缩写语法))，这一点和已经废弃的 [`slot` 特性](#废弃了的语法)不同。'
      )
    ).toBe(
      '注意 **`v-slot` 只能添加在 `<template>` 上** (只有[一种例外情况](#独占默认插槽的缩写语法))，这一点和已经废弃的 [`slot` 特性](#废弃了的语法)不同。'
    )
  })
  test('[md] space before punctuation', () => {
    expect(getOutput('不过在需要时你也可以提供一个 setter ：')).toBe(
      '不过在需要时你也可以提供一个 setter：'
    )
  })
  test('[md] periods as ellipsis', () => {
    expect(
      getOutput(
        '你可以使用 [`try`...`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) 作为替代。'
      )
    ).toBe(
      '你可以使用 [`try`...`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) 作为替代。'
    )
  })
  test('[md] space between punctuation and hyper content', () => {
    expect(
      getOutput(
        'store 实例不再暴露事件触发器 (event emitter) 接口 (`on`, `off`, `emit`)。'
      )
    ).toBe(
      'store 实例不再暴露事件触发器 (event emitter) 接口 (`on`，`off`，`emit`)。'
    )
  })
  test('[md] html entity', () => {
    expect(
      getOutput(
        '取决于你分心和开始 2.0 最酷的新功能的次数。😉 &nbsp;无法判断时间，'
      )
    ).toBe('取决于你分心和开始 2.0 最酷的新功能的次数。😉 &nbsp;无法判断时间，')
  })
  test('[md] space between dash', () => {
    expect(
      getOutput('可以阅读本页面剩余部分 - 或者从[介绍](index.html)部分')
    ).toBe('可以阅读本页面剩余部分 - 或者从[介绍](index.html)部分')
  })
  test('[md] space between slash', () => {
    expect(
      getOutput('为此还应该引入 `Vue.nextTick`/`vm.$nextTick`。例如：')
    ).toBe('为此还应该引入 `Vue.nextTick`/`vm.$nextTick`。例如：')
  })
  test('[md] space outside hyper mark and hyper content', () => {
    expect(
      getOutput(
        '这种写法的更多优点详见：[`v-model` 示例](#带有-debounce-的-v-model移除)。'
      )
    ).toBe(
      '这种写法的更多优点详见：[`v-model` 示例](#带有-debounce-的-v-model移除)。'
    )
  })
  test('[md] space between punctuation and hyper content', () => {
    expect(
      getOutput(
        '对于布尔特性 (它们只要存在就意味着值为 `true`)，`v-bind` 工作起来略有不同'
      )
    ).toBe(
      '对于布尔特性 (它们只要存在就意味着值为 `true`)，`v-bind` 工作起来略有不同'
    )
  })
  test('[md] star (not punctuation)', () => {
    expect(getOutput('切换到 *Archive* 标签，然后再切换回 *Posts*')).toBe(
      '切换到 *Archive* 标签，然后再切换回 *Posts*'
    )
  })
  test('[md] colon (not datetime)', () => {
    expect(
      getOutput(
        '1. 添加全局方法或者属性。如: [vue-custom-element](https://github.com/karol-f/vue-custom-element)'
      )
    ).toBe(
      '1. 添加全局方法或者属性。如：[vue-custom-element](https://github.com/karol-f/vue-custom-element)'
    )
  })
  test('[md] escaped markdown syntax', () => {
    expect(
      getOutput(
        '2. 开发者向 Vue 挂载包含服务端渲染或用户提供的内容的 HTML 的整个页面。这实质上和问题 \\#1 是相同的，但是有的时候开发者可能没有意识到。这会使得攻击者提供作为普通 HTML 安全但对于 Vue 模板不安全的 HTML 以导致安全漏洞。最佳实践是永远不要向 Vue 挂载可能包含服务端渲染或用户提供的内容。'
      )
    ).toBe(
      '2. 开发者向 Vue 挂载包含服务端渲染或用户提供的内容的 HTML 的整个页面。这实质上和问题 \\#1 是相同的，但是有的时候开发者可能没有意识到。这会使得攻击者提供作为普通 HTML 安全但对于 Vue 模板不安全的 HTML 以导致安全漏洞。最佳实践是永远不要向 Vue 挂载可能包含服务端渲染或用户提供的内容。'
    )
  })
  test('[md] bracket x html tag', () => {
    expect(
      getOutput(
        '引入一个<a href="https://zh.wikipedia.org/wiki/工厂方法#工厂">工厂函数 (factory function)</a>使得我们的测试更简洁更易读'
      )
    ).toBe(
      '引入一个<a href="https://zh.wikipedia.org/wiki/工厂方法#工厂">工厂函数 (factory function)</a> 使得我们的测试更简洁更易读'
    )
  })
  test('[md] special quotations group inside md mark', () => {
    expect(
      getOutput(
        '更多测试 Vue 组件的知识可翻阅核心团员 [Edd Yerburgh](https://eddyerburgh.me/) 的书[《测试 Vue.js 应用》](https://www.manning.com/books/testing-vuejs-applications)。'
      )
    ).toBe(
      '更多测试 Vue 组件的知识可翻阅核心团员 [Edd Yerburgh](https://eddyerburgh.me/) 的书[《测试 Vue.js 应用》](https://www.manning.com/books/testing-vuejs-applications)。'
    )
  })
  test('[md] blockquote', () => {
    expect(
      getOutput(
        'foo\n\n> `components/icons/IconBox.vue`\n> `components/icons/IconCalendar.vue`\n> `components/icons/IconEnvelope.vue`\n\nbar'
      )
    ).toBe(
      'foo\n\n> `components/icons/IconBox.vue`\n> `components/icons/IconCalendar.vue`\n> `components/icons/IconEnvelope.vue`\n\nbar'
    )
  })
  test('[md] spaces in blockquotes', () => {
    expect(
      getOutput(
        `> [Live Demo ](https://vue-hn.herokuapp.com/)\n> 注：如果在一段时间内没有人访问过该网站，则需要一些加载时间。\n>`
      )
    ).toBe(
      `> [Live Demo](https://vue-hn.herokuapp.com/)\n> 注：如果在一段时间内没有人访问过该网站，则需要一些加载时间。\n>`
    )
  })
  test('[md] infinite findMarkSeq bug', () => {
    expect(getOutput('注意**局部注册的组件在其子组件中*不可用***。')).toBe(
      '注意**局部注册的组件在其子组件中*不可用***。'
    )
  })
  test('[md] linebreak', () => {
    expect(
      getOutput(
        'XXXX\n{% raw %}XXX{% endraw %}\n{% raw %}XXX{% endraw %}\n### XXXX'
      )
    ).toBe('XXXX\n{% raw %}XXX{% endraw %}\n{% raw %}XXX{% endraw %}\n### XXXX')
  })
  test('[md] space before link', () => {
    expect(
      getOutput('为了替换 `双向` 指令，见 [示例](#双向过滤器-替换)。')
    ).toBe('为了替换 `双向` 指令，见[示例](#双向过滤器-替换)。')
    expect(getOutput('详见 [自定义指令指南](custom-directive.html)。')).toBe(
      '详见[自定义指令指南](custom-directive.html)。'
    )
  })
  test('[md] space for md marker in the front', () => {
    expect(
      getOutput(
        '- [`<KeepAlive>` API 参考](/api/built-in-components.html#keepalive)'
      )
    ).toBe(
      '- [`<KeepAlive>` API 参考](/api/built-in-components.html#keepalive)'
    )
  })
})
