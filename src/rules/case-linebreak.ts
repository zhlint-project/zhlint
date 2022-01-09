const { removeValidation } = require('./util')

module.exports = (token, index, group, matched, marks) => {
  if (token.rawSpaceAfter && token.rawSpaceAfter.match(/\n/)) {
    removeValidation(token, '', 'spaceAfter')
    token.spaceAfter = token.rawSpaceAfter
  }
}
