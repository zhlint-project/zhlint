// examples:
// - *a*啊 -> *a*啊 -> *a* 啊
// - *a* 啊 -> *a* 啊
// - *a *啊 -> *a* 啊
// - a*啊* -> a*啊* -> a *啊*
// - a *啊* -> a *啊*
// - a* 啊* -> a *啊*
// - *啊*a -> *啊*a -> *啊* a
// - *啊* a -> *啊* a
// - *啊 *a -> *啊* a
// - 啊*a* -> 啊*a* -> 啊 *a*
// - 啊 *a* -> 啊 *a*
// - 啊* a* -> 啊 *a*

// TODO: revamp

const {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findContentTokenAfter,
  getMarkSide,
  addValidation
} = require('./util')

const messages = {
  noSpace: 'There should be no space between 2 full-width contents.',
  oneSpace: 'There should be a space between a half-width content and a full-width content.'
}

const validate = (token, type, condition) => {
  if (condition) {
    addValidation(token, 'space-full-width-content', 'spaceAfter', messages[type])
  }
}

module.exports = (token, index, group, matched, marks) => {
  // - if next content width different
  //   - if there is a mark
  //     - add a space outside mark
  //   - else
  //     - add a space between
  if (!token.type.match(/^content\-/)) {
    return
  }
  const contentTokenBefore = findContentTokenBefore(group, token)
  const contentTokenAfter = findContentTokenAfter(group, token)
  if (contentTokenAfter && contentTokenAfter.type === token.type) {
    if (token.type === 'content-full') {
      if (token.spaceAfter) {
        validate(token, 'noSpace', true)
        token.spaceAfter = ''
      }
      const tokenBeforeContentTokenAfter = findTokenBefore(group, contentTokenAfter)
      if (tokenBeforeContentTokenAfter.spaceAfter) {
        validate(token, 'noSpace', true)
        tokenBeforeContentTokenAfter.spaceAfter = ''
      }
    }
    return
  }
  if (contentTokenAfter && contentTokenAfter.type === 'content-hyper') {
    return
  }
  if (
    token.type === 'content-hyper'
  ) {
    if (
      token.content.match(/^<[^\/].+\/\s*>$/) ||
      token.content.match(/^<code.*>.*<\/code.*>$/)
    ) {
      // <.../>: nothing
    } else if (token.content.match(/^<[^\/].+>$/)) {
      // <...>: put space before if type different
      if (
        contentTokenBefore && contentTokenAfter &&
        contentTokenBefore.type !== contentTokenAfter.type
      ) {
        if (contentTokenBefore.spaceAfter !== ' ') {
          validate(contentTokenBefore, 'oneSpace', true)
          contentTokenBefore.spaceAfter = ' '
        }
      } else {
        if (contentTokenBefore && contentTokenBefore.spaceAfter) {
          validate(contentTokenBefore, 'noSpace', true)
          contentTokenBefore.spaceAfter = ''
        }
      }
    } else if (token.content.match(/^<\/.+>$/)) {
      // </...>: put space after if type different
      const tokenBeforeContentTokenAfter = findTokenBefore(group, contentTokenAfter)
      if (
        contentTokenBefore && contentTokenAfter
      ) {
        const spaceAfter = contentTokenBefore.type === contentTokenAfter.type ? '' : ' '
        if (spaceAfter && tokenBeforeContentTokenAfter.spaceAfter !== spaceAfter) {
          validate(tokenBeforeContentTokenAfter, 'oneSpace', true)
        }
        if (!spaceAfter && tokenBeforeContentTokenAfter.spaceAfter) {
          validate(tokenBeforeContentTokenAfter, 'noSpace', true)
        }
        tokenBeforeContentTokenAfter.spaceAfter = spaceAfter
      }
    }
    return
  }
  if (!contentTokenAfter) {
    return
  }
  const tokenAfter = findTokenAfter(group, token)
  if (tokenAfter === contentTokenAfter) {
    if (token.spaceAfter !== ' ') {
      addValidation(token, 'spaceAfter', 'space-full-width-content', messages.oneSpace)
    }
    token.spaceAfter = ' '
  } else {
    if (getMarkSide(tokenAfter) === 'left') {
      if (token.spaceAfter !== ' ') {
        addValidation(token, 'spaceAfter', 'space-full-width-content', messages.oneSpace)
      }
      token.spaceAfter = ' '
    } else {
      const tokenBeforeContentTokenAfter = findTokenBefore(group, contentTokenAfter)
      if (tokenBeforeContentTokenAfter.spaceAfter !== ' ') {
        addValidation(tokenBeforeContentTokenAfter, 'spaceAfter', 'space-full-width-content', messages.oneSpace)
      }
      tokenBeforeContentTokenAfter.spaceAfter = ' '
    }
  }
}
