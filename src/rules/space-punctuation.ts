import { ValidationTarget } from '../logger'
import { CharType, Handler, ModifiedToken as Token } from '../parser'
import {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findContentTokenAfter,
  findNonMarkTokenBefore,
  findNonMarkTokenAfter,
  addValidation,
  removeValidation
} from './util'

const messages: Record<string, string> = {
  noBefore: 'There should be no space before a punctuation.',
  noAfter: 'There should be no space after a full-width punctuation.',
  oneAfter: 'There should be one space after a half-width punctuation.'
}

const validate = (token: Token, type: string, condition: boolean): void => {
  if (condition) {
    addValidation(
      token,
      'space-punctuation',
      ValidationTarget.SPACE_AFTER,
      messages[type]
    )
  }
}

const handler: Handler = (token, _, group) => {
  // token is a punctuation between 2 contents
  // (exception: between 2 half-width content)
  // full-width -> no space
  // half-width -> one space after
  if (token.type.match(/^punctuation-/)) {
    if ('/[&%-'.indexOf(token.modifiedContent) >= 0) {
      return
    }
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    const nonMarkTokenBefore = findNonMarkTokenBefore(group, token)
    const nonMarkTokenAfter = findNonMarkTokenAfter(group, token)
    // no space before punctuation
    if (contentTokenBefore) {
      removeValidation(
        contentTokenBefore,
        'mark-raw',
        ValidationTarget.SPACE_AFTER
      )
      validate(contentTokenBefore, 'noBefore', !!contentTokenBefore.spaceAfter)
      contentTokenBefore.modifiedSpaceAfter = ''
      const tokenBefore = findTokenBefore(group, token) as Token
      if (tokenBefore !== contentTokenBefore) {
        removeValidation(tokenBefore, 'mark-raw', ValidationTarget.SPACE_AFTER)
        validate(tokenBefore, 'noBefore', !!tokenBefore.spaceAfter)
        tokenBefore.modifiedSpaceAfter = ''
      }
    }
    // both sides non-empty
    if (nonMarkTokenBefore && nonMarkTokenAfter) {
      // no space when punctuation is full-width
      if (token.type === CharType.PUNCTUATION_FULL) {
        removeValidation(token, 'mark-raw', ValidationTarget.SPACE_AFTER)
        validate(token, 'noAfter', !!token.spaceAfter && !token.type)
        token.modifiedSpaceAfter = ''
        if (contentTokenAfter) {
          const before = findTokenBefore(group, contentTokenAfter) as Token
          if (before !== token) {
            removeValidation(before, 'mark-raw', ValidationTarget.SPACE_AFTER)
            validate(before, 'noAfter', !!before.spaceAfter && !before.type)
            before.modifiedSpaceAfter = ''
          }
        }
      } else {
        if (
          contentTokenBefore &&
          contentTokenAfter &&
          (contentTokenBefore.type === 'content-full' ||
            contentTokenAfter.type === 'content-full')
        ) {
          // one space when punctuation is half-width and
          // either side of content is full-width content
          const tokenAfter = findTokenAfter(group, token)
          if (tokenAfter === contentTokenAfter) {
            removeValidation(token, 'mark-raw', ValidationTarget.SPACE_AFTER)
            validate(token, 'oneAfter', token.spaceAfter !== ' ' && !token.type)
            token.spaceAfter = ' '
          } else {
            const before = findTokenBefore(group, contentTokenAfter) as Token
            removeValidation(before, 'mark-raw', ValidationTarget.SPACE_AFTER)
            validate(
              before,
              'oneAfter',
              before.spaceAfter !== ' ' && !before.type
            )
            before.modifiedSpaceAfter = ' '
          }
        }
      }
    }
  }
}

export default handler
