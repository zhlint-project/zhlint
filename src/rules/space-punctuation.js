const {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findContentTokenAfter,
  findNonMarkTokenBefore,
  findNonMarkTokenAfter,
  addValidation
} = require('./util')

const messages = {
  noBefore: 'There should be no space before a punctuation.',
  noAfter: 'There should be no space after a full-width punctuation.',
  oneAfter: 'There should be one space after a half-width punctuation.'
}

const validate = (token, type, condition) => {
  if (condition) {
    addValidation(token, 'space-punctuation', 'spaceAfter', messages[type])
  }
}

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
      validate(contentTokenBefore, 'noBefore', contentTokenBefore.rawSpaceAfter)
      contentTokenBefore.spaceAfter = ''
      const tokenBefore = findTokenBefore(group, token)
      if (tokenBefore !== contentTokenBefore) {
        validate(tokenBefore, 'noBefore', tokenBefore.rawSpaceAfter)
        tokenBefore.spaceAfter = ''
      }
    }
    // both sides non-empty
    if (nonMarkTokenBefore && nonMarkTokenAfter) {
      // no space when punctuation is full-width
      if (token.type === 'punctuation-full') {
        validate(token, 'noAfter', token.rawSpaceAfter && !token.rawType)
        token.spaceAfter = ''
        if (contentTokenAfter) {
          const before = findTokenBefore(group, contentTokenAfter)
          if (before !== token) {
            validate(before, 'noAfter', before.rawSpaceAfter && !before.rawType)
            before.spaceAfter = ''
          }
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
            validate(token, 'oneAfter', token.rawSpaceAfter !== ' ' && !token.rawType)
            token.spaceAfter = ' '
          } else {
            const before = findTokenBefore(group, contentTokenAfter)
            validate(before, 'oneAfter', before.rawSpaceAfter !== ' ' && !before.rawType)
            before.spaceAfter = ' '
          }
        }
      }
    }
  }
}
