import { describe, test, expect } from 'vitest'

import run, { Options } from '../src/run.js'
import { options } from './prepare.js'

const getOutput = (...args: [string, Options?]) => run(...args).result

describe('lint with different arguments', () => {
  test('ignored cases', () => {
    expect(
      getOutput('汉字和English之间需要有空格比如 half width content。', {
        ...options,
        ignoredCases: [{ textStart: '和English之间' }]
      })
    ).toBe('汉字和English之间需要有空格比如 half width content。')
  })
  test('ignored cases from Vue docs', () => {
    const output = run('# SSR？ {#ssr}', {
      ...options,
      ignoredCases: [{ textStart: '？ {#' }]
    })
    expect(output.result).toBe('# SSR？ {#ssr}')
    expect(output.validations.length).toBe(0)
  })
})
