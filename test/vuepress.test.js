const run = require('../src/run')

const lint = (...args) => run(...args).result

test.todo = test.skip

const simpleInput = `:::
自动在中文和English之间加入空格
:::`
const simpleOutput = `:::
自动在中文和 English 之间加入空格
:::`
const defaultTitleInput = `:::
自动在中文和English之间加入空格
:::`
const defaultTitleOutput = `:::
自动在中文和 English 之间加入空格
:::`
const customTitleInput = `:::
自动在中文和English之间加入空格
:::`
const customTitleOutput = `:::
自动在中文和 English 之间加入空格
:::`

describe('lint', () => {
  test('simple custom container', () => {
    expect(lint(simpleInput)).toBe(simpleOutput)
  })

  test('custom container with default title', () => {
    expect(lint(defaultTitleInput)).toBe(defaultTitleOutput)
  })

  test('custom container with custom title', () => {
    expect(lint(customTitleInput)).toBe(customTitleOutput)
  })
})
