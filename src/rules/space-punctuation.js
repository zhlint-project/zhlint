const {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findContentTokenAfter
} = require('./util')

module.exports = (token, index, group, matched, marks) => {
  // token is a punctuation between 2 contents
  // (exception: between 2 half-width content)
  // full-width -> no space
  // half-width -> one space after
  if (token.type.match(/^punctuation\-/)) {
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    if (contentTokenBefore && contentTokenAfter
      && contentTokenBefore.type.match(/^content\-/)
      && contentTokenAfter.type.match(/^content\-/)
      && (
        contentTokenBefore.type !== 'content-half'
        || contentTokenAfter.type !== 'content-half'
      )
    ) {
      contentTokenBefore.spaceAfter = ''
      findTokenBefore(group, token).spaceAfter = ''
      if (token.type === 'punctuation-half') {
        const tokenAfter = findTokenAfter(group, token)
        if (tokenAfter === contentTokenAfter) {
          token.spaceAfter = ' '
        } else {
          findTokenBefore(group, contentTokenAfter).spaceAfter = ' '
        }
      }
      if (token.type === 'punctuation-full') {
        token.spaceAfter = ''
        findTokenBefore(group, contentTokenAfter).spaceAfter = ''
      }
    }
  }
}
