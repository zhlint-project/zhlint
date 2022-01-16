import { ValidationTarget } from '../logger'
import { Handler } from '../parser'
import { removeValidation } from './util'

const handler: Handler = (token) => {
  if (token.spaceAfter && token.spaceAfter.match(/\n/)) {
    removeValidation(token, '', ValidationTarget.SPACE_AFTER)
    token.modifiedSpaceAfter = token.spaceAfter
  }
}

export default handler
