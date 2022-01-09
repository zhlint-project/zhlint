import {
  findTokenBefore,
  findContentTokenBefore,
  findContentTokenAfter,
  findSpaceAfterHost,
  addValidation,
  removeValidation
} from './util'

const messages = {
  noSpace: 'There should be no space between a number and a date/time unit.'
}

const validate = (token, type, condition) => {
  removeValidation(token, '', 'spaceAfter')
  if (condition) {
    addValidation(token, 'case-datetime-zh', 'spaceAfter', messages[type])
  }
}

export default (token, index, group, matched, marks) => {
  if (token.type === 'content-half') {
    if (!token.content.match(/^[\d\.]+$/)) {
      return
    }
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    if (
      contentTokenAfter &&
      contentTokenAfter.content.match(/^[年月日天号时分秒]$/)
    ) {
      if (contentTokenBefore && contentTokenBefore.type === 'content-full') {
        const before = findTokenBefore(group, token)
        const spaceAfterHost = findSpaceAfterHost(
          group,
          contentTokenBefore,
          before
        )
        validate(spaceAfterHost, 'noSpace', contentTokenBefore.rawSpaceAfter)
        spaceAfterHost.spaceAfter = ''
      }
      const before = findTokenBefore(group, contentTokenAfter)
      const spaceAfterHost = findSpaceAfterHost(group, token, before)
      validate(spaceAfterHost, 'noSpace', token.rawSpaceAfter)
      spaceAfterHost.spaceAfter = ''
    }
  }
}
