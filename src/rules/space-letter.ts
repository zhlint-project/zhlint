/**
 * @fileoverview
 *
 * This rule is used to check whether there should be a space between
 * content.
 *
 * Options:
 * - spaceBetweenHalfwidthContent: boolean | undefined
 *   - `true`: ensure one space between half-width content (default)
 *   - `false` or `undefined`: do nothing, just keep the original format
 * - noSpaceBetweenFullwidthContent: boolean | undefined
 *   - `true`: remove the space between full-width content (default)
 *   - `false` or `undefined`: do nothing, just keep the original format
 * - spaceBetweenMixedwidthContent: boolean | undefined
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
  isLetterType,
  MutableGroupToken,
  MutableToken
} from '../parser/index.js'
import {
  checkSpaceAfter,
  findVisibleTokenAfter,
  findWrappersBetween,
  Options
} from './util.js'
import {
  CONTENT_NOSPACE_FULL_WIDTH,
  CONTENT_NOSPACE_MIXED_WIDTH,
  CONTENT_SPACE_HALF_WIDTH,
  CONTENT_SPACE_MIXED_WIDTH
} from './messages.js'

const generateHandler = (options: Options): Handler => {
  const onlyOneBetweenHalfwidthContentOption =
    options?.spaceBetweenHalfwidthContent
  const noBetweenFullwidthContentOption =
    options?.noSpaceBetweenFullwidthContent
  const betweenMixedwidthContentOption = options?.spaceBetweenMixedwidthContent

  return (token: MutableToken, _: number, group: MutableGroupToken) => {
    // skip non-content tokens
    if (!isLetterType(token.type)) {
      return
    }

    // skip non-content after-tokens
    const contentTokenAfter = findVisibleTokenAfter(group, token)
    if (!contentTokenAfter || !isLetterType(contentTokenAfter.type)) {
      return
    }

    // find the space host
    const { spaceHost, tokens } = findWrappersBetween(
      group,
      token,
      contentTokenAfter
    )

    // skip if the space host is not found
    if (!spaceHost) {
      return
    }

    // 1. half x half, full x full
    // 2. half x full, full x half
    if (contentTokenAfter.type === token.type) {
      // skip without custom option
      if (token.type === CharType.WESTERN_LETTER) {
        if (!onlyOneBetweenHalfwidthContentOption) {
          return
        }
        // skip if half-content x marks x half-content
        if (
          tokens.length > 1 &&
          tokens.filter((token) => token.spaceAfter).length === 0
        ) {
          return
        }
      } else {
        if (!noBetweenFullwidthContentOption) {
          return
        }
      }

      const spaceAfter = token.type === CharType.WESTERN_LETTER ? ' ' : ''
      const message =
        token.type === CharType.WESTERN_LETTER
          ? CONTENT_SPACE_HALF_WIDTH
          : CONTENT_NOSPACE_FULL_WIDTH

      checkSpaceAfter(spaceHost, spaceAfter, message)
    } else {
      // skip without custom option
      if (typeof betweenMixedwidthContentOption === 'undefined') {
        return
      }

      const spaceAfter = betweenMixedwidthContentOption ? ' ' : ''
      const message = betweenMixedwidthContentOption
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
