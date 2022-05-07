import run, { Options } from '../src/run'
import { ValidationTarget } from '../src/report'

type Warning = {
  index: number
  target: ValidationTarget
  message: string
}

export const defaultConfig: Options = {
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
    trimSpace: true,
    skipZhUnits: `年月日天号时分秒`,
    skipAbbrs: [
      'Mr.',
      'Mrs.',
      'Dr.',
      'Jr.',
      'Sr.',
      'vs.',
      'etc.',
      'i.e.',
      'e.g.',
      'a.k.a.'
    ]
  }
}

export const getOutput = (...args: [string, Options?]) => run(...args).result

export const lint = (
  ...args: [string, Options?]
): {
  output: string
  warnings: Warning[]
} => {
  const output = run(...args)
  return {
    output: output.result,
    warnings: output.validations.map((validation) => {
      const { index, length, target, message } = validation
      return { index: index + length, target, message }
    })
  }
}
