import { describe, test, expect } from 'vitest'

import run from '../src/run.js'
import { options } from './prepare.js'

const getOutput = (str: string) => run(str, options).result

const simpleInput = `::: tip
自动在中文和English之间加入空格
:::`
const simpleOutput = `::: tip
自动在中文和 English 之间加入空格
:::`
const defaultTitleInput = `:::
自动在中文和English之间加入空格
:::`
const defaultTitleOutput = `:::
自动在中文和 English 之间加入空格
:::`
const customTitleInput = `::: tip NOTE
自动在中文和English之间加入空格
:::`
const customTitleOutput = `::: tip NOTE
自动在中文和 English 之间加入空格
:::`

describe('vuepress lint', () => {
  test('[vuepress] simple custom container', () => {
    expect(getOutput(simpleInput)).toBe(simpleOutput)
  })

  test('[vuepress] custom container with default title', () => {
    expect(getOutput(defaultTitleInput)).toBe(defaultTitleOutput)
  })

  test('[vuepress] custom container with custom title', () => {
    expect(getOutput(customTitleInput)).toBe(customTitleOutput)
  })
})
