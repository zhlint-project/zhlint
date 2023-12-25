/**
 * @fileoverview
 *
 * This rule is used to revert changes of abbreviations.
 *
 * Details:
 * - the point is rever the trailing dot
 */

import { CharType, Handler, MutableGroupToken, MutableToken } from '../parser'
import { ValidationTarget } from '../report'
import {
  findTokenAfter,
  findTokenBefore,
  Options,
  removeValidationOnTarget
} from './util'

const defaultSkippedAbbrs = [
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

const reverseAbbrsIntoChars = (abbrs: string[]): string[][] => {
  return abbrs.map((str) => str.split('.').reverse().slice(1))
}

const matchAbbr = (
  token: MutableToken,
  group: MutableGroupToken,
  reversedAbbrChars: string[][]
): boolean => {
  // find previous token
  const tokenBefore = findTokenBefore(group, token)
  if (tokenBefore && !tokenBefore.spaceAfter) {
    // get the next matching abbr chars by removing the last char and filtering
    const matchedAbbrChars = reversedAbbrChars
      .filter(
        (abbr) => abbr[0].toLowerCase() === tokenBefore.content.toLowerCase()
      )
      .map((abbr) => abbr.slice(1))

    // keep matching until any abbr chars fully matched
    // then return true
    if (matchedAbbrChars.length) {
      const lastMatched = matchedAbbrChars[matchedAbbrChars.length - 1]
      if (lastMatched.length) {
        const tokenBeforeBefore = findTokenBefore(group, tokenBefore)
        if (
          tokenBeforeBefore &&
          !tokenBeforeBefore.spaceAfter &&
          tokenBeforeBefore.content === '.'
        ) {
          const result = matchAbbr(tokenBeforeBefore, group, matchedAbbrChars)
          if (result) {
            return true
          }
        }
      } else {
        return true
      }
    }
  }

  return false
}

const generateHandler = (options: Options): Handler => {
  const reversedAbbrChars = reverseAbbrsIntoChars(options.skipAbbrs || [])

  return (token: MutableToken, index: number, group: MutableGroupToken) => {
    // skip non-dot tokens
    if (token.content !== '.') {
      return
    }

    // make sure it's the ending dot of the abbr
    const tokenAfter = findTokenAfter(group, token)
    if (
      tokenAfter &&
      tokenAfter.type === CharType.WESTERN_LETTER &&
      !token.spaceAfter
    ) {
      return
    }

    // keep the dot if the previous tokens match any abbr
    if (matchAbbr(token, group, reversedAbbrChars)) {
      token.modifiedContent = '.'
      token.modifiedType = token.type
      removeValidationOnTarget(token, ValidationTarget.CONTENT)
    }
  }
}

export const defaultConfig: Options = {
  skipAbbrs: defaultSkippedAbbrs
}

export default generateHandler
