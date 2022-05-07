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
  isMarkdownOrHtmlPair,
  getMarkdownOrHtmlSide
} from './util'
import {
  Handler,
  MarkSideType,
  MutableGroupToken,
  MutableToken
} from '../parser'
import { MARKDOWN_NOSPACE_INSIDE } from './messages'

const generateHandler = (options: Options): Handler => {
  const noSpaceInsideMarkOption = options?.noSpaceInsideMark

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
    if (
      !isMarkdownOrHtmlPair(token) &&
      !isMarkdownOrHtmlPair(tokenAfter)
    ) {
      return
    }

    // 1. left x left, right x right
    // 2. left x non-mark
    // 3. non-mark x right
    const markSideBefore = getMarkdownOrHtmlSide(token)
    const markSideAfter = getMarkdownOrHtmlSide(tokenAfter)
    if (markSideBefore === markSideAfter) {
      checkSpaceAfter(token, '', MARKDOWN_NOSPACE_INSIDE)
    } else if (
      markSideBefore === MarkSideType.LEFT &&
      !isMarkdownOrHtmlPair(tokenAfter)
    ) {
      checkSpaceAfter(token, '', MARKDOWN_NOSPACE_INSIDE)
    } else if (
      markSideAfter === MarkSideType.RIGHT &&
      !isMarkdownOrHtmlPair(token)
    ) {
      checkSpaceAfter(token, '', MARKDOWN_NOSPACE_INSIDE)
    }
  }
}

export const defaultConfig: Options = {
  noSpaceInsideMark: true
}

export default generateHandler
