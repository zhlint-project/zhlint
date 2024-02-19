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
 *   - right-half-bracket x content/left-quotation/code
 *   - content/right-quotation/code x left-half-bracket
 * - noSpaceOutsideFullBracket:
 *   - right-full-bracket x left-full-bracket
 *   - right-full-bracket x content/left-quotation/code
 *   - content/right-quotation/code x left-full-bracket
 */

import {
  CharType,
  GroupTokenType,
  Handler,
  isLetterType,
  isFullwidthPair,
  MarkSideType,
  MutableGroupToken,
  MutableSingleToken,
  MutableToken,
  HyperTokenType
} from '../parser/index.js'
import {
  checkSpaceAfter,
  findVisibleTokenAfter,
  findVisibleTokenBefore,
  findWrappersBetween,
  findTokenAfter,
  findTokenBefore,
  Options
} from './util.js'
import {
  BRACKET_NOSPACE_INSIDE,
  BRACKET_NOSPACE_OUTSIDE,
  BRACKET_SPACE_OUTSIDE
} from './messages.js'

const isFullWidth = (char: string, adjusted: string): boolean => {
  return isFullwidthPair(char) && adjusted.indexOf(char) === -1
}

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
  if (isFullwidthPair(token.value) || isFullwidthPair(token.modifiedValue)) {
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
    (before.type === CharType.WESTERN_LETTER ||
      // x()
      //  ^
      (before.value === '(' && token.value === ')')) &&
    // x)x
    //  ^
    (after.type === CharType.WESTERN_LETTER ||
      // ()x
      //  ^
      (token.value === '(' && after.value === ')'))
  )
}

const generateHandler = (options: Options): Handler => {
  const noInsideBracketOption = options.noSpaceInsideBracket
  const spaceOutsideHalfBracketOption = options.spaceOutsideHalfwidthBracket
  const noSpaceOutsideFullBracketOption = options.noSpaceOutsideFullwidthBracket
  const adjustedFullWidthOption = options.adjustedFullwidthPunctuation || ''

  return (token: MutableToken, _: number, group: MutableGroupToken) => {
    // skip non-bracket tokens
    if (token.type !== HyperTokenType.BRACKET_MARK) {
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
    const contentTokenBefore = findVisibleTokenBefore(group, token)
    const contentTokenAfter = findVisibleTokenAfter(group, token)
    const { spaceHost: beforeSpaceHost, tokens: beforeTokenSeq } =
      findWrappersBetween(group, contentTokenBefore, token)
    const { spaceHost: afterSpaceHost, tokens: afterTokenSeq } =
      findWrappersBetween(group, token, contentTokenAfter)
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
      const fullWidth = isFullWidth(
        token.modifiedValue,
        adjustedFullWidthOption
      )

      // 2.1 right-bracket x left-bracket
      if (contentTokenAfter) {
        if (
          token.markSide === MarkSideType.RIGHT &&
          contentTokenAfter.markSide === MarkSideType.LEFT
        ) {
          if (afterSpaceHost) {
            const hasFullWidth =
              fullWidth ||
              isFullWidth(
                contentTokenAfter.modifiedValue,
                adjustedFullWidthOption
              )

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

      // 2.2 content/right-quotation/code x left-bracket
      // 2.3 right-racket x content/left-quotation/code
      if (token.markSide === MarkSideType.LEFT) {
        if (
          contentTokenBefore &&
          (isLetterType(contentTokenBefore.type) ||
            contentTokenBefore.type === GroupTokenType.GROUP ||
            contentTokenBefore.type === HyperTokenType.CODE_CONTENT)
        ) {
          if (beforeSpaceHost) {
            // 2.2.1 content/right-quotation/code x left-full-bracket
            // 2.2.2 content/right-quotation/code x left-half-bracket
            if (
              fullWidth ||
              (contentTokenBefore.type === GroupTokenType.GROUP &&
                isFullWidth(
                  contentTokenBefore.modifiedEndValue,
                  adjustedFullWidthOption
                ))
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
          (isLetterType(contentTokenAfter.type) ||
            contentTokenAfter.type === GroupTokenType.GROUP ||
            contentTokenAfter.type === HyperTokenType.CODE_CONTENT)
        ) {
          if (afterSpaceHost) {
            // 2.3.1 right-full-bracket x content/left-quotation/code
            // 2.4.2 right-half-bracket x content/left-quotation/code
            if (
              fullWidth ||
              (contentTokenAfter.type === GroupTokenType.GROUP &&
                isFullWidth(
                  contentTokenAfter.modifiedStartValue,
                  adjustedFullWidthOption
                ))
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
