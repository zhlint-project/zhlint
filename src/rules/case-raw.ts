const {
  findTokenBefore,
  findTokenAfter,
  removeValidation
} = require('./util')

module.exports = (token, index, group, matched, marks) => {
  if (token.type.match(/^punctuation\-/) && '/|'.indexOf(token.content) >= 0) {
    const tokenBefore = findTokenBefore(group, token)
    const tokenAfter = findTokenAfter(group, token)
    if (
      tokenBefore && tokenBefore.type === 'content-hyper' &&
      tokenAfter && tokenAfter.type === 'content-hyper'
    ) {
      removeValidation(tokenBefore, '', 'spaceAfter')
      removeValidation(token, '', 'spaceAfter')
      tokenBefore.spaceAfter = tokenBefore.rawSpaceAfter
      token.spaceAfter = token.rawSpaceAfter
    }
  }
}
