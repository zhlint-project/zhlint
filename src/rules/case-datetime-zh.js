const {
  findTokenBefore,
  findContentTokenBefore,
  findContentTokenAfter,
} = require('./util')

module.exports = (token, index, group, matched, marks) => {
  if (token.type === 'content-half') {
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    if (
      (
        !contentTokenBefore ||
        contentTokenBefore.type === 'content-full'
      ) &&
      contentTokenAfter &&
      contentTokenAfter.content.match(/^[年月日天号时分秒]$/)
    ) {
      if (contentTokenBefore) {
        contentTokenBefore.spaceAfter = ''
        findTokenBefore(group, token).spaceAfter = ''
      }
      token.spaceAfter = ''
      findTokenBefore(group, contentTokenAfter).spaceAfter = ''
    }
  }
}
