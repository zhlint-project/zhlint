const {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findContentTokenAfter,
  findNonMarkTokenBefore,
  findNonMarkTokenAfter
} = require('./util')

module.exports = (token, index, group, matched, marks) => {
  // token is a punctuation between 2 contents
  // (exception: between 2 half-width content)
  // full-width -> no space
  // half-width -> one space after
  if (token.type.match(/^punctuation\-/)) {
    if ('/[&%-'.indexOf(token.content) >= 0) {
      return
    }
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    const nonMarkTokenBefore = findNonMarkTokenBefore(group, token)
    const nonMarkTokenAfter = findNonMarkTokenAfter(group, token)
    // no space before punctuation
    if (contentTokenBefore) {
      contentTokenBefore.spaceAfter = ''
      findTokenBefore(group, token).spaceAfter = ''
    }
    // both sides non-empty
    if (nonMarkTokenBefore && nonMarkTokenAfter) {
      // no space when punctuation is full-width
      if (token.type === 'punctuation-full') {
        token.spaceAfter = ''
        if (contentTokenAfter) {
          findTokenBefore(group, contentTokenAfter).spaceAfter = ''
        }
      } else {
        if (
          contentTokenBefore &&
          contentTokenAfter &&
          (
            contentTokenBefore.type === 'content-full' ||
            contentTokenAfter.type === 'content-full'
          )
        ) {
          // one space when punctuation is half-width and
          // either side of content is full-width content
          const tokenAfter = findTokenAfter(group, token)
          if (tokenAfter === contentTokenAfter) {
            token.spaceAfter = ' '
          } else {
            findTokenBefore(group, contentTokenAfter).spaceAfter = ' '
          }
        }
      }
    }
  }
}
