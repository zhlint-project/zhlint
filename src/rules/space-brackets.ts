// deps:
// - for hyper marks, should move inside spaces outside
// - for raw marks, should ensure spaces out of both sides
// examples:
// - a ** (a) ** a -> a **(a)** a -> a **(a)** a
// - a** (a) **a   -> a **(a)** a -> a **(a)** a
// - a **(a)** a   -> a **(a)** a -> a **(a)** a
// - a**(a)**a     -> a **(a)** a -> a **(a)** a
// - a( ** a ** )a -> a( **a** )a -> a (**a**) a
// - a(** a **)a   -> a( **a** )a -> a (**a**) a
// - a( **a** )a   -> a( **a** )a -> a (**a**) a
// - a(**a**)a     -> a( **a** )a -> a (**a**) a

import { ValidationTarget } from '../report'
import {
  CharType,
  Handler,
  MarkSideType,
  MutableToken as Token,
  MutableGroupToken as GroupToken,
  SingleTokenType
} from '../parser'
import {
  findTokenBefore,
  findContentTokenBefore,
  findContentTokenAfter,
  findSpaceAfterHost,
  removeValidation,
  addValidation
} from './util'

const messages: Record<string, string> = {
  'outside-half': 'There should be one space outside half-width brackets',
  'outside-full': 'There should be on space outside full-width brackets',
  inside: 'There should be no space inside brackets'
}

const validate = (token: Token, type: string, condition: boolean): void => {
  removeValidation(token, '', ValidationTarget.SPACE_AFTER)
  if (condition) {
    addValidation(
      token,
      'space-brackets',
      ValidationTarget.SPACE_AFTER,
      messages[type]
    )
  }
}

const checkSide = (
  spaceAfterHost: Token,
  size: string,
  isRawContent: boolean,
  isOutside: boolean,
  areBothHalfWidthContent: boolean
): void => {
  if (isOutside) {
    if (size === 'half-width') {
      if (areBothHalfWidthContent) {
        return
      }
      validate(
        spaceAfterHost,
        'outside-half',
        isRawContent && spaceAfterHost.spaceAfter !== ' '
      )
      spaceAfterHost.modifiedSpaceAfter = ' '
    } else {
      validate(
        spaceAfterHost,
        'outside-full',
        isRawContent && !!spaceAfterHost.spaceAfter
      )
      spaceAfterHost.modifiedSpaceAfter = ''
    }
  } else {
    validate(
      spaceAfterHost,
      'inside',
      isRawContent && !!spaceAfterHost.spaceAfter
    )
    spaceAfterHost.modifiedSpaceAfter = ''
  }
}

const handler: Handler = (token: Token, _, group: GroupToken) => {
  if (token.type === SingleTokenType.MARK_BRACKETS) {
    const isRawContent = token.modifiedContent === token.content
    const size = token.modifiedContent.match(/[()]/)
      ? 'half-width'
      : 'full-width'
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    if (contentTokenBefore) {
      const tokenBefore = findTokenBefore(group, token)
      const spaceAfterHost = findSpaceAfterHost(
        group,
        contentTokenBefore,
        tokenBefore
      ) as Token
      checkSide(
        spaceAfterHost,
        size,
        isRawContent,
        token.markSide === MarkSideType.LEFT,
        !!contentTokenAfter &&
          contentTokenBefore.type === CharType.CONTENT_HALF &&
          contentTokenAfter.type === CharType.CONTENT_HALF &&
          token.markSide === MarkSideType.LEFT
      )
    }
    if (contentTokenAfter) {
      const tokenBeforeContentAfter = findTokenBefore(group, contentTokenAfter)
      const spaceAfterHost = findSpaceAfterHost(
        group,
        token,
        tokenBeforeContentAfter
      ) as Token
      checkSide(
        spaceAfterHost,
        size,
        isRawContent,
        token.markSide === MarkSideType.RIGHT,
        !!contentTokenBefore &&
          contentTokenBefore.type === CharType.CONTENT_HALF &&
          contentTokenAfter.type === CharType.CONTENT_HALF &&
          token.markSide === MarkSideType.RIGHT
      )
    }
  }
}

export default handler
