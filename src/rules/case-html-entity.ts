import { ValidationTarget } from '../logger'
import {
  CharType,
  Handler,
  MutableGroupToken as GroupToken,
  MutableToken as Token
} from '../parser'
import { findTokenBefore, removeValidation } from './util'

const handler: Handler = (token: Token, _, group: GroupToken) => {
  if (token.content === ';') {
    const tokenBefore = findTokenBefore(group, token)
    if (
      tokenBefore &&
      tokenBefore.type === CharType.CONTENT_HALF &&
      !tokenBefore.spaceAfter
    ) {
      const tokenBeforeBefore = findTokenBefore(group, tokenBefore)
      if (
        tokenBeforeBefore &&
        tokenBeforeBefore.content === '&' &&
        !tokenBeforeBefore.spaceAfter
      ) {
        removeValidation(token, 'unify-punctuation', ValidationTarget.CONTENT)
        token.modifiedContent = ';'
        token.modifiedSpaceAfter = token.spaceAfter
      }
    }
  }
}

export default handler
