/**
 * @fileoverview
 *
 * This rule will decide whether to keep a space outside inline code with
 * content like:
 * - xxx `foo` xxx
 * - xxx <code>foo</code> xxx
 * in markdown/html.
 *
 * Options:
 * - spaceOutsideCode: boolean | undefined
 *   - `true`: keep one space outside (default)
 *   - `false`: no space outside
 *   - `undefined`: do nothing, just keep the original format
 *
 * Note:
 * This rule just simply add one more space outside the inline code. However,
 * the space might not be the proper position since there might be some quotes,
 * brackets, marks between the inline code and the content, which should
 * involve another following rule called `hyper-space-position` to handle.
 */

import {
  findNonHyperVisibleTokenAfter,
  findNonHyperVisibleTokenBefore,
  Options,
  findMarkSeqBetween,
  checkSpaceAfter
} from './util'
import {
  Handler,
  MutableGroupToken,
  MutableToken,
  SingleTokenType
} from '../parser'

export const generateHandler = (options: Options): Handler => {
  const needSpaceOption = options?.spaceOutsideCode
  const handleHyperSpaceOption: Handler = (
    token: MutableToken,
    _,
    group: MutableGroupToken
  ) => {
    // Do nothing if there is no options.
    if (typeof needSpaceOption === 'undefined') {
      return
    }

    // Do nothing if the current token is not inline code.
    if (token.type !== SingleTokenType.HYPER_CODE) {
      return
    }

    // For inline code, make sure whether each side has besides:
    // - content
    // - punctuation
    // - brackets
    // - quotes
    // If it has, then ensure there is one or there is no space outside
    // when it's a content token.
    const nonHyperVisibleTokenBefore = findNonHyperVisibleTokenBefore(
      group,
      token
    )
    if (nonHyperVisibleTokenBefore) {
      const { spaceHost, tokenSeq } = findMarkSeqBetween(group, nonHyperVisibleTokenBefore, token)
      if (spaceHost) {
        tokenSeq.forEach(target => {
          if (target === spaceHost) {
            checkSpaceAfter(target, needSpaceOption ? ' ' : '', '.')
          } else {
            target.modifiedSpaceAfter = ''
            checkSpaceAfter(target, '', '..')
          }
        })
      }
    }

    const nonHyperVisibleTokenAfter = findNonHyperVisibleTokenAfter(
      group,
      token
    )
    if (nonHyperVisibleTokenAfter) {
      const { spaceHost, tokenSeq } = findMarkSeqBetween(
        group,
        token,
        nonHyperVisibleTokenAfter
      )
      if (spaceHost) {
        tokenSeq.forEach((target) => {
          if (target === spaceHost) {
            target.modifiedSpaceAfter = needSpaceOption ? ' ' : ''
          } else {
            target.modifiedSpaceAfter = ''
          }
        })
      }
    }
  }
  return handleHyperSpaceOption
}

export default generateHandler({
  spaceOutsideCode: true
})
