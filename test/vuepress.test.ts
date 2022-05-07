import { describe, test, expect } from 'vitest'

import run from '../src/run'
import { defaultConfig } from './rules.test'

const getOutput = (str: string) => run(str, defaultConfig).result

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
    expect(getOutput(simpleInput)).toBe(simpleOutput)
  })

  test('custom container with default title', () => {
    expect(getOutput(defaultTitleInput)).toBe(defaultTitleOutput)
  })

  test('custom container with custom title', () => {
    expect(getOutput(customTitleInput)).toBe(customTitleOutput)
  })
})
