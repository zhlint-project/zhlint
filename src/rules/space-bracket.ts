/**
 * @fileoverview
 *
 * This rule is checking spaces besides brackets.
 *
 * Options
 * - noSpaceInsideBracket: boolean | undefined
 * - spaceOutsideHalfBracket: boolean | undefined
 * - nospaceOutsideFullBracket: boolean | undefined
 *
 * Details:
 * - noSpaceInsideBracket:
 *   - left-bracket x anything
 *   - non-left-bracket x right-bracket
 * - spaceOutsideHalfBracket:
 *   - right-half-bracket x left-half-bracket
 *   - right-half-bracket x content/left-quote/code
 *   - content/right-quote/code x left-half-bracket
 * - noSpaceOutsideFullBracket:
 *   - right-full-bracket x left-full-bracket
 *   - right-full-bracket x content/left-quote/code
 *   - content/right-quote/code x left-full-bracket
 */

import {
  CharType,
  GroupTokenType,
  Handler,
  isLettersType,
  isFullWidthPair,
  MarkSideType,
  MutableGroupToken,
  MutableSingleToken,
  MutableToken,
  HyperTokenType
} from '../parser'
import {
  checkSpaceAfter,
  findExpectedVisibleTokenAfter,
  findExpectedVisibleTokenBefore,
  findMarkSeqBetween,
  findTokenAfter,
  findTokenBefore,
  Options
} from './util'
import {
  BRACKET_NOSPACE_INSIDE,
  BRACKET_NOSPACE_OUTSIDE,
  BRACKET_SPACE_OUTSIDE
} from './messages'

const shouldSkip = (
  before: MutableToken | undefined,
  beforeTokenSeq: MutableToken[],
  token: MutableSingleToken,
  afterTokenSeq: MutableToken[],
  after: MutableToken | undefined
): boolean => {
  if (!before || !after) {
    return false
  }
  if (
    isFullWidthPair(token.content) ||
    isFullWidthPair(token.modifiedContent)
  ) {
    return false
  }
  if (
    beforeTokenSeq.filter((x) => x.spaceAfter).length ||
    afterTokenSeq.filter((x) => x.spaceAfter).length
  ) {
    return false
  }
  return (
    // x(x
    //  ^
    (before.type === CharType.LETTERS_HALF ||
      // x()
      //  ^
      (before.content === '(' && token.content === ')')) &&
    // x)x
    //  ^
    (after.type === CharType.LETTERS_HALF ||
      // ()x
      //  ^
      (token.content === '(' && after.content === ')'))
  )
}

