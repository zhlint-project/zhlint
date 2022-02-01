import { ValidationTarget } from '../report'
import {
  Handler,
  MutableGroupToken as GroupToken,
  MutableToken as Token
} from '../parser'
import {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findSpaceAfterHost,
  addValidation,
  removeValidation
} from './util'

const messages = {
  before:
    'There should be a space between full-width content and half-width content.'
}

const validate = (token: Token, type: string, condition: boolean): void => {
  removeValidation(token, 'space-punctuation', ValidationTarget.SPACE_AFTER)
  if (condition) {
    addValidation(
      token,
      'case-backslash',
      ValidationTarget.SPACE_AFTER,
      messages[type]
    )
  }
}

const caseBackSlashHandler: Handler = (token: Token, _, group: GroupToken) => {
  // half width and no raw space after -> no space after
  // full width before -> one space before
  if (token.type.match(/^punctuation-/) && token.content === '\\') {
    const tokenAfter = findTokenAfter(group, token)
    const contentTokenBefore = findContentTokenBefore(group, token)
    if (tokenAfter) {
      if (tokenAfter.type.match(/-half*/) && !token.spaceAfter) {
        removeValidation(
          token,
          'space-punctuation',
          ValidationTarget.SPACE_AFTER
        )
        token.modifiedSpaceAfter = ''
        if (contentTokenBefore) {
          const tokenBefore = findTokenBefore(group, token)
          const spaceAfterHost = findSpaceAfterHost(
            group,
            contentTokenBefore,
            tokenBefore
          )
          if (spaceAfterHost) {
            removeValidation(
              spaceAfterHost,
              'space-punctuation',
              ValidationTarget.SPACE_AFTER
            )
            spaceAfterHost.modifiedSpaceAfter = spaceAfterHost.spaceAfter
          }
          if (contentTokenBefore && contentTokenBefore.type.match(/-full*/)) {
            if (spaceAfterHost) {
              validate(
                spaceAfterHost,
                'before',
                spaceAfterHost.spaceAfter !== ' '
              )
              spaceAfterHost.modifiedSpaceAfter = ' '
            }
          }
        }
      }
    }
  }
}

export default caseBackSlashHandler
