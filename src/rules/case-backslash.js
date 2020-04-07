const {
  findTokenBefore,
  findContentTokenBefore,
  findContentTokenAfter,
  findNonMarkTokenBefore,
  findNonMarkTokenAfter,
  addValidation,
  removeValidation
} = require('./util')

const messages = {
  before: 'There should be a space between full-width content and half-width content.'
}

const validate = (token, type, condition) => {
  removeValidation(token, 'space-punctuation', 'spaceAfter')
  if (condition) {
    addValidation(token, 'case-backslash', 'spaceAfter', messages[type])
  }
}

module.exports = (token, index, group, matched, marks) => {
  // half width and no raw space after -> no space after
  // full width before -> one space before
  if (token.type.match(/^punctuation\-/) && token.content === '\\') {
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    if (contentTokenAfter) {
      const tokenBeforeContentTokenAfter = findTokenBefore(group, contentTokenAfter)
      if (
        contentTokenAfter &&
        contentTokenAfter.type.match(/\-half*/) &&
        !token.rawSpaceAfter &&
        !tokenBeforeContentTokenAfter.rawSpaceAfter
      ) {
        removeValidation(token, 'space-punctuation', 'spaceAfter')
        removeValidation(tokenBeforeContentTokenAfter, 'space-punctuation', 'spaceAfter')
        token.spaceAfter = tokenBeforeContentTokenAfter.spaceAfter = ''
        if (contentTokenBefore) {
          const tokenBefore = findTokenBefore(group, token)
          if (
            contentTokenBefore &&
            contentTokenBefore.type.match(/\-full*/)
          ) {
            if (tokenBefore === contentTokenBefore) {
              validate(tokenBefore, 'before', tokenBefore.rawSpaceAfter !== ' ')
              tokenBefore.spaceAfter = ' '
            } else {
              if (tokenBefore.markSide === 'left') {
                validate(tokenBefore, 'before', tokenBefore.rawSpaceAfter !== ' ')
                tokenBefore.spaceAfter = ' '
              } else {
                validate(contentTokenBefore, 'before', contentTokenBefore.rawSpaceAfter !== ' ')
                contentTokenBefore.spaceAfter = ' '
              }
            }
          }
        }
      }
    }
  }
}
