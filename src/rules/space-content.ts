/**
 * @fileoverview
 *
 * This rule is used to check whether there should be a space between
 * content.
 *
 * Options:
 * - spaceBetweenHalfWidthContent: boolean | undefined
 *   - `true`: ensure one space between half-width content (default)
 *   - `false` or `undefined`: do nothing, just keep the original format
 * - noSpaceBetweenFullWidthContent: boolean | undefined
 *   - `true`: remove the space between full-width content (default)
 *   - `false` or `undefined`: do nothing, just keep the original format
 * - spaceBetweenMixedWidthContent: boolean | undefined
 *   - `true`: keep one space between width-mixed content (default)
 *   - `false`: no space between width-mixed content
 *   - `undefined`: do nothing, just keep the original format
 *
 * Examples (betweenMixedWidthContent = true):
 * - *a*啊 -> *a* 啊
 * - *a *啊 -> *a* 啊
 * - *啊*a -> *啊* a
 * - *啊 *a -> *啊* a
 *
 * Examples (betweenMixedWidthContent = false):
 * - *a* 啊 -> *a*啊
 * - *a *啊 -> *a*啊
 * - *啊* a -> *啊*a
 * - *啊 *a -> *啊*a
 */

import {
  CharType,
  Handler,
  isContentType,
  MutableGroupToken,
  MutableToken
} from '../parser'
import {
  checkSpaceAfter,
  findExpectedVisibleTokenAfter,
  findMarkSeqBetween,
  Options
} from './util'
import {
  CONTENT_NOSPACE_FULL_WIDTH,
  CONTENT_NOSPACE_MIXED_WIDTH,
  CONTENT_SPACE_HALF_WIDTH,
  CONTENT_SPACE_MIXED_WIDTH
} from './messages'

const generateHandler = (options: Options): Handler => {
  const onlyOneBetweenHalfWidthContentOption =
    options?.spaceBetweenHalfWidthContent
  const noBetweenFullWidthContentOption =
    options?.noSpaceBetweenFullWidthContent
  const betweenMixedWidthContentOption = options?.spaceBetweenMixedWidthContent

  return (token: MutableToken, _: number, group: MutableGroupToken) => {
    // skip non-content tokens
    if (!isContentType(token.type)) {
      return
    }

    // skip non-content after-tokens
    const contentTokenAfter = findExpectedVisibleTokenAfter(group, token)
    if (!contentTokenAfter || !isContentType(contentTokenAfter.type)) {
      return
    }

    // find the space host
    const { spaceHost, tokenSeq } = findMarkSeqBetween(group, token, contentTokenAfter)

    // skip if the space host is not found
    if (!spaceHost) {
      return
    }

    // 1. half x half, full x full
    // 2. half x full, full x half
    if (contentTokenAfter.type === token.type) {
      // skip without custom option
      if (token.type === CharType.CONTENT_HALF) {
        if (!onlyOneBetweenHalfWidthContentOption) {
          return
        }
        // skip if half-content x marks x half-content
        if (
          tokenSeq.length > 1 &&
          tokenSeq.filter((token) => token.spaceAfter).length === 0
        ) {
          return
        }
      } else {
        if (!noBetweenFullWidthContentOption) {
          return
        }
      }

      const spaceAfter = token.type === CharType.CONTENT_HALF ? ' ' : ''
      const message =
        token.type === CharType.CONTENT_HALF
          ? CONTENT_SPACE_HALF_WIDTH
          : CONTENT_NOSPACE_FULL_WIDTH

      checkSpaceAfter(spaceHost, spaceAfter, message)
    } else {
      // skip without custom option
      if (typeof betweenMixedWidthContentOption === 'undefined') {
        return
      }

      const spaceAfter = betweenMixedWidthContentOption ? ' ' : ''
      const message = betweenMixedWidthContentOption
        ? CONTENT_SPACE_MIXED_WIDTH
        : CONTENT_NOSPACE_MIXED_WIDTH

      checkSpaceAfter(spaceHost, spaceAfter, message)
    }
  }
}

export const defaultConfig: Options = {
  spaceBetweenHalfWidthContent: true,
  noSpaceBetweenFullWidthContent: true,
  spaceBetweenMixedWidthContent: true
}

export default generateHandler
