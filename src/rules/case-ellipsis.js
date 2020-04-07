const {
  findTokenBefore,
  findTokenAfter,
  addValidation,
  removeValidation
} = require('./util')

const messages = {
  before: 'There should be no space before ellipsis',
  after: 'There should be no space after ellipsis'
}

const validate = (token, type, condition) => {
  if (condition) {
    addValidation(token, 'case-ellipsis', 'spaceAfter', messages[type])
  }
}

module.exports = (token, index, group, matched, marks) => {
  if (token.raw === '.') {
    const tokenBefore = findTokenBefore(group, token)
    if (!tokenBefore || tokenBefore.raw !== '.') {
      validate(tokenBefore, 'before', tokenBefore.rawSpaceAfter)
      tokenBefore.spaceAfter = ''
      let nextToken = findTokenAfter(group, token)
      if (nextToken && nextToken.raw === '.') {
        token.content = '.'
        removeValidation(token, '', 'content')
        while (nextToken && nextToken.raw === '.') {
          removeValidation(nextToken, '', 'content')
          removeValidation(nextToken, '', 'spaceAfter')
          const tempToken = findTokenAfter(group, nextToken)
          if (tempToken.raw !== '.') {
            validate(nextToken, 'after', nextToken.rawSpaceAfter)
          }
          nextToken.content = '.'
          nextToken.spaceAfter = ''
          nextToken = tempToken
        }
      }
    }
  }
}
