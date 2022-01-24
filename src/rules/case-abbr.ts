import { ValidationTarget } from '../logger'
import {
  CharType,
  MutableToken as Token,
  MutableGroupToken as GroupToken,
  Handler
} from '../parser'
import { findTokenBefore, findTokenAfter, removeValidation } from './util'

const abbrs = [
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

const reversedAbbrs = abbrs.map((str) => str.split('.').reverse().slice(1))

const hasAbbr = (
  token: Token,
  group: GroupToken,
  reversedAbbrs: string[][]
): Token[] | undefined => {
  const tokenBefore = findTokenBefore(group, token)
  if (tokenBefore && !tokenBefore.spaceAfter) {
    const matchedAbbrs = reversedAbbrs
      .filter((abbr) => abbr[0] === tokenBefore.content)
      .map((abbr) => abbr.slice(1))
    if (matchedAbbrs && matchedAbbrs.length) {
      const lastMatched = matchedAbbrs[matchedAbbrs.length - 1]
      if (lastMatched.length) {
        const tokenBeforeBefore = findTokenBefore(group, tokenBefore)
        if (
          tokenBeforeBefore &&
          !tokenBeforeBefore.spaceAfter &&
          tokenBeforeBefore.content === '.'
        ) {
          const result = hasAbbr(tokenBeforeBefore, group, matchedAbbrs)
          if (result) {
            return [tokenBefore, ...result]
          }
        }
      } else {
        return [tokenBefore]
      }
    }
  }
}

const handler: Handler = (token, index, group) => {
  if (token.content === '.') {
    // end of the content or has space after or full-width content after
    const tokenAfter = findTokenAfter(group, token)
    if (tokenAfter && tokenAfter.type === 'content-half' && !token.spaceAfter) {
      return
    }

    // raw content back match abbrs and no raw space after
    const result = hasAbbr(token, group, reversedAbbrs)

    // then keep all periods as they are
    if (result) {
      result.forEach((_, i) => {
        const periodToken = group[index - i * 2]
        if (periodToken.modifiedContent !== '.') {
          removeValidation(
            periodToken,
            'unify-punctuation',
            ValidationTarget.CONTENT
          )
        }
        periodToken.modifiedContent = '.'
        periodToken.type = CharType.PUNCTUATION_HALF
      })
    }
  }
}

export default handler
