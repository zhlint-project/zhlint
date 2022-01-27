import { ValidationTarget } from '../logger'
import { Handler, MutableToken as Token } from '../parser'
import { removeValidation } from './util'

const handler: Handler = (token: Token) => {
  if (token.spaceAfter && token.spaceAfter.match(/\n/)) {
    removeValidation(token, '', ValidationTarget.SPACE_AFTER)
    token.modifiedSpaceAfter = token.spaceAfter
  }
}

export default handler
