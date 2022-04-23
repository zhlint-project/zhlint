import { describe, test, expect } from 'vitest'

import run, { Options } from '../src/run'

const lint = (...args: [string, Options?]) => run(...args).result

describe('lint by rule', () => {
  test('hyper-space-option', () => {
    expect(
      lint('1', {
      })
    ).toBe('1')
  })
  test('hyper-space-position', () => {
    expect(
      lint('1', {
      })
    ).toBe('1')
  })
})
