import { IgnoredCase } from '../ignore.js'
import { ParsedStatus } from './types.js'

const ignoredCaseMatcher =
  /^(?:(?<prefix>.+?)-,)?(?<textStart>.+?)(?:,(?<textEnd>.+?))?(?:,-(?<suffix>.+?))?$/

export const parseIngoredCase = (text: string): IgnoredCase | undefined => {
  const matchResult = text.match(ignoredCaseMatcher)
  if (matchResult) {
    const { prefix, textStart, textEnd, suffix } =
      matchResult.groups as IgnoredCase
    return {
      prefix,
      textStart,
      textEnd,
      suffix
    }
  }
}

const parser = (data: ParsedStatus): ParsedStatus => {
  const { ignoredByRules, value: raw } = data
  const matcher = /<!--\s*zhlint\s*ignore:\s*(.+?)\s*-->/g
  let result: RegExpExecArray | null
  while ((result = matcher.exec(raw)) !== null) {
    const ignoredCase = parseIngoredCase(result[1])
    if (ignoredCase) {
      ignoredByRules.push(ignoredCase)
    }
  }
  return data
}

export default parser
