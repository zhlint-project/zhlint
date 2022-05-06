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

export const generateHandler = (options: Options): Handler => {
  const noInsideBracketOption = options?.noSpaceInsideBracket
  const spaceOutsideHalfBracketOption = options?.spaceOutsideHalfBracket
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

    // 2. spaces outside half/full bracket
    if (
      typeof spaceOutsideHalfBracketOption !== 'undefined' ||
      noSpaceOutsideFullBracketOption
    ) {
      // 2.1 right-bracket x left-bracket
      const contentTokenAfter = findNonHyperVisibleTokenAfter(group, token)
      if (contentTokenAfter) {
        if (
          token.markSide === MarkSideType.RIGHT &&
          contentTokenAfter.markSide === MarkSideType.LEFT
        ) {
        const { spaceHost } = findMarkSeqBetween(
          group,
          token,
          contentTokenAfter
        )
        if (spaceHost) {
          const isFullWidth =
            isFullWidthPair(token.content) ||
            isFullWidthPair(contentTokenAfter.content)
          
            // 2.1.1 any-full-bracket
            // 2.1.2 right-half-bracket x left-half-bracket
            if (isFullWidth) {
              if (noSpaceOutsideFullBracketOption) {
                checkSpaceAfter(token, '', BRACKET_NOSPACE_OUTSIDE)
              }
            } else {
              if (spaceOutsideHalfBracketOption) {
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

      // 2.2 content/right-quote/code x left-bracket
      // 2.3 right-racket x content/left-quote/code
      if (token.markSide === MarkSideType.LEFT) {
        const contentTokenBefore = findNonHyperVisibleTokenBefore(group, token)
        if (
          contentTokenBefore && (
            isContentType(contentTokenBefore.type) ||
            contentTokenBefore.type === GroupTokenType.GROUP ||
            contentTokenBefore.type === SingleTokenType.HYPER_CODE
          )
        ) {
          const { spaceHost } = findMarkSeqBetween(
            group,
            contentTokenBefore,
            token
          )
          if (spaceHost) {
            const isFullWidth = isFullWidthPair(token.content)

            // 2.2.1 content/right-quote/code x left-full-bracket
            // 2.2.2 content/right-quote/code x left-half-bracket
            if (isFullWidth) {
              if (noSpaceOutsideFullBracketOption) {
                checkSpaceAfter(spaceHost, '', BRACKET_NOSPACE_OUTSIDE)
              }
            } else {
              if (typeof spaceOutsideHalfBracketOption !== 'undefined') {
                const spaceAfter = spaceOutsideHalfBracketOption ? ' ' : ''
                const message = spaceOutsideHalfBracketOption
                  ? BRACKET_SPACE_OUTSIDE
                  : BRACKET_NOSPACE_OUTSIDE
                checkSpaceAfter(spaceHost, spaceAfter, message)
              }
            }
          }
        }
      } else {
        if (
          contentTokenAfter && (
            isContentType(contentTokenAfter.type) ||
            contentTokenAfter.type === GroupTokenType.GROUP ||
            contentTokenAfter.type === SingleTokenType.HYPER_CODE
          )
        ) {
          const { spaceHost } = findMarkSeqBetween(
            group,
            token,
            contentTokenAfter
          )
          if (spaceHost) {
            const isFullWidth = isFullWidthPair(token.content)

            // 2.3.1 right-full-bracket x content/left-quote/code
            // 2.4.2 right-half-bracket x content/left-quote/code
            if (isFullWidth) {
              if (noSpaceOutsideFullBracketOption) {
                checkSpaceAfter(spaceHost, '', BRACKET_NOSPACE_OUTSIDE)
              }
            } else {
              if (typeof spaceOutsideHalfBracketOption !== 'undefined') {
                const spaceAfter = spaceOutsideHalfBracketOption ? ' ' : ''
                const message = spaceOutsideHalfBracketOption
                  ? BRACKET_SPACE_OUTSIDE
                  : BRACKET_NOSPACE_OUTSIDE
                checkSpaceAfter(spaceHost, spaceAfter, message)
              }
            }
          }
        }
      }
    }
  }
}

export default generateHandler({
  spaceOutsideHalfBracket: true,
  noSpaceInsideBracket: true
})
