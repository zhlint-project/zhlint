/**
 * @fileoverview
 *
 * This rule is checking spaces besides quotations.
 *
 * Options
 * - noSpaceInsideQuotation: boolean | undefined
 * - spaceOutsideHalfwidthQuotation: boolean | undefined
 * - noSpaceOutsideFullwidthQuotation: boolean | undefined
 *
 * Details:
 * - noSpaceInsideQuotation:
 *   - left-quotation x right-quotation
 *   - content/punctuation/right-quotation/right-bracket/code/unknown/container x right-quotation
 *   - left-quotation x content/punctuation/left-quotation/left-bracket/code/unknown/container
 * - spaceOutsideHalfwidthQuotation:
 *   - right-half-quotation x left-half-quotation
 *   - content/code x left-half-quotation
 *   - right-half-quotation x content/code
 * - noSpaceOutsideFullwidthQuotation:
 *   - right-full-quotation x left-full-quotation
 *   - content/code x left-full-quotation
 *   - right-full-quotation x content/code
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
} from '../parser/index.js'
import {
  checkInnerSpaceBefore,
  checkSpaceAfter,
  findWrappersBetween,
  findNonCodeVisibleTokenAfter,
  findNonCodeVisibleTokenBefore,
  Options
} from './util.js'
import {
  QUOTATION_NOSPACE_INSIDE,
  QUOTATION_NOSPACE_OUTSIDE,
  QUOTATION_SPACE_OUTSIDE
} from './messages.js'

const isFullWidth = (char: string, adjusted: string): boolean => {
  return isFullwidthPair(char) && adjusted.indexOf(char) === -1
}

const generateHandler = (options: Options): Handler => {
  const noSpaceInsideQuotationOption = options.noSpaceInsideQuotation
  const spaceOutsideHalfQuotationOption = options.spaceOutsideHalfwidthQuotation
  const noSpaceOutsideFullQuotationOption =
    options.noSpaceOutsideFullwidthQuotation
  const adjustedFullWidthOption = options.adjustedFullwidthPunctuation || ''

  return (token: MutableToken, _: number, group: MutableGroupToken) => {
    // skip non-group tokens
    if (token.type !== GroupTokenType.GROUP) {
      return
    }

    // 1. no space inside quotation
    if (noSpaceInsideQuotationOption) {
      // 1.1 left-quotation x content/punctuation/left-quotation/left-bracket/code/unknown/container
      const firstInsdieToken = token[0]
      if (
        firstInsdieToken &&
        firstInsdieToken.markSide !== MarkSideType.RIGHT
      ) {
        checkInnerSpaceBefore(token, '', QUOTATION_NOSPACE_INSIDE)
      }

      // 1.2 content/punctuation/right-quotation/right-bracket/code/unknown/container x right-quotation
      const lastInsideToken = token[token.length - 1]
      if (lastInsideToken && lastInsideToken.markSide !== MarkSideType.LEFT) {
        checkSpaceAfter(lastInsideToken, '', QUOTATION_NOSPACE_INSIDE)
      }

      // 1.3 left-quotation x right-quotation
      if (!firstInsdieToken) {
        checkInnerSpaceBefore(token, '', QUOTATION_NOSPACE_INSIDE)
      }
    }

    // 2. space outside half/full quotation
    if (
      typeof spaceOutsideHalfQuotationOption !== 'undefined' ||
      noSpaceOutsideFullQuotationOption
    ) {
      // 2.1 right-quotation x left-quotation
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
          // 2.1.1 right-full-quotation x left-full-quotation
          // 2.1.2 right-half-quotation x left-half-quotation
          if (fullWidth) {
            if (noSpaceOutsideFullQuotationOption) {
              checkSpaceAfter(spaceHost, '', QUOTATION_SPACE_OUTSIDE)
            }
          } else {
            if (typeof spaceOutsideHalfQuotationOption !== 'undefined') {
              const spaceAfter = spaceOutsideHalfQuotationOption ? ' ' : ''
              const message = spaceOutsideHalfQuotationOption
                ? QUOTATION_SPACE_OUTSIDE
                : QUOTATION_NOSPACE_OUTSIDE
              checkSpaceAfter(spaceHost, spaceAfter, message)
            }
          }
        }
      }

      // 2.2 content/code x left-quotation
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

          // 2.2.1 content/code x left-full-quotation
          // 2.2.2 content/code x left-half-quotation
          if (fullWidth) {
            if (noSpaceOutsideFullQuotationOption) {
              checkSpaceAfter(spaceHost, '', QUOTATION_NOSPACE_OUTSIDE)
            }
          } else {
            if (typeof spaceOutsideHalfQuotationOption !== 'undefined') {
              const spaceAfter = spaceOutsideHalfQuotationOption ? ' ' : ''
              const message = spaceOutsideHalfQuotationOption
                ? QUOTATION_SPACE_OUTSIDE
                : QUOTATION_NOSPACE_OUTSIDE
              checkSpaceAfter(spaceHost, spaceAfter, message)
            }
          }
        }
      }

      // 2.3 right-quotation x content/code
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

          // 2.3.1 right-full-quotation x content/code
          // 2.3.2 right-half-quotation x content/code
          if (fullWidth) {
            if (noSpaceOutsideFullQuotationOption) {
              checkSpaceAfter(spaceHost, '', QUOTATION_NOSPACE_OUTSIDE)
            }
          } else {
            if (typeof spaceOutsideHalfQuotationOption !== 'undefined') {
              const spaceAfter = spaceOutsideHalfQuotationOption ? ' ' : ''
              const message = spaceOutsideHalfQuotationOption
                ? QUOTATION_SPACE_OUTSIDE
                : QUOTATION_NOSPACE_OUTSIDE
              checkSpaceAfter(spaceHost, spaceAfter, message)
            }
          }
        }
      }
    }
  }
}

export const defaultConfig: Options = {
  spaceOutsideHalfwidthQuotation: true,
  noSpaceInsideQuotation: true,
  noSpaceOutsideFullwidthQuotation: true
}

export default generateHandler
