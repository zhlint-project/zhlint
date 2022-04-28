// TODO: parse abbrs into tokens, then check to match them out and revert any changes
// TODO: remove the spaces around

/**
 * @fileoverview
 * 
 * This rule will keep some special cases to skip the punctuation-relevant rules.
 * Generally, the cases are:
 * 
 * - some abbreviations with dots
 * - ellipsis with dots
 * 
 * Options:
 * - skip.abbrs: string[]
 * - skip.ellipsis: boolean
 */

import { MutableToken, MutableGroupToken, CharType, Handler } from '../parser'
import { findTokenAfter, findTokenBefore, Options } from './util'

// Abbreviations

const defaultAbbrs = [
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
): MutableToken[] | undefined => {
  const tokenBefore = findTokenBefore(group, token)
  if (tokenBefore && !tokenBefore.spaceAfter) {
    const matchedAbbrChars = reversedAbbrChars
      .filter((abbr) => abbr[0] === tokenBefore.content)
      .map((abbr) => abbr.slice(1))
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
            return [tokenBefore, ...result]
          }
        }
      } else {
        return [tokenBefore]
      }
    }
  }
}

const checkAbbr = (token: MutableToken, index: number, group: MutableGroupToken, reversedAbbrChars: string[][]): void => {
  if (token.content !== '.') {
    return
  }

  // end of the content or has space after or full-width content after
  const tokenAfter = findTokenAfter(group, token)
  if (tokenAfter && tokenAfter.type === 'content-half' && !token.spaceAfter) {
    return
  }

  // raw content back match abbrs and no raw space after
  const result = matchAbbr(token, group, reversedAbbrChars)

  // then keep all the dots as they are
  if (result) {
    result.forEach((_, i) => {
      const dotToken = group[index - i * 2]
      dotToken.modifiedContent = '.'
      dotToken.modifiedType = CharType.PUNCTUATION_HALF
    })
  }
}

// Ellipsis

const checkEllipsis = (token: MutableToken, _: number, group: MutableGroupToken): void => {
  if (token.content !== '.') {
    return
  }

  // beginning of dot(s)
  const tokenBefore = findTokenBefore(group, token)
  if (tokenBefore && tokenBefore.content === '.') {
    return
  }

  let nextToken = findTokenAfter(group, token)

  // make sure the dot(s) are ellipsis
  if (nextToken && nextToken.content === '.' && !token.spaceAfter) {
    token.modifiedContent = '.'
    token.modifiedType = CharType.PUNCTUATION_HALF

    // restore next token
    // if next next is dot: restore next space, update next next to next
    while (nextToken && nextToken.content === '.') {
      // restore next token content
      nextToken.modifiedContent = '.'
      nextToken.modifiedType = CharType.PUNCTUATION_HALF
      nextToken = findTokenAfter(group, nextToken)
    }
  }
}

// Handler

export const generateHandler = (options: Options): Handler => {
  const abbrs = options?.skip?.abbrs || []
  const reversedAbbrChars = reverseAbbrsIntoChars(abbrs)
  const ellipsis = options?.skip?.ellipsis

  return (token: MutableToken, index: number, group: MutableGroupToken) => {
    reversedAbbrChars.length && checkAbbr(token, index, group, reversedAbbrChars)
    ellipsis && checkEllipsis(token, index, group)
  }
}

export default generateHandler({
  skip: {
    abbrs: defaultAbbrs,
    ellipsis: true
  }
})
