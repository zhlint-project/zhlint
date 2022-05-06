import { describe, test, expect } from 'vitest'

import run, { Options } from '../src/run'

const getOutput = (...args: [string, Options?]) => run(...args).result

describe('lint with different arguments', () => {
  const options: Options = {
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
  test('ignored cases', () => {
    expect(
      getOutput('汉字和English之间需要有空格比如 half width content。', {
        ...options,
        ignoredCases: [{ textStart: '和English之间' }]
      })
    ).toBe('汉字和English之间需要有空格比如 half width content。')
  })
})
