import { describe, test, expect } from 'vitest'

import run, { Options } from '../src/run'
import { defaultConfig } from './prepare'

const getOutput = (...args: [string, Options?]) => run(...args).result

describe('lint with different arguments', () => {
  test('ignored cases', () => {
    expect(
      getOutput('汉字和English之间需要有空格比如 half width content。', {
        ...defaultConfig,
        ignoredCases: [{ textStart: '和English之间' }]
      })
    ).toBe('汉字和English之间需要有空格比如 half width content。')
  })
})
