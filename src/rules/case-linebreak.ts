import { ValidationTarget } from '../report'
import { Handler, MutableToken as Token } from '../parser'
import { removeValidation } from './util'

const caseLinebreakHandler: Handler = (token: Token) => {
  if (token.spaceAfter && token.spaceAfter.match(/\n/)) {
    removeValidation(token, '', ValidationTarget.SPACE_AFTER)
    token.modifiedSpaceAfter = token.spaceAfter
  }
}

export default caseLinebreakHandler
