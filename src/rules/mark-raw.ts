/**
 * simply add space(s) outside the raw token
 * 
 * further todos:
 * - if the non-mark token before/after the token are not content, the spaces
 * need to re-treated based on other rules
 *
 * target token:
 * - `xxx`
 * - <code>xxx</code>
 * 
 * result:
 * - this is `xxx` on the left
 *          ^     ^
 * - this is <code>xxx</code> on the left
 *          ^                ^
 */

import { ValidationTarget } from '../logger'
import {
  Handler,
  MutableGroupToken as GroupToken,
  MutableToken as Token
} from '../parser'
import { isInlineCode, addValidation, findTokenBefore, findTokenAfter } from './util'

const messages = {
  before: 'There should be a space before a piece of inline code.',
  after: 'There should be a space after a piece of inline code.'
}

const validate = (token: Token, type: string, condition: boolean): void => {
  if (condition) {
    addValidation(
      token,
      'mark-raw',
      ValidationTarget.SPACE_AFTER,
      messages[type]
    )
  }
}

const addSpaceOutside = (
  group: GroupToken,
  token: Token
): void => {
  const tokenBefore = findTokenBefore(group, token)
  const tokenAfter = findTokenAfter(group, token)
  if (tokenBefore) {
    validate(tokenBefore, 'before', tokenBefore.modifiedSpaceAfter !== ' ')
    tokenBefore.modifiedSpaceAfter = ' '
  }
  if (tokenAfter) {
    validate(token, 'after', token.modifiedSpaceAfter !== ' ')
    token.modifiedSpaceAfter = ' '
  }
}

const handler: Handler = (token: Token, _, group: GroupToken) => {
  if (isInlineCode(token)) {
    addSpaceOutside(group, token)
  }
}

export default handler
