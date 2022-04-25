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
 * - hyper.codeSpace: boolean | undefined
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
  addValidation,
  hasSpaceInHyperMarkSeq,
  findHyperMarkSeq,
  findNonHyperVisibleTokenAfter,
  findNonHyperVisibleTokenBefore,
  findSpaceHostInHyperMarkSeq,
  findTokenBefore,
  findTokenAfter,
  Options
} from './util'
import {
  Handler,
  isContentType,
  MutableGroupToken,
  MutableToken,
  SingleTokenType
} from '../parser'
import { ValidationTarget } from '../report'
import { hyperSpace as messages, MessageType } from './messages'

const checkSpace = (
  token: MutableToken,
  side: 'before' | 'after',
  isContentBeside: boolean,
  needSpaceOption: boolean
): void => {
  const actuallyNeedSpace = isContentBeside && needSpaceOption
  token.modifiedSpaceAfter = actuallyNeedSpace ? ' ' : ''
  if (token.modifiedSpaceAfter !== token.spaceAfter) {
    addValidation(
      token,
      MessageType.HYPER_SPACE,
      ValidationTarget.SPACE_AFTER,
      messages[`${side}-${isContentBeside}-${actuallyNeedSpace}`]
    )
  }
}

const checkOutsideSpace = (
  token: MutableToken,
  isContentBeside: boolean,
  needSpaceOption: boolean
): void => {
  if (isContentBeside && needSpaceOption) {
    token.modifiedSpaceAfter = ' '
    addValidation(
      token,
      MessageType.HYPER_SPACE,
      ValidationTarget.SPACE_AFTER,
      messages.outside
    )
  }
}

const checkInsideSpace = (token: MutableToken): void => {
  token.modifiedSpaceAfter = ''
  addValidation(
    token,
    MessageType.HYPER_SPACE,
    ValidationTarget.SPACE_AFTER,
    messages.inside
  )
}

const checkSpaceInHyperMarkSeq = (
  side: 'before' | 'after',
  group: MutableGroupToken,
  hyperMark: MutableToken,
  isContentBeside: boolean,
  needSpaceOption: boolean
) => {
  const hyperMarkSeq = findHyperMarkSeq(group, hyperMark)
  const spaceHost = findSpaceHostInHyperMarkSeq(group, hyperMarkSeq)
  if (spaceHost) {
    hyperMarkSeq.forEach((hyperMark) => {
      // hasSpace x spaceHost -> check space | check outside
      // hasSpace x !spaceHost -> check inside | correct
      // !hasSpace x spaceHost -> check space
      // !hasSpace x !spaceHost -> correct
      const hasSpace = hasSpaceInHyperMarkSeq(group, hyperMarkSeq)
      if (!hasSpace) {
        if (hyperMark === spaceHost) {
          checkSpace(hyperMark, side, isContentBeside, needSpaceOption)
        }
      } else {
        if (hyperMark === spaceHost) {
          if (hyperMark.modifiedSpaceAfter) {
            checkSpace(hyperMark, side, isContentBeside, needSpaceOption)
          } else {
            checkOutsideSpace(hyperMark, isContentBeside, needSpaceOption)
          }
        } else {
          if (spaceHost.modifiedSpaceAfter) {
            checkInsideSpace(hyperMark)
          }
        }
      }
    })
  }
}

export const generateHandler = (options: Options): Handler => {
  const needSpaceOption = options?.hyper?.codeSpace
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
      const isContentBefore = isContentType(nonHyperVisibleTokenBefore.type)
      const tokenBefore = findTokenBefore(group, token) as MutableToken
      if (tokenBefore.type === SingleTokenType.MARK_HYPER) {
        checkSpaceInHyperMarkSeq(
          'before',
          group,
          tokenBefore,
          isContentBefore,
          needSpaceOption
        )
      } else {
        checkSpace(tokenBefore, 'before', isContentBefore, needSpaceOption)
      }
    }

    const nonHyperVisibleTokenAfter = findNonHyperVisibleTokenAfter(
      group,
      token
    )
    if (nonHyperVisibleTokenAfter) {
      const isContentAfter = isContentType(nonHyperVisibleTokenAfter.type)
      const tokenAfter = findTokenAfter(group, token) as MutableToken
      if (tokenAfter.type === SingleTokenType.MARK_HYPER) {
        checkSpaceInHyperMarkSeq(
          'after',
          group,
          tokenAfter,
          isContentAfter,
          needSpaceOption
        )
      } else {
        checkSpace(token, 'after', isContentAfter, needSpaceOption)
      }
    }
  }
  return handleHyperSpaceOption
}

const handleHyperSpaceOption = generateHandler({
  hyper: {
    codeSpace: true
  }
})

export default handleHyperSpaceOption
