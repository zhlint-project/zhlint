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
