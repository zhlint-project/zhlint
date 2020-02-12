const {
  findTokenBefore,
  findNonMarkTokenBefore,
  findNonMarkTokenAfter
} = require('./util')

module.exports = (token, index, group, matched, marks) => {
  if (token.raw === ':') {
    const tokenBefore = findTokenBefore(group, token)
    const nonMarkTokenBefore = findNonMarkTokenBefore(group, token)
    const nonMarkTokenAfter = findNonMarkTokenAfter(group, token)
    const tokenBeforeNonMarkTokenAfter = findTokenBefore(group, nonMarkTokenAfter)
    if (nonMarkTokenBefore
      && !nonMarkTokenBefore.spaceAfter
      && tokenBefore
      && !tokenBefore.spaceAfter
      && nonMarkTokenAfter
      && tokenBeforeNonMarkTokenAfter
      && !tokenBeforeNonMarkTokenAfter.spaceAfter
      && !token.spaceAfter
    ) {
      token.content = ':'
    }
  }
}
