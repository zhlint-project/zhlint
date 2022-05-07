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
  isContentType,
  isFullWidthPair,
  MarkSideType,
  MutableGroupToken,
  MutableToken,
  SingleTokenType
} from '../parser'
import {
  checkSpaceAfter,
  findMarkSeqBetween,
  findNonHyperVisibleTokenAfter,
  findNonHyperVisibleTokenBefore,
  findTokenAfter,
  findTokenBefore,
  Options
} from './util'
import {
  BRACKET_NOSPACE_INSIDE,
  BRACKET_NOSPACE_OUTSIDE,
  BRACKET_SPACE_OUTSIDE
} from './messages'

const generateHandler = (options: Options): Handler => {
  const noInsideBracketOption = options.noSpaceInsideBracket
  const spaceOutsideHalfBracketOption = options.spaceOutsideHalfBracket
  const noSpaceOutsideFullBracketOption = options.noSpaceOutsideFullBracket

  return (token: MutableToken, _: number, group: MutableGroupToken) => {
    // skip non-bracket tokens
    if (token.type !== SingleTokenType.MARK_BRACKETS) {
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
    const isFullWidth = isFullWidthPair(token.modifiedContent)
    const contentTokenBefore = findNonHyperVisibleTokenBefore(group, token)
    const contentTokenAfter = findNonHyperVisibleTokenAfter(group, token)
    const { spaceHost: beforeSpaceHost, tokenSeq: beforeTokenSeq } =
      findMarkSeqBetween(group, contentTokenBefore, token)
    const { spaceHost: afterSpaceHost, tokenSeq: afterTokenSeq } =
      findMarkSeqBetween(group, token, contentTokenAfter)
    if (
      contentTokenBefore &&
      contentTokenAfter &&
      contentTokenBefore.type === CharType.CONTENT_HALF &&
      contentTokenAfter.type === CharType.CONTENT_HALF &&
      beforeTokenSeq.filter((x) => x.spaceAfter).length === 0 &&
      afterTokenSeq.filter((x) => x.spaceAfter).length === 0
    ) {
      return
    }

    // 2. spaces outside half/full bracket
    if (
      typeof spaceOutsideHalfBracketOption !== 'undefined' ||
      noSpaceOutsideFullBracketOption
    ) {
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
          (isContentType(contentTokenBefore.type) ||
            contentTokenBefore.type === GroupTokenType.GROUP ||
            contentTokenBefore.type === SingleTokenType.HYPER_CODE)
        ) {
          if (beforeSpaceHost) {
            // 2.2.1 content/right-quote/code x left-full-bracket
            // 2.2.2 content/right-quote/code x left-half-bracket
            if (isFullWidth) {
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
          (isContentType(contentTokenAfter.type) ||
            contentTokenAfter.type === GroupTokenType.GROUP ||
            contentTokenAfter.type === SingleTokenType.HYPER_CODE)
        ) {
          if (afterSpaceHost) {
            // 2.3.1 right-full-bracket x content/left-quote/code
            // 2.4.2 right-half-bracket x content/left-quote/code
            if (isFullWidth) {
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
