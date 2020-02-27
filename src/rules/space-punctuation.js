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
    if ('/[&%'.indexOf(token.content) >= 0) {
      return
    }
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    if (
      contentTokenBefore && contentTokenBefore.type === 'content-half' &&
      contentTokenAfter && contentTokenAfter.type === 'content-half'
    ) {
      return
    }
    if (contentTokenBefore) {
      contentTokenBefore.spaceAfter = ''
      findTokenBefore(group, token).spaceAfter = ''
    }
    if (contentTokenBefore && contentTokenAfter
      && (contentTokenBefore.type !== 'content-half'
        || contentTokenAfter.type !== 'content-half')
    ) {
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
