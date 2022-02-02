import { ValidationTarget } from '../report'
import {
  GroupTokenType,
  Handler,
  MutableGroupToken as GroupToken,
  MutableToken as Token
} from '../parser'
import {
  findTokenBefore,
  findContentTokenBefore,
  findContentTokenAfter,
  findSpaceAfterHost,
  addValidation
} from './util'

const quoteIsFullWidth = (char: string): boolean =>
  '‘’“”《》〈〉『』「」【】'.indexOf(char) >= 0

const messages: Record<string, string> = {
  inside: 'There should be no space inside quotes',
  'outside-full': 'There should be no space outside full-width quotes',
  'outside-half': 'There should be one space outside half-width quotes'
}

const validate = (
  token: Token,
  type: string,
  target: ValidationTarget,
  condition: boolean
): void => {
  if (condition) {
    addValidation(token, 'space-quotes', target, messages[type])
  }
}

const checkOutside = (
  spaceAfterHost: Token | undefined,
  quoteContent: string,
  isRawQuoteContent: boolean
): void => {
  if (spaceAfterHost) {
    if (quoteIsFullWidth(quoteContent)) {
      validate(
        spaceAfterHost,
        'outside-full',
        ValidationTarget.SPACE_AFTER,
        isRawQuoteContent && !!spaceAfterHost.modifiedSpaceAfter
      )
      spaceAfterHost.modifiedSpaceAfter = ''
    } else {
      validate(
        spaceAfterHost,
        'outside-half',
        ValidationTarget.SPACE_AFTER,
        isRawQuoteContent && spaceAfterHost.modifiedSpaceAfter !== ' '
      )
      spaceAfterHost.modifiedSpaceAfter = ' '
    }
  }
}

const spaceQuotesHandler: Handler = (token: Token, _, group: GroupToken) => {
  if (token.type === GroupTokenType.GROUP) {
    // no space inside
    validate(
      token,
      'inside',
      ValidationTarget.INNER_SPACE_BEFORE,
      !!token.innerSpaceBefore
    )
    token.modifiedInnerSpaceBefore = ''
    const lastInnerToken = token[token.length - 1]
    if (lastInnerToken) {
      validate(
        lastInnerToken,
        'inside',
        ValidationTarget.SPACE_AFTER,
        !!lastInnerToken.spaceAfter
      )
      lastInnerToken.modifiedSpaceAfter = ''
    }

    // content before:
    // - one space if quote is half-width
    // - no space if quote is full-width
    const contentTokenBefore = findContentTokenBefore(group, token)
    if (contentTokenBefore) {
      const tokenBefore = findTokenBefore(group, token)
      const spaceAfterHost = findSpaceAfterHost(
        group,
        contentTokenBefore,
        tokenBefore
      )
      checkOutside(
        spaceAfterHost,
        token.modifiedStartContent,
        token.modifiedStartContent === token.startContent
      )
    }

    // content after:
    // - one space if quote is half-width
    // - no space if quote is full-width
    const contentTokenAfter = findContentTokenAfter(group, token)
    if (contentTokenAfter) {
      const tokenBeforeContentAfter = findTokenBefore(group, contentTokenAfter)
      const spaceAfterHost = findSpaceAfterHost(
        group,
        token,
        tokenBeforeContentAfter
      )
      checkOutside(
        spaceAfterHost,
        token.modifiedEndContent,
        token.modifiedEndContent === token.endContent
      )
    }
  }
}

export default spaceQuotesHandler
