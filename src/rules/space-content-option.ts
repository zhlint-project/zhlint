/**
 * @fileoverview
 * 
 * This rule is used to check whether there should be a space between
 * content.
 * 
 * Options:
 * - space.betweenWidthMixedContent: boolean | undefined
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
 * Examples (betweenWidthMixedContent = true):
 * - *a*啊 -> *a* 啊
 * - *a *啊 -> *a* 啊
 * - *啊*a -> *啊* a
 * - *啊 *a -> *啊* a
 * 
 * Examples (betweenWidthMixedContent = false):
 * - *a* 啊 -> *a*啊
 * - *a *啊 -> *a*啊
 * - *啊* a -> *啊*a
 * - *啊 *a -> *啊*a
 */

import { CharType, Handler, isContentType, MutableGroupToken, MutableToken } from "../parser"
import { findExpectedVisibleTokenAfter, findSpaceHostInHyperMarkSeq, Options } from "./util"

export const generateHandler = (options: Options): Handler => {
  const betweenWidthMixedContentOption = options?.space?.betweenWidthMixedContent
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
    const contentTokenAfterIndex = group.indexOf(contentTokenAfter)
    const tokenSeq = group.slice(index, contentTokenAfterIndex)
    const spaceHost = findSpaceHostInHyperMarkSeq(group, tokenSeq.slice(1))

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
      if (!noBetweenFullWidthContentOption) {
        return
      }
      tokenSeq.forEach((target) => {
        if ((token.type === CharType.CONTENT_HALF && target) === spaceHost) {
          target.modifiedSpaceAfter = ' '
        } else {
          target.modifiedSpaceAfter = ''
        }
      })
    } else {
      // skip without custom option
      if (typeof betweenWidthMixedContentOption === 'undefined') {
        return
      }
      tokenSeq.forEach((target) => {
        if (target === spaceHost) {
          target.modifiedSpaceAfter = betweenWidthMixedContentOption ? ' ' : ''
        } else {
          target.modifiedSpaceAfter = ''
        }
      })
    }
  }
}

export default generateHandler({
  space: {
    betweenWidthMixedContent: true,
    noBetweenFullWidthContent: true
  }
})
