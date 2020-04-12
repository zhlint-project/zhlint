const fs = require('fs')
const path = require('path')
const run = require('../src/run')

const lint = (...args) => run(...args).result

test.todo = test.skip

describe('lint', () => {
  test('vuejs guide article', () => {
    const input = fs.readFileSync(
      path.resolve(__dirname, './example-units.md'),
      { encoding: 'utf8' })
    const output = fs.readFileSync(
      path.resolve(__dirname, './example-units-fixed.md'),
      { encoding: 'utf8' })
    expect(lint(input)).toBe(output)
  })
  test('vuejs guide article', () => {
    const input = fs.readFileSync(
      path.resolve(__dirname, './example-article.md'),
      { encoding: 'utf8' })
    expect(lint(input)).toBe(input)
  })
})
