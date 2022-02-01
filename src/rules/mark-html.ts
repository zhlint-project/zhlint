/**
 * Remove all SPACE_AFTER validations besides unexpected HTML tags.
 */

import { ValidationTarget } from '../report'
import {
  Handler,
  MutableGroupToken as GroupToken,
  MutableToken as Token
} from '../parser'
import {
  findTokenBefore,
  isUnexpectedHtmlTag,
  removeValidation
} from './util'

const markHyperHandler: Handler = (token: Token, _, group: GroupToken) => {
  if (isUnexpectedHtmlTag(token)) {
    const tokenBefore = findTokenBefore(group, token)
    if (tokenBefore) {
      removeValidation(tokenBefore, '', ValidationTarget.SPACE_AFTER)
      tokenBefore.modifiedSpaceAfter = tokenBefore.spaceAfter
    }
    removeValidation(token, '', ValidationTarget.SPACE_AFTER)
    token.modifiedSpaceAfter = token.spaceAfter
  }
}

export default markHyperHandler
