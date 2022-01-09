import { removeValidation } from './util'

export default (token, index, group, matched, marks) => {
  if (token.rawSpaceAfter && token.rawSpaceAfter.match(/\n/)) {
    removeValidation(token, '', 'spaceAfter')
    token.spaceAfter = token.rawSpaceAfter
  }
}
