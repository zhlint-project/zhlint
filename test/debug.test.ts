import { describe, test } from 'vitest'

import fs from 'fs'
import path from 'path'
import run from '../src/run.js'

describe.skip('debug', () => {
  test('ignore HTML comment', () => {
    const input = fs.readFileSync(
      path.resolve(__dirname, './example-debug.md'),
      { encoding: 'utf8' }
    )
    const output = run(input)
    const { origin, result, __debug__ } = output
    const { pieces, blocks } = __debug__ || {}
    console.log({
      origin,
      result,
      pieces
    })
    blocks?.forEach((block) => {
      console.log(block.tokens)
    })
  })
})
