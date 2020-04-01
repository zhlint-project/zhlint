const {
  findTokenBefore,
  findContentTokenBefore,
  findContentTokenAfter,
  findNonMarkTokenBefore,
  findNonMarkTokenAfter
} = require('./util')

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
        token.spaceAfter = tokenBeforeContentTokenAfter.spaceAfter = ''
        if (contentTokenBefore) {
          const tokenBefore = findTokenBefore(group, token)
          if (
            contentTokenBefore &&
            contentTokenBefore.type.match(/\-full*/)
          ) {
            contentTokenBefore.spaceAfter = tokenBefore.spaceAfter = ' '
          }
        }
      }
    }
  }
}
