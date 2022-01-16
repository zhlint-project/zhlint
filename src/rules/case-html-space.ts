import { Handler } from '../parser'
import { findTokenBefore } from './util'

const handler: Handler = (token, _, group) => {
  if (token.type === 'content-hyper') {
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

export default handler
