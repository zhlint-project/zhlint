import { describe, test, expect } from 'vitest'

import run from '../src/run.js'
import { defaultConfig } from '../src/rules/index.js'
import { Options } from '../src/run.js'

const mdxOptions: Options = {
  rules: defaultConfig,
  hyperParse: ['ignore', 'mdx']
}

const getOutput = (str: string) => run(str, mdxOptions).result

describe('parser with mdx', () => {
  test('[mdx] ESM statements are untouched', () => {
    expect(
      getOutput(`import Foo from './Foo.astro'\n\n这篇文章用 Agent, 然后讲它。\n`)
    ).toBe(`import Foo from './Foo.astro'\n\n这篇文章用 Agent，然后讲它。\n`)
  })

  test('[mdx] jsx props are untouched', () => {
    expect(
      getOutput(
        `<Foo items={[{label: "开始, 结束"}]} />\n\n内层回环是 AgentLoop, 由 Tool 驱动。\n`
      )
    ).toBe(
      `<Foo items={[{label: "开始, 结束"}]} />\n\n内层回环是 AgentLoop，由 Tool 驱动。\n`
    )
  })

  test('[mdx] mdx expressions are untouched', () => {
    expect(getOutput(`前文内容。\n\n{/* more */}\n\n后文内容, 继续。\n`)).toBe(
      `前文内容。\n\n{/* more */}\n\n后文内容，继续。\n`
    )
  })

  test('[mdx] markdown inside jsx children is still linted', () => {
    expect(getOutput(`<Note>\n\n里面是一段中文, 内容。\n\n</Note>\n`)).toBe(
      `<Note>\n\n里面是一段中文，内容。\n\n</Note>\n`
    )
  })

  test('[mdx] inline jsx: tags protected, children linted, spacing matches legacy html', () => {
    // legacy inline-html behavior: spaces between CJK and the tags are
    // removed (see-through fullwidth x fullwidth), children are linted
    expect(getOutput(`他说 <em>你好, 世界</em> 之后, 走了。\n`)).toBe(
      `他说<em>你好，世界</em>之后，走了。\n`
    )
    // western x cjk through the tags: spaces are kept/added
    expect(getOutput(`Hello<a href="#">你好</a>World\n`)).toBe(
      `Hello <a href="#">你好</a> World\n`
    )
  })

  test('[mdx] frontmatter is untouched', () => {
    expect(
      getOutput(`---\ntitle: "标题, 不变"\n---\n\n正文内容, 要检查。\n`)
    ).toBe(`---\ntitle: "标题, 不变"\n---\n\n正文内容，要检查。\n`)
  })

  test('[mdx] falls back to plain markdown on invalid mdx syntax', () => {
    // `a<=b` is invalid MDX (parsed as a JSX tag start) but valid markdown;
    // the parser must not abort and still lint the rest as markdown.
    expect(getOutput(`比较 a<=b 的大小, 然后继续。\n`)).toBe(
      `比较 a<=b 的大小，然后继续。\n`
    )
  })

  test('[mdx] markdown behavior is preserved: code spans and western internals', () => {
    expect(
      getOutput('可以用 `structured-output`, 也就是工具返回后不再请求 LLM。\n版本 1.5 和 node.js 都不该动。\n')
    ).toBe(
      '可以用 `structured-output`，也就是工具返回后不再请求 LLM。\n版本 1.5 和 node.js 都不该动。\n'
    )
  })
})
