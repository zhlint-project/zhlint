import {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findContentTokenAfter,
  findNonMarkTokenBefore,
  findNonMarkTokenAfter,
  findSpaceAfterHost,
  addValidation,
  removeValidation
} from './util'

const messages = {
  before:
    'There should be a space between full-width content and half-width content.'
}

const validate = (token, type, condition) => {
  removeValidation(token, 'space-punctuation', 'spaceAfter')
  if (condition) {
    addValidation(token, 'case-backslash', 'spaceAfter', messages[type])
  }
}

export default (token, index, group, matched, marks) => {
  // half width and no raw space after -> no space after
  // full width before -> one space before
  if (token.type.match(/^punctuation\-/) && token.content === '\\') {
    const tokenAfter = findTokenAfter(group, token)
    const contentTokenBefore = findContentTokenBefore(group, token)
    if (tokenAfter) {
      if (tokenAfter.type.match(/\-half*/) && !token.rawSpaceAfter) {
        removeValidation(token, 'space-punctuation', 'spaceAfter')
        token.spaceAfter = ''
        if (contentTokenBefore) {
          const tokenBefore = findTokenBefore(group, token)
          const spaceAfterHost = findSpaceAfterHost(
            group,
            contentTokenBefore,
            tokenBefore
          )
          if (spaceAfterHost) {
            removeValidation(spaceAfterHost, 'space-punctuation', 'spaceAfter')
            spaceAfterHost.spaceAfter = spaceAfterHost.rawSpaceAfter
          }
          if (contentTokenBefore && contentTokenBefore.type.match(/\-full*/)) {
            if (spaceAfterHost) {
              validate(
                spaceAfterHost,
                'before',
                spaceAfterHost.rawSpaceAfter !== ' '
              )
              spaceAfterHost.spaceAfter = ' '
            }
          }
        }
      }
    }
  }
}
