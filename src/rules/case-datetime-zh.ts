import { ValidationTarget } from '../report'
import {
  Handler,
  MutableGroupToken as GroupToken,
  MutableToken as Token
} from '../parser'
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

const validate = (token: Token, type: string, condition: boolean): void => {
  removeValidation(token, '', ValidationTarget.SPACE_AFTER)
  if (condition) {
    addValidation(
      token,
      'case-datetime-zh',
      ValidationTarget.SPACE_AFTER,
      messages[type]
    )
  }
}

const handler: Handler = (token: Token, _, group: GroupToken) => {
  if (token.type === 'content-half') {
    if (!token.modifiedContent?.match(/^[\d.]+$/)) {
      return
    }
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    if (
      contentTokenAfter &&
      contentTokenAfter.modifiedContent?.match(/^[年月日天号时分秒]$/)
    ) {
      if (contentTokenBefore && contentTokenBefore.type === 'content-full') {
        const before = findTokenBefore(group, token)
        const spaceAfterHost = findSpaceAfterHost(
          group,
          contentTokenBefore,
          before
        )
        if (spaceAfterHost) {
          validate(spaceAfterHost, 'noSpace', !!contentTokenBefore.spaceAfter)
          spaceAfterHost.modifiedSpaceAfter = ''
        }
      }
      const before = findTokenBefore(group, contentTokenAfter)
      const spaceAfterHost = findSpaceAfterHost(group, token, before)
      if (spaceAfterHost) {
        validate(spaceAfterHost, 'noSpace', !!token.spaceAfter)
        spaceAfterHost.modifiedSpaceAfter = ''
      }
    }
  }
}

export default handler
