import {
  Handler,
  isLegacyHyperContentType,
  MutableGroupToken as GroupToken,
  MutableToken as Token
} from '../parser'
import { findTokenBefore } from './util'

const caseHtmlSpaceHandler: Handler = (token: Token, _, group: GroupToken) => {
  if (isLegacyHyperContentType(token.type)) {
    if (
      token.content.match(/^<(b|i|u|s|strong|em|strike|del|sub|sup)(\s.*)?>$/)
    ) {
      // <...>
      const tokenBefore = findTokenBefore(group, token)
      if (tokenBefore) {
        tokenBefore.modifiedSpaceAfter = ' '
      }
    } else if (
      token.content.match(/^<\/(b|i|u|s|strong|em|strike|del|sub|sup)(\s.*)?>$/)
    ) {
      // </...>
      token.modifiedSpaceAfter = ' '
    }
  }
}

export default caseHtmlSpaceHandler
