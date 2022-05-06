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

import { Options, findTokenAfter, checkSpaceAfter } from './util'
import {
  Handler,
  isContentType,
  MutableGroupToken,
  MutableToken,
  SingleTokenType
} from '../parser'
import { CODE_NOSPACE_OUTSIDE, CODE_SPACE_OUTSIDE } from './messages'

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

    // skip non-after-token situations
    const tokenAfter = findTokenAfter(group, token)
    if (!tokenAfter) {
      return
    }

    // skip non-code situations
    if (
      token.type !== SingleTokenType.HYPER_CODE &&
      tokenAfter.type !== SingleTokenType.HYPER_CODE
    ) {
      return
    }

    // 1. code x code
    // 2. content x code, code x content
    if (token.type === token.type) {
      checkSpaceAfter(token, spaceAfter, message)
    } else if (isContentType(token.type) || isContentType(tokenAfter.type)) {
      checkSpaceAfter(token, spaceAfter, message)
    }
  }
  return handleHyperSpaceOption
}

export const defaultConfig: Options = {
  spaceOutsideCode: true
}

export default generateHandler
