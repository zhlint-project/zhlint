const {
  findTokenBefore,
  findTokenAfter
} = require('./util')

module.exports = (token, index, group, matched, marks) => {
  if ('/|'.indexOf(token.content) >= 0) {
    const tokenBefore = findTokenBefore(group, token)
    const tokenAfter = findTokenAfter(group, token)
    if (
      tokenBefore && tokenBefore.type === 'content-hyper' &&
      tokenAfter && tokenAfter.type === 'content-hyper'
    ) {
      tokenBefore.spaceAfter = tokenBefore.rawSpaceAfter
      token.spaceAfter = token.rawSpaceAfter
    }
  }
}
