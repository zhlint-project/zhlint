const {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findContentTokenAfter,
  findNonMarkTokenBefore,
  findNonMarkTokenAfter,
  addValidation,
  removeValidation
} = require('./util')

const messages = {
  before: char => `There should be a space before the '${char}' character.`,
  after: char => `There should be a space after the '${char}' character.`
}

const validate = (token, type, char, condition) => {
  removeValidation(token, 'space-punctuation', 'spaceAfter')
  if (condition) {
    addValidation(token, 'case-math-exp', 'spaceAfter', messages[type](char))
  }
}

module.exports = (token, index, group, matched, marks) => {
  // calculation: space in both sides
  // - 1 + 1 = 2
  // x 2020/01/01
  // x 2020-01-01
  // x vue-custom-element
  // x 100%
  // x a/b
  // x Chrome 53+
  if (token.type.match(/^punctuation\-/) && token.content && token.content.match(/^(\+|\-|\*|\/|\%|\<|\>|\=)\=?$/)) {
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    if (contentTokenBefore && contentTokenAfter) {
      if (
        contentTokenBefore.content.match(/^[\d\.]+$/) &&
        contentTokenAfter.content.match(/^[\d\.]+$/)
      ) {
        if (
          token.content === '/' &&
          (
            findNonMarkTokenBefore(group, contentTokenBefore).content === '/' ||
            findNonMarkTokenAfter(group, contentTokenAfter).content === '/'
          )
        ) {
          return
        }
        if (
          token.content === '-' &&
          (
            findNonMarkTokenBefore(group, contentTokenBefore).content === '-' ||
            findNonMarkTokenAfter(group, contentTokenAfter).content === '-'
          )
        ) {
          return
        }
      } else if (token.content === '-') {
        return
      }
      if ('\/%'.indexOf(token.content) >= 0) {
        return
      }
      if (
        '+-'.indexOf(token.content) >= 0 &&
        !contentTokenBefore.rawSpaceAfter &&
        token.rawSpaceAfter
      ) {
        return
      }
      validate(contentTokenBefore, 'before', token.content, contentTokenBefore.rawSpaceAfter !== ' ')
      contentTokenBefore.spaceAfter = ' '
      const tokenBefore = findTokenBefore(group, token)
      if (tokenBefore !== contentTokenBefore) {
        validate(tokenBefore, 'before', token.content, tokenBefore.rawSpaceAfter !== ' ')
        tokenBefore.spaceAfter = ' '
      }
      validate(token, 'after', token.content, token.rawSpaceAfter !== ' ')
      token.spaceAfter = ' '
      const tokenBeforeContentTokenAfter = findTokenBefore(group, contentTokenAfter)
      if (tokenBeforeContentTokenAfter !== token) {
        validate(tokenBeforeContentTokenAfter, 'after', token.content, tokenBeforeContentTokenAfter.rawSpaceAfter !== ' ')
        tokenBeforeContentTokenAfter.spaceAfter = ' '
      }
    }
  }
  // vertical lines: space in neither sides (no space detected around)
  // or both sides (otherwise)
  // - a | b | c
  // - a || b || c
  // x a|b|c
  if (token.type === 'punctuation-half' && token.content === '|') {
    const tokenBefore = findTokenBefore(group, token)
    if (tokenBefore.content !== '|') {
      const tokens = []
      let nextToken = token
      while (nextToken && nextToken.content === '|') {
        tokens.push(nextToken)
        nextToken = findTokenAfter(group, nextToken)
      }
      const lastToken = tokens[tokens.length - 1]
      if (tokenBefore.rawSpaceAfter || lastToken.rawSpaceAfter) {
        validate(tokenBefore, 'before', tokenBefore.rawSpaceAfter !== ' ')
        validate(lastToken, 'after', lastToken.rawSpaceAfter !== ' ')
        tokenBefore.spaceAfter = lastToken.spaceAfter = ' '
      } else {
        removeValidation(tokenBefore, 'space-punctuation', 'spaceAfter')
        removeValidation(lastToken, 'space-punctuation', 'spaceAfter')
        tokenBefore.spaceAfter = lastToken.spaceAfter = ''
      }
    }
  }
}