const generateHandler = (options: Options): Handler => {
  const noInsideBracketOption = options.noSpaceInsideBracket
  const spaceOutsideHalfBracketOption = options.spaceOutsideHalfBracket
  const noSpaceOutsideFullBracketOption = options.noSpaceOutsideFullBracket

  return (token: MutableToken, _: number, group: MutableGroupToken) => {
    // skip non-bracket tokens
    if (token.type !== HyperTokenType.HYPER_WRAPPER_BRACKET) {
      return
    }

    // 1. no space inside bracket
    if (noInsideBracketOption) {
      if (token.markSide === MarkSideType.LEFT) {
        // no space after
        const tokenAfter = findTokenAfter(group, token)
        if (tokenAfter) {
          checkSpaceAfter(token, '', BRACKET_NOSPACE_INSIDE)
        }
      } else {
        // no space before
        const tokenBefore = findTokenBefore(group, token)
        if (
          tokenBefore &&
          // dedupe
          tokenBefore.markSide !== MarkSideType.LEFT
        ) {
          checkSpaceAfter(tokenBefore, '', BRACKET_NOSPACE_INSIDE)
        }
      }
    }

    // skip bracket between half-width content without spaces
    // or empty brackets beside half-width content without spaces
    const contentTokenBefore = findExpectedVisibleTokenBefore(group, token)
    const contentTokenAfter = findExpectedVisibleTokenAfter(group, token)
    const { spaceHost: beforeSpaceHost, tokenSeq: beforeTokenSeq } =
      findMarkSeqBetween(group, contentTokenBefore, token)
    const { spaceHost: afterSpaceHost, tokenSeq: afterTokenSeq } =
      findMarkSeqBetween(group, token, contentTokenAfter)
    if (
      shouldSkip(
        contentTokenBefore,
        beforeTokenSeq,
        token,
        afterTokenSeq,
        contentTokenAfter
      )
    ) {
      return
    }

    // 2. spaces outside half/full bracket
    if (
      typeof spaceOutsideHalfBracketOption !== 'undefined' ||
      noSpaceOutsideFullBracketOption
    ) {
      const isFullWidth = isFullWidthPair(token.modifiedContent)

      // 2.1 right-bracket x left-bracket
      if (contentTokenAfter) {
        if (
          token.markSide === MarkSideType.RIGHT &&
          contentTokenAfter.markSide === MarkSideType.LEFT
        ) {
          if (afterSpaceHost) {
            const hasFullWidth =
              isFullWidth || isFullWidthPair(contentTokenAfter.modifiedContent)

            // 2.1.1 any-full-bracket
            // 2.1.2 right-half-bracket x left-half-bracket
            if (hasFullWidth) {
              if (noSpaceOutsideFullBracketOption) {
                checkSpaceAfter(token, '', BRACKET_NOSPACE_OUTSIDE)
              }
            } else {
              // skip no spaces between
              if (afterTokenSeq.filter((x) => x.spaceAfter).length > 0) {
                if (typeof spaceOutsideHalfBracketOption !== 'undefined') {
                  const spaceAfter = spaceOutsideHalfBracketOption ? ' ' : ''
                  const message = spaceOutsideHalfBracketOption
                    ? BRACKET_SPACE_OUTSIDE
                    : BRACKET_NOSPACE_OUTSIDE
                  checkSpaceAfter(token, spaceAfter, message)
                }
              }
            }
          }
        }
      }

      // 2.2 content/right-quote/code x left-bracket
      // 2.3 right-racket x content/left-quote/code
      if (token.markSide === MarkSideType.LEFT) {
        if (
          contentTokenBefore &&
          (isLettersType(contentTokenBefore.type) ||
            contentTokenBefore.type === GroupTokenType.GROUP ||
            contentTokenBefore.type === HyperTokenType.HYPER_CONTENT_CODE)
        ) {
          if (beforeSpaceHost) {
            // 2.2.1 content/right-quote/code x left-full-bracket
            // 2.2.2 content/right-quote/code x left-half-bracket
            if (
              isFullWidth ||
              (contentTokenBefore.type === GroupTokenType.GROUP &&
                isFullWidthPair(contentTokenBefore.modifiedEndContent))
            ) {
              if (noSpaceOutsideFullBracketOption) {
                checkSpaceAfter(beforeSpaceHost, '', BRACKET_NOSPACE_OUTSIDE)
              }
            } else {
              if (typeof spaceOutsideHalfBracketOption !== 'undefined') {
                const spaceAfter = spaceOutsideHalfBracketOption ? ' ' : ''
                const message = spaceOutsideHalfBracketOption
                  ? BRACKET_SPACE_OUTSIDE
                  : BRACKET_NOSPACE_OUTSIDE
                checkSpaceAfter(beforeSpaceHost, spaceAfter, message)
              }
            }
          }
        }
      } else {
        if (
          contentTokenAfter &&
          (isLettersType(contentTokenAfter.type) ||
            contentTokenAfter.type === GroupTokenType.GROUP ||
            contentTokenAfter.type === HyperTokenType.HYPER_CONTENT_CODE)
        ) {
          if (afterSpaceHost) {
            // 2.3.1 right-full-bracket x content/left-quote/code
            // 2.4.2 right-half-bracket x content/left-quote/code
            if (
              isFullWidth ||
              (contentTokenAfter.type === GroupTokenType.GROUP &&
                isFullWidthPair(contentTokenAfter.modifiedStartContent))
            ) {
              if (noSpaceOutsideFullBracketOption) {
                checkSpaceAfter(afterSpaceHost, '', BRACKET_NOSPACE_OUTSIDE)
              }
            } else {
              if (typeof spaceOutsideHalfBracketOption !== 'undefined') {
                const spaceAfter = spaceOutsideHalfBracketOption ? ' ' : ''
                const message = spaceOutsideHalfBracketOption
                  ? BRACKET_SPACE_OUTSIDE
                  : BRACKET_NOSPACE_OUTSIDE
                checkSpaceAfter(afterSpaceHost, spaceAfter, message)
              }
            }
          }
        }
      }
    }
  }
}

export const defaultConfig: Options = {
  spaceOutsideHalfBracket: true,
  noSpaceInsideBracket: true
}

export default generateHandler
