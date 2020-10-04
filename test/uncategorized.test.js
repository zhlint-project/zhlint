const run = require('../src/run')
const lint = (...args) => run(...args).result

test.todo = test.skip

describe('uncategorized cases', () => {
  test('#11: hyphen between number', () => {
    expect(lint('1-1')).toBe('1 - 1')
  })
})
