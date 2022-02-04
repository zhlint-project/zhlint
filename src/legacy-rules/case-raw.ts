import { ValidationTarget } from '../report'
import {
  Handler,
  MutableGroupToken as GroupToken,
  MutableToken as Token,
  isHyperContentType
} from '../parser'
import { findTokenBefore, findTokenAfter, removeValidation } from './util'

const caseRawHandler: Handler = (token: Token, _, group: GroupToken) => {
  if (
    token.type.match(/^punctuation-/) &&
    '/|'.indexOf(token.modifiedContent || token.content) >= 0
  ) {
    const tokenBefore = findTokenBefore(group, token)
    const tokenAfter = findTokenAfter(group, token)
    if (
      tokenBefore &&
      isHyperContentType(tokenBefore.type) &&
      tokenAfter &&
      isHyperContentType(tokenAfter.type)
    ) {
      removeValidation(tokenBefore, '', ValidationTarget.SPACE_AFTER)
      removeValidation(token, '', ValidationTarget.SPACE_AFTER)
      tokenBefore.modifiedSpaceAfter = tokenBefore.spaceAfter
      token.modifiedSpaceAfter = token.spaceAfter
    }
  }
}

export default caseRawHandler
