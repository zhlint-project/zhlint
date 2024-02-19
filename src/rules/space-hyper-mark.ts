/**
 * @fileoverview
 *
 * This rule is to ensure all the existing spaces should be outside hyper
 * marks like *, _, [, ], etc.
 *
 * Options:
 * - noSpaceInsideMark: boolean | undefined
 *
 * For example:
 * - `x _ ** yyy ** _ z` should be `x _**yyy**_ z`
 *
 * Details:
 * - left-mark x left-mark: `x _ **yyy**_ z`
 *                             ^^^
 * - right-mark x right-mark: `x _**yyy** _ z`
 *                                      ^^^
 * - left-mark x non-mark: `x _** yyy**_ z`
 *                              ^^^
 * - non-mark x right-mark: `x _**yyy **_ z`
 *                                 ^^^
 */

import {
  Options,
  checkSpaceAfter,
  findTokenAfter,
  isWrapper,
  getWrapperSide
} from './util.js'
import {
  Handler,
  MarkSideType,
  MutableGroupToken,
  MutableToken
} from '../parser/index.js'
import { MARKDOWN_NOSPACE_INSIDE } from './messages.js'

const generateHandler = (options: Options): Handler => {
  const noSpaceInsideMarkOption = options?.noSpaceInsideHyperMark

  return (token: MutableToken, _, group: MutableGroupToken) => {
    // skip if there is no options
    if (!noSpaceInsideMarkOption) {
      return
    }

    // skip non-after-token situations
    const tokenAfter = findTokenAfter(group, token)
    if (!tokenAfter) {
      return
    }

    // skip non-mark situations
    if (!isWrapper(token) && !isWrapper(tokenAfter)) {
      return
    }

    // 1. left x left, right x right
    // 2. left x non-mark
    // 3. non-mark x right
    const markSideBefore = getWrapperSide(token)
    const markSideAfter = getWrapperSide(tokenAfter)
    if (markSideBefore === markSideAfter) {
      checkSpaceAfter(token, '', MARKDOWN_NOSPACE_INSIDE)
    } else if (markSideBefore === MarkSideType.LEFT && !isWrapper(tokenAfter)) {
      checkSpaceAfter(token, '', MARKDOWN_NOSPACE_INSIDE)
    } else if (markSideAfter === MarkSideType.RIGHT && !isWrapper(token)) {
      checkSpaceAfter(token, '', MARKDOWN_NOSPACE_INSIDE)
    }
  }
}

export const defaultConfig: Options = {
  noSpaceInsideMark: true
}

export default generateHandler
