const lint = require('../src')

describe('plain text', () => {
  test('spaces', () => {
    // 遵守JavaScript编码规范非常重要
    expect(lint('遵守 JavaScript 编码规范非常重要'))
      .toBe('遵守 JavaScript 编码规范非常重要')
    // 关注(watch)你关心的仓库。
    expect(lint('关注 (watch) 你关心的仓库。'))
      .toBe('关注 (watch) 你关心的仓库。')
    // 如果你有任何问题，请联系@Vuejs_Events！
    expect(lint('如果你有任何问题，请联系 @Vuejs_Events！'))
      .toBe('如果你有任何问题，请联系 @Vuejs_Events！')
    // 每个版本的更新日志见 GitHub 。
    expect(lint('每个版本的更新日志见 GitHub。'))
      .toBe('每个版本的更新日志见 GitHub。')
    // Vue 也可以在 unpkg 和 cdnjs 上获取 ( cdnjs 的版本更新可能略滞后) 
    expect(lint('Vue 也可以在 unpkg 和 cdnjs 上获取 (cdnjs 的版本更新可能略滞后)。'))
      .toBe('Vue 也可以在 unpkg 和 cdnjs 上获取 (cdnjs 的版本更新可能略滞后)。')
  })
  test('punctuation marks', () => {
    // 对于制作原型或学习,你可以这样使用最新版本:
    expect(lint('对于制作原型或学习，你可以这样使用最新版本：'))
      .toBe('对于制作原型或学习，你可以这样使用最新版本：')
    // 该指令的意思是: "将这个元素节点的 title 特性和 Vue 实例的 message 属性保持一致".
    expect(lint('该指令的意思是：“将这个元素节点的 title 特性和 Vue 实例的 message 属性保持一致”。'))
      .toBe('该指令的意思是：“将这个元素节点的 title 特性和 Vue 实例的 message 属性保持一致”。')
  })
})

describe('markdown', () => {
  // todo
})

describe('html', () => {
  // todo
})
