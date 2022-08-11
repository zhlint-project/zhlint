import { describe, test, expect } from 'vitest'

import run, { Options } from '../src/run'
import { options } from './prepare'

const getOutput = (...args: [string, Options?]) => run(...args).result

describe('lint by issues', () => {
  // https://github.com/Jinjiang/zhlint/issues/11
  test('#11: hyphen between number', () => {
    expect(getOutput('1-1', options)).toBe('1-1')
  })

  // https://github.com/Jinjiang/zhlint/issues/13
  test('#13 VitePress tags', () => {
    const text = `![Chrome 开发者工具正在通过标签展示无障碍访问的 input 框的名字](./images/AccessibleLabelChromeDevTools.png)

:::warning 警告：
你可能还见过这样的包裹 input 框的标签：

\`\`\`vue-html
<label>
  名字：
  <input type="text" name="name" id="name" v-model="name" />
</label>
\`\`\`

但我们仍建议你显式地为 input 元素设置 id 相匹配的标签，以更好地实现无障碍访问。
:::

#### \`aria-label\` {#aria-label}
`
    expect(getOutput(text, options)).toBe(text)
  })

  // https://github.com/Jinjiang/zhlint/issues/23
  test('#23: two dots only', () => {
    expect(getOutput('..', options)).toBe('..')
  })

  // https://github.com/Jinjiang/zhlint/issues/35
  test('#35 parse error', () => {
    expect(getOutput('x‘x’x', options)).toBe('x‘x’x')
  })

  // https://github.com/Jinjiang/zhlint/issues/36
  test('#36 spaces around marks', () => {
    expect(getOutput('a* 啊 *', options)).toBe('a *啊*')
    expect(getOutput('a * 啊 *', options)).toBe('a *啊*')
  })

  // https://github.com/Jinjiang/zhlint/issues/18
  test('#18 unmatched brackets', () => {
    // still have warnings but the parser won't be crashed anymore
    // console.log(run('中文 ;-)', options))
    // console.log(run('1) 项目符号', options))
    expect(getOutput('中文 ;-)', options)).toBe('中文 ;-)')
    expect(getOutput('1) 项目符号', options)).toBe('1) 项目符号')
  })
})

describe('lint from v3.cn.vuejs.org', () => {
  // https://github.com/Jinjiang/zhlint/issues/63
  test('#63 computed()', () => {
    expect(getOutput('computed()', options)).toBe('computed()')
  })
  // https://github.com/Jinjiang/zhlint/issues/67
  test('#67 spaces around ()', () => {
    expect(getOutput('key（string 或者 Symbol）', options)).toBe(
      'key (string 或者 Symbol)'
    )
  })
  // Here the {...} is actually invisible hyper content.
  // It's better be solved by a hyper parser extension.
  test.todo('spaces around {}', () => {
    expect(getOutput('## 什么是 Vue？ {#what-is-vue}', options)).toBe(
      '## 什么是 Vue？ {#what-is-vue}'
    )
  })
  // https://github.com/Jinjiang/zhlint/issues/69
  test('#69 spaces around () and “”', () => {
    expect(getOutput('将静态的 HTML “激活” (hydrate) 为', options)).toBe(
      '将静态的 HTML“激活”(hydrate) 为'
    )
  })
  // https://github.com/Jinjiang/zhlint/issues/72
  test('#72 spaces around `` and 、', () => {
    expect(getOutput('`attrs` 、 `emit` 和 `slots`', options)).toBe(
      '`attrs`、`emit` 和 `slots`'
    )
  })
  // https://github.com/Jinjiang/zhlint/issues/70
  test('#70 spaces around [``] and 、', () => {
    expect(
      getOutput(
        '实例的 [`$attrs`](/api/component-instance.html#attrs)、 [`$emit`](/api/component-instance.html#emit)',
        options
      )
    ).toBe(
      '实例的 [`$attrs`](/api/component-instance.html#attrs)、[`$emit`](/api/component-instance.html#emit)'
    )
  })
  // https://github.com/Jinjiang/zhlint/issues/71
  test('#71 spaces around [``] and （）', () => {
    expect(
      getOutput(
        '应用级的 [`app.config.errorHandler`](/api/application.html#app-config-errorhandler)（前提是这个函数已经定义），',
        options
      )
    ).toBe(
      '应用级的 [`app.config.errorHandler`](/api/application.html#app-config-errorhandler) (前提是这个函数已经定义)，'
    )
  })
})
