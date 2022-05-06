import { describe, test, expect } from 'vitest'

import run, { Options } from '../src/run'

const defaultConfig: Options = {
  rules: {
    halfWidthPunctuation: `()`,
    fullWidthPunctuation: `，。：；？！“”‘’`,
    unifiedPunctuation: 'simplified',
    spaceBetweenHalfWidthContent: true,
    noSpaceBetweenFullWidthContent: true,
    spaceBetweenMixedWidthContent: true,
    noSpaceBeforePunctuation: true,
    spaceAfterHalfWidthPunctuation: true,
    noSpaceAfterFullWidthPunctuation: true,
    spaceOutsideHalfQuote: true,
    noSpaceOutsideFullQuote: true,
    noSpaceInsideQuote: true,
    spaceOutsideHalfBracket: true,
    noSpaceOutsideFullBracket: true,
    noSpaceInsideBracket: true,
    spaceOutsideCode: true,
    noSpaceInsideMark: true,
    trimSpace: true
  }
}

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
