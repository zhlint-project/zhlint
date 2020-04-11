const fs = require('fs')
const path = require('path')
const run = require('../src/run')

const lint = (...args) => run(...args).result

test.todo = test.skip

describe('lint', () => {
  test('vuejs guide index', () => {
    const input = fs.readFileSync(
      path.resolve(__dirname, './examples.md'),
      { encoding: 'utf8' })
    expect(lint(input)).toBe(input)
  })
})
