/**
 * @fileoverview
 *
 * This rule is checking spaces besides quotations.
 *
 * Options
 * - noSpaceInsideQuote: boolean | undefined
 * - spaceOutsideHalfQuote: boolean | undefined
 * - noSpaceOutsideFullQuote: boolean | undefined
 *
 * Details:
 * - noSpaceInsideQuote:
 *   - left-quote x right-quote
 *   - content/punctuation/right-quote/right-bracket/code/unknown/container x right-quote
 *   - left-quote x content/punctuation/left-quote/left-bracket/code/unknown/container
 * - spaceOutsideHalfQuote:
 *   - right-half-quote x left-half-quote
 *   - content/code x left-half-quote
 *   - right-half-quote x content/code
 * - noSpaceOutsideFullQuote:
 *   - right-full-quote x left-full-quote
 *   - content/code x left-full-quote
 *   - right-full-quote x content/code
 */

import {
  GroupTokenType,
  Handler,
  isLetterType,
  isFullwidthPair,
  MarkSideType,
  MutableGroupToken,
  MutableToken,
  HyperTokenType
} from '../parser'
import {
  checkInnerSpaceBefore,
  checkSpaceAfter,
  findWrappersBetween,
  findNonCodeVisibleTokenAfter,
  findNonCodeVisibleTokenBefore,
  Options
} from './util'
import {
  QUOTE_NOSPACE_INSIDE,
  QUOTE_NOSPACE_OUTSIDE,
  QUOTE_SPACE_OUTSIDE
} from './messages'

const isFullWidth = (char: string, adjusted: string): boolean => {
  return isFullwidthPair(char) && adjusted.indexOf(char) === -1
}

const generateHandler = (options: Options): Handler => {
  const noSpaceInsideQuoteOption = options.noSpaceInsideQuotation
  const spaceOutsideHalfQuoteOption = options.spaceOutsideHalfwidthQuotation
  const noSpaceOutsideFullQuoteOption = options.noSpaceOutsideFullwidthQuotation
  const adjustedFullWidthOption = options.adjustedFullwidthPunctuation || ''

  return (token: MutableToken, _: number, group: MutableGroupToken) => {
    // skip non-group tokens
    if (token.type !== GroupTokenType.GROUP) {
      return
    }

    // 1. no space inside quotation
    if (noSpaceInsideQuoteOption) {
      // 1.1 left-quote x content/punctuation/left-quote/left-bracket/code/unknown/container
      const firstInsdieToken = token[0]
      if (
        firstInsdieToken &&
        firstInsdieToken.markSide !== MarkSideType.RIGHT
      ) {
        checkInnerSpaceBefore(token, '', QUOTE_NOSPACE_INSIDE)
      }

      // 1.2 content/punctuation/right-quote/right-bracket/code/unknown/container x right-quote
      const lastInsideToken = token[token.length - 1]
      if (lastInsideToken && lastInsideToken.markSide !== MarkSideType.LEFT) {
        checkSpaceAfter(lastInsideToken, '', QUOTE_NOSPACE_INSIDE)
      }

      // 1.3 left-quote x right-quote
      if (!firstInsdieToken) {
        checkInnerSpaceBefore(token, '', QUOTE_NOSPACE_INSIDE)
      }
    }

    // 2. space outside half/full quotation
    if (
      typeof spaceOutsideHalfQuoteOption !== 'undefined' ||
      noSpaceOutsideFullQuoteOption
    ) {
      // 2.1 right-quote x left-quote
      const contentTokenAfter = findNonCodeVisibleTokenAfter(group, token)
      if (
        contentTokenAfter &&
        contentTokenAfter.type === GroupTokenType.GROUP
      ) {
        const { spaceHost } = findWrappersBetween(
          group,
          token,
          contentTokenAfter
        )
        if (spaceHost) {
          const fullWidth =
            isFullWidth(token.modifiedEndValue, adjustedFullWidthOption) ||
            isFullWidth(
              contentTokenAfter.modifiedStartValue,
              adjustedFullWidthOption
            )
          // 2.1.1 right-full-quote x left-full-quote
          // 2.1.2 right-half-quote x left-half-quote
          if (fullWidth) {
            if (noSpaceOutsideFullQuoteOption) {
              checkSpaceAfter(spaceHost, '', QUOTE_SPACE_OUTSIDE)
            }
          } else {
            if (typeof spaceOutsideHalfQuoteOption !== 'undefined') {
              const spaceAfter = spaceOutsideHalfQuoteOption ? ' ' : ''
              const message = spaceOutsideHalfQuoteOption
                ? QUOTE_SPACE_OUTSIDE
                : QUOTE_NOSPACE_OUTSIDE
              checkSpaceAfter(spaceHost, spaceAfter, message)
            }
          }
        }
      }

      // 2.2 content/code x left-quote
      const contentTokenBefore = findNonCodeVisibleTokenBefore(group, token)
      if (
        contentTokenBefore &&
        (isLetterType(contentTokenBefore.type) ||
          contentTokenBefore.type === HyperTokenType.CODE_CONTENT)
      ) {
        const { spaceHost } = findWrappersBetween(
          group,
          contentTokenBefore,
          token
        )
        if (spaceHost) {
          const fullWidth = isFullWidth(
            token.modifiedStartValue,
            adjustedFullWidthOption
          )

          // 2.2.1 content/code x left-full-quote
          // 2.2.2 content/code x left-half-quote
          if (fullWidth) {
            if (noSpaceOutsideFullQuoteOption) {
              checkSpaceAfter(spaceHost, '', QUOTE_NOSPACE_OUTSIDE)
            }
          } else {
            if (typeof spaceOutsideHalfQuoteOption !== 'undefined') {
              const spaceAfter = spaceOutsideHalfQuoteOption ? ' ' : ''
              const message = spaceOutsideHalfQuoteOption
                ? QUOTE_SPACE_OUTSIDE
                : QUOTE_NOSPACE_OUTSIDE
              checkSpaceAfter(spaceHost, spaceAfter, message)
            }
          }
        }
      }

      // 2.3 right-quote x content/code
      if (
        contentTokenAfter &&
        (isLetterType(contentTokenAfter.type) ||
          contentTokenAfter.type === HyperTokenType.CODE_CONTENT)
      ) {
        const { spaceHost } = findWrappersBetween(
          group,
          token,
          contentTokenAfter
        )
        if (spaceHost) {
          const fullWidth = isFullWidth(
            token.modifiedEndValue,
            adjustedFullWidthOption
          )

          // 2.3.1 right-full-quote x content/code
          // 2.3.2 right-half-quote x content/code
          if (fullWidth) {
            if (noSpaceOutsideFullQuoteOption) {
              checkSpaceAfter(spaceHost, '', QUOTE_NOSPACE_OUTSIDE)
            }
          } else {
            if (typeof spaceOutsideHalfQuoteOption !== 'undefined') {
              const spaceAfter = spaceOutsideHalfQuoteOption ? ' ' : ''
              const message = spaceOutsideHalfQuoteOption
                ? QUOTE_SPACE_OUTSIDE
                : QUOTE_NOSPACE_OUTSIDE
              checkSpaceAfter(spaceHost, spaceAfter, message)
            }
          }
        }
      }
    }
  }
}

export const defaultConfig: Options = {
  spaceOutsideHalfQuote: true,
  noSpaceInsideQuote: true,
  noSpaceOutsideFullQuote: true
}

export default generateHandler
