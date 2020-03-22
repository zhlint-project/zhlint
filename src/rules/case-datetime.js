const {
  findTokenBefore,
  findNonMarkTokenBefore,
  findNonMarkTokenAfter
} = require('./util')

module.exports = (token, index, group, matched, marks) => {
  if (token.type.match(/^punctuation\-/) && token.raw === ':') {
    const tokenBefore = findTokenBefore(group, token)
    const nonMarkTokenBefore = findNonMarkTokenBefore(group, token)
    const nonMarkTokenAfter = findNonMarkTokenAfter(group, token)
    const tokenBeforeNonMarkTokenAfter = findTokenBefore(group, nonMarkTokenAfter)
    if (nonMarkTokenBefore
      && !nonMarkTokenBefore.rawSpaceAfter
      && tokenBefore
      && !tokenBefore.rawSpaceAfter
      && nonMarkTokenAfter
      && tokenBeforeNonMarkTokenAfter
      && !tokenBeforeNonMarkTokenAfter.rawSpaceAfter
      && !token.rawSpaceAfter
    ) {
      token.content = ':'
    }
  }
}
