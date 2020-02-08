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
  const contentTokenAfter = findContentTokenAfter(group, token)
  if (!contentTokenAfter) {
    return
  }
  if (contentTokenAfter.type === token.type) {
    return
  }
  const tokenAfter = findTokenAfter(group, token)
  if (tokenAfter === contentTokenAfter) {
    token.spaceAfter = ' '
  } else {
    if (tokenAfter.markSide === 'left') {
      token.spaceAfter = ' '
    } else {
      findTokenBefore(contentTokenAfter).spaceAfter = ' '
    }
  }
}
