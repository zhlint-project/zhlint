import { describe, test } from 'vitest'

import fs from 'fs'
import path from 'path'
import run from '../src/run'

describe.todo('lint', () => {
  test('ignore HTML comment', () => {
    const input = fs.readFileSync(
      path.resolve(__dirname, './example-todo.md'),
      { encoding: 'utf8' }
    )
    run(input)
  })
})
