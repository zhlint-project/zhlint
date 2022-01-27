import { ValidationTarget } from '../logger'
import { CharType, Handler, MutableGroupToken as GroupToken, MutableToken as Token } from '../parser'
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

/**
 * token is a punctuation between 2 contents
 * (exception: between 2 half-width content)
 * full-width -> no space
 * half-width -> one space after
 */
const handler: Handler = (token: Token, _, group: GroupToken) => {
  if (token.type.match(/^punctuation-/)) {
    // Skip special punctuation which doesn't fit this rule.
    if ('/[&%-'.indexOf(token.modifiedContent) >= 0) {
      return
    }

    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    const nonMarkTokenBefore = findNonMarkTokenBefore(group, token)
    const nonMarkTokenAfter = findNonMarkTokenAfter(group, token)

    // When content exists before this punctuation.
    if (contentTokenBefore) {
      removeValidation(
        contentTokenBefore,
        'mark-raw',
        ValidationTarget.SPACE_AFTER
      )
      validate(contentTokenBefore, 'noBefore', !!contentTokenBefore.spaceAfter)

      // No space after the content before.
      contentTokenBefore.modifiedSpaceAfter = ''

      // When there are some hyper content in-between.
      const tokenBefore = findTokenBefore(group, token) as Token
      if (tokenBefore !== contentTokenBefore) {
        removeValidation(tokenBefore, 'mark-raw', ValidationTarget.SPACE_AFTER)
        validate(tokenBefore, 'noBefore', !!tokenBefore.spaceAfter)
        // No space before the punctuation.
        tokenBefore.modifiedSpaceAfter = ''
      }
    }

    // When there are content in both sides of the punctuation.
    if (nonMarkTokenBefore && nonMarkTokenAfter) {
      // When the punctuation is full-width
      if (token.modifiedType === CharType.PUNCTUATION_FULL) {
        removeValidation(token, 'mark-raw', ValidationTarget.SPACE_AFTER)
        validate(token, 'noAfter', !!token.spaceAfter && !token.modifiedType)

        // No space after the punctuation.
        token.modifiedSpaceAfter = ''

        // When there are some hyper content in-between.
        if (contentTokenAfter) {
          const before = findTokenBefore(group, contentTokenAfter) as Token
          if (before !== token) {
            removeValidation(before, 'mark-raw', ValidationTarget.SPACE_AFTER)
            validate(before, 'noAfter', !!before.spaceAfter && !before.type)
            // No space after the hyper content.
            before.modifiedSpaceAfter = ''
          }
        }
      } else {
        // Here the punctuation is half-width.
        // When either side of the content is full-width.
        if (
          contentTokenBefore &&
          contentTokenAfter &&
          (contentTokenBefore.type === CharType.CONTENT_FULL ||
            contentTokenAfter.type === CharType.CONTENT_FULL)
        ) {
          // When there is no hyper content in-between.
          const tokenAfter = findTokenAfter(group, token)
          if (tokenAfter === contentTokenAfter) {
            removeValidation(token, 'mark-raw', ValidationTarget.SPACE_AFTER)
            validate(token, 'oneAfter', token.spaceAfter !== ' ' && !token.modifiedType)
            // One space after the punctuation.
            token.modifiedSpaceAfter = ' '
          } else {
            // Here there are some hyper content in-between.
            const before = findTokenBefore(group, contentTokenAfter) as Token
            removeValidation(before, 'mark-raw', ValidationTarget.SPACE_AFTER)
            validate(
              before,
              'oneAfter',
              before.spaceAfter !== ' ' && !before.type
            )
            // One space before the after-content.
            before.modifiedSpaceAfter = ' '
          }
        }
      }
    }
  }
}

export default handler
