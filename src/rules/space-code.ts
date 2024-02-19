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
 * Details:
 * - code x code
 * - content x code
 * - code x content
 */

import {
  Options,
  checkSpaceAfter,
  findVisibleTokenAfter,
  findVisibleTokenBefore,
  findWrappersBetween
} from './util.js'
import {
  Handler,
  isLetterType,
  MutableGroupToken,
  MutableToken,
  HyperTokenType
} from '../parser/index.js'
import { CODE_NOSPACE_OUTSIDE, CODE_SPACE_OUTSIDE } from './messages.js'

const generateHandler = (options: Options): Handler => {
  const needSpaceOption = options?.spaceOutsideCode
  const spaceAfter = needSpaceOption ? ' ' : ''
  const message = needSpaceOption ? CODE_SPACE_OUTSIDE : CODE_NOSPACE_OUTSIDE
  const handleHyperSpaceOption: Handler = (
    token: MutableToken,
    _,
    group: MutableGroupToken
  ) => {
    // skip if there is no options
    if (typeof needSpaceOption === 'undefined') {
      return
    }

    // skip non-code tokens
    if (token.type !== HyperTokenType.CODE_CONTENT) {
      return
    }

    // skip non-after-token situations
    const contentTokenBefore = findVisibleTokenBefore(group, token)
    const contentTokenAfter = findVisibleTokenAfter(group, token)
    const { spaceHost: beforeSpaceHost } = findWrappersBetween(
      group,
      contentTokenBefore,
      token
    )
    const { spaceHost: afterSpaceHost } = findWrappersBetween(
      group,
      token,
      contentTokenAfter
    )

    // content x code
    if (contentTokenBefore && isLetterType(contentTokenBefore.type)) {
      beforeSpaceHost && checkSpaceAfter(beforeSpaceHost, spaceAfter, message)
    }
    // code x content or code x code
    if (
      contentTokenAfter &&
      (isLetterType(contentTokenAfter.type) ||
        contentTokenAfter.type === HyperTokenType.CODE_CONTENT)
    ) {
      afterSpaceHost && checkSpaceAfter(afterSpaceHost, spaceAfter, message)
    }
  }
  return handleHyperSpaceOption
}

export const defaultConfig: Options = {
  spaceOutsideCode: true
}

export default generateHandler
