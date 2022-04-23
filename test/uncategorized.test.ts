import { describe, test, expect } from 'vitest'

import run, { Options } from '../src/run'

const lint = (...args: [string, Options?]) => run(...args).result

describe.todo('uncategorized cases', () => {
  // https://github.com/Jinjiang/zhlint/issues/11
  test('#11: hyphen between number', () => {
    expect(lint('1-1')).toBe('1 - 1')
  })
  // https://github.com/Jinjiang/zhlint/issues/23
  test('#23: two dots only', () => {
    expect(lint('..')).toBe('..')
  })
  test('VitePress tags', () => {
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
    expect(lint(text)).toBe(text)
  })
})
