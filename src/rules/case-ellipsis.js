const {
  findTokenBefore,
  findTokenAfter
} = require('./util')

module.exports = (token, index, group, matched, marks) => {
  if (token.raw === '.') {
    const tokenBefore = findTokenBefore(group, token)
    if (!tokenBefore || tokenBefore.raw !== '.') {
      let nextToken = findTokenAfter(group, token)
      if (nextToken && nextToken.raw === '.') {
        token.content = '.'
        while (nextToken && nextToken.raw === '.') {
          nextToken.content = '.'
          nextToken.spaceAfter = ''
          nextToken = findTokenAfter(group, nextToken)
        }
      }
    }
  }
}
