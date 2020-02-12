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

const {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findContentTokenAfter
} = require('./util')

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
        contentTokenBefore.spaceAfter = ' '
      } else {
        if (contentTokenBefore) {
          contentTokenBefore.spaceAfter = ''
        }
      }
    } else if (token.content.match(/^<\/.+>$/)) {
      // </...>: put space after if type different
      const tokenBeforeContentTokenAfter = findTokenBefore(group, contentTokenAfter)
      if (
        contentTokenBefore && contentTokenAfter &&
        contentTokenBefore.type !== contentTokenAfter.type
      ) {
        tokenBeforeContentTokenAfter.spaceAfter = ' '
      } else {
        if (tokenBeforeContentTokenAfter) {
          tokenBeforeContentTokenAfter.spaceAfter = ''
        }
      }
    }
    return
  }
  if (!contentTokenAfter) {
    return
  }
  const tokenAfter = findTokenAfter(group, token)
  if (tokenAfter === contentTokenAfter) {
    token.spaceAfter = ' '
  } else {
    if (tokenAfter.markSide === 'left') {
      token.spaceAfter = ' '
    } else {
      findTokenBefore(group, contentTokenAfter).spaceAfter = ' '
    }
  }
}
