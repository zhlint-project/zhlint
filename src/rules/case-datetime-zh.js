const {
  findTokenBefore,
  findContentTokenBefore,
  findContentTokenAfter,
  addValidation,
  removeValidation
} = require('./util')

const messages = {
  noSpace: 'There should be no space between a number and a date/time unit.'
}

const validate = (token, type, condition) => {
  removeValidation(token, '', 'spaceAfter')
  if (condition) {
    addValidation(token, 'case-datetime-zh', 'spaceAfter', messages[type])
  }
}

module.exports = (token, index, group, matched, marks) => {
  if (token.type === 'content-half') {
    if (!token.content.match(/^[\d\.]+$/)) {
      return
    }
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
        const before = findTokenBefore(group, token)
        validate(contentTokenBefore, 'noSpace', contentTokenBefore.rawSpaceAfter)
        contentTokenBefore.spaceAfter = ''
        if (contentTokenBefore !== before) {
          validate(before, 'noSpace', before.rawSpaceAfter)
          before.spaceAfter = ''
        }
      }
      const before = findTokenBefore(group, contentTokenAfter)
      validate(token, 'noSpace', token.rawSpaceAfter)
      token.spaceAfter = ''
      if (before !== token) {
        validate(before, 'noSpace', before.rawSpaceAfter)
        before.spaceAfter = ''
      }
    }
  }
}
