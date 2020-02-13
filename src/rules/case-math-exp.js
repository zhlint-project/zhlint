const {
  findTokenBefore,
  findContentTokenBefore,
  findContentTokenAfter,
  findNonMarkTokenBefore,
  findNonMarkTokenAfter
} = require('./util')

module.exports = (token, index, group, matched, marks) => {
  if (token.content && token.content.match(/^(\+|\-|\*|\/|\%|\=)\=?$/)) {
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
        contentTokenBefore.spaceAfter = ' '
        findTokenBefore(group, token).spaceAfter = ' '
        token.spaceAfter = ' '
        findTokenBefore(group, contentTokenAfter).spaceAfter = ' '
      }
    }
  }
}
