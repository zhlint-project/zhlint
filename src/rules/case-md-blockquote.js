const { findTokenBefore } = require('./util')

module.exports = (token, index, group, matched, marks) => {
  if (token.content === '>') {
    const tokenBefore = findTokenBefore(group, token)
    if (tokenBefore.rawSpaceAfter === '\n') {
      tokenBefore.spaceAfter = tokenBefore.rawSpaceAfter
      token.spaceAfter = token.rawSpaceAfter
    }
  }
}
