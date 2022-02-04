/**
 * This rule will decide whether to keep a space outside inline code like:
 * - xxx `foo` xxx
 * - xxx <code>foo</code> xxx
 * in markdown/html content.
 * 
 * Options:
 * - `true`: keep one space outside
 * - `false`: no space outside
 * - `undefined`: do nothing, just keep the original format
 */

import { addValidation, findContentTokenAfter, findContentTokenBefore, findTokenBefore, isInlineCode } from "./util";
import { Handler, MutableGroupToken, MutableToken } from "../parser";
import { ValidationTarget } from "../report";
import { hyperSpace as messages, MessageType } from "./messages";

const checkSpace = (token: MutableToken, side: 'before' | 'after', needSpace: boolean): void => {
  token.modifiedSpaceAfter = needSpace ? ' ' : ''
  if (token.modifiedSpaceAfter !== token.spaceAfter) {
    addValidation(
      token,
      MessageType.HYPER_SPACE,
      ValidationTarget.SPACE_AFTER,
      messages[`${side}-${needSpace}`]
    )
  }
}

export const generateHandler = (options: unknown): Handler => {
  const needSpace = !!options
  return (token: MutableToken, _, group: MutableGroupToken) => {
    // Do nothing if there is no options.
    if (typeof options === 'undefined') {
      return
    }
    // Do nothing if the current token is not inline code.
    if (!isInlineCode(token)) {
      return
    }
    // For inline code, make sure whether each side has content beside.
    // If it has, then ensure there is one or there is no space outside.
    if (findContentTokenBefore(group, token)) {
      const tokenBefore = findTokenBefore(group, token) as MutableToken
      checkSpace(tokenBefore, 'before', needSpace)
    }
    if (findContentTokenAfter(group, token)) {
      checkSpace(token, 'before', needSpace)
    }
  }
}

const handleHyperSpaceOption = generateHandler(true)

export default handleHyperSpaceOption
