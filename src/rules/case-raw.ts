import { ValidationTarget } from '../report'
import {
  Handler,
  SingleTokenType,
  MutableGroupToken as GroupToken,
  MutableToken as Token
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
      tokenBefore.type === SingleTokenType.CONTENT_HYPER &&
      tokenAfter &&
      tokenAfter.type === SingleTokenType.CONTENT_HYPER
    ) {
      removeValidation(tokenBefore, '', ValidationTarget.SPACE_AFTER)
      removeValidation(token, '', ValidationTarget.SPACE_AFTER)
      tokenBefore.modifiedSpaceAfter = tokenBefore.spaceAfter
      token.modifiedSpaceAfter = token.spaceAfter
    }
  }
}

export default caseRawHandler
