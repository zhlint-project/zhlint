/**
 * @fileoverview
 * 
 * This rule is used to check whether there should be a space between
 * content.
 * 
 * Options:
 * - space.onlyOneBetweenHalfWidthContentOption: boolean | undefined
 *   - `true`: ensure one space between half-width content (default)
 *   - `false` or `undefined`: do nothing, just keep the original format
 * - space.betweenMixedWidthContent: boolean | undefined
 *   - `true`: keep one space between width-mixed content (default)
 *   - `false`: no space between width-mixed content
 *   - `undefined`: do nothing, just keep the original format
 * - space.noBetweenFullWidthContent: boolean | undefined
 *   - `true`: remove the space between full-width content (default)
 *   - `false` or `undefined`: do nothing, just keep the original format
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

import { CharType, Handler, isContentType, MutableGroupToken, MutableToken } from "../parser"
import { findExpectedVisibleTokenAfter, findSpaceHostInHyperMarkSeq, Options } from "./util"

export const generateHandler = (options: Options): Handler => {
  const onlyOneBetweenHalfWidthContentOption = options?.space?.onlyOneBetweenHalfWidthContent
  const betweenMixedWidthContentOption = options?.space?.betweenMixedWidthContent
  const noBetweenFullWidthContentOption = options?.space?.noBetweenFullWidthContent

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

    // get the space host
    // the `tokenSeq` include the token itself and exclude the next content token
    // so the `markSeq` should be one off from the beginning of tokenSeq
    // if the `markSeq` is empty, the spaceHost should be the token itself
    // the `tokenSeq` and `spaceHost` are also to be travelled later
    const contentTokenAfterIndex = group.indexOf(contentTokenAfter)
    const tokenSeq = group.slice(index, contentTokenAfterIndex)
    const markSeq = tokenSeq.slice(1)
    const spaceHost = tokenSeq.length > 1 ? findSpaceHostInHyperMarkSeq(group, markSeq) : token

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
          target.modifiedSpaceAfter =
            token.type === CharType.CONTENT_HALF ? ' ' : ''
        } else {
          target.modifiedSpaceAfter = ''
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
          target.modifiedSpaceAfter = betweenMixedWidthContentOption ? ' ' : ''
        } else {
          target.modifiedSpaceAfter = ''
        }
      })
    }
  }
}

export default generateHandler({
  space: {
    onlyOneBetweenHalfWidthContent: true,
    betweenMixedWidthContent: true,
    noBetweenFullWidthContent: true
  }
})
