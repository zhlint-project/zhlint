import { describe, test, expect } from 'vitest'

import run from '../src/run'

const lint = (...args: [any]) => run(...args).result

describe('uncategorized cases', () => {
  test('#11: hyphen between number', () => {
    expect(lint('1-1')).toBe('1 - 1')
  })
})
