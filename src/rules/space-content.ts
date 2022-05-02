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
 * Note:
 * The challenging part is to skip hyper marks and put the space (if any) into
 * the right places.
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

export const generateHandler = (options: Options): Handler => {
  const onlyOneBetweenHalfWidthContentOption =
    options?.spaceBetweenHalfWidthContent
  const noBetweenFullWidthContentOption =
    options?.noSpaceBetweenFullWidthContent
  const betweenMixedWidthContentOption = options?.spaceBetweenMixedWidthContent

  return (token: MutableToken, index: number, group: MutableGroupToken) => {
    // skip non-content tokens
    if (!isContentType(token.type)) {
      return
    }

    // skip tokens without content token next
    const contentTokenAfter = findExpectedVisibleTokenAfter(group, token)
    if (!contentTokenAfter || !isContentType(contentTokenAfter.type)) {
      return
    }

    const { spaceHost, tokenSeq } = findMarkSeqBetween(group, token, contentTokenAfter)

    // skip if the space host is not found
    if (!spaceHost) {
      return
    }

    // between the content with same width
    // - one space on the host between hal-width content
    // - no space in other places
    // between the content with different width
    // - 0/1 space on the host
    // - no space in other places
    if (contentTokenAfter.type === token.type) {
      // skip without custom option
      if (token.type === CharType.CONTENT_HALF) {
        if (!onlyOneBetweenHalfWidthContentOption) {
          return
        }
      } else {
        if (!noBetweenFullWidthContentOption) {
          return
        }
      }

      // set the space between
      tokenSeq.forEach((target) => {
        if (target === contentTokenAfter) {
          return
        }
        if (target === spaceHost) {
          checkSpaceAfter(
            target,
            token.type === CharType.CONTENT_HALF ? ' ' : '',
            '...'
          )
        } else {
          checkSpaceAfter(target, '', '....')
        }
      })
    } else {
      // skip without custom option
      if (typeof betweenMixedWidthContentOption === 'undefined') {
        return
      }

      // set the space between
      tokenSeq.forEach((target) => {
        if (target === spaceHost) {
          checkSpaceAfter(
            target,
            betweenMixedWidthContentOption ? ' ' : '',
            '...'
          )
        } else {
          checkSpaceAfter(target, '', '....')
        }
      })
    }
  }
}

export default generateHandler({
  spaceBetweenHalfWidthContent: true,
  noSpaceBetweenFullWidthContent: true,
  spaceBetweenMixedWidthContent: true
})
