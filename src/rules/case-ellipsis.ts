import { ValidationTarget } from '../logger'
import {
  Handler,
  MutableGroupToken as GroupToken,
  MutableToken as Token
} from '../parser'
import {
  findTokenBefore,
  findTokenAfter,
  addValidation,
  hasValidation,
  removeValidation
} from './util'

const messages = {
  before: 'There should be no space before ellipsis',
  after: 'There should be no space after ellipsis'
}

const validate = (token: Token, type: string, condition: boolean): void => {
  if (condition) {
    addValidation(
      token,
      'case-ellipsis',
      ValidationTarget.SPACE_AFTER,
      messages[type]
    )
  }
}

const handler: Handler = (token: Token, _, group: GroupToken) => {
  if (token.content === '.') {
    const tokenBefore = findTokenBefore(group, token)

    // beginning of dot(s)
    if (!tokenBefore || tokenBefore.content !== '.') {
      let nextToken = findTokenAfter(group, token)

      // make sure the dot(s) are ellipsis
      if (nextToken && nextToken.content === '.') {
        if (tokenBefore) {
          // reset the space before dots
          removeValidation(tokenBefore, '', ValidationTarget.SPACE_AFTER)
          validate(
            tokenBefore,
            'before',
            !hasValidation(tokenBefore, '', ValidationTarget.SPACE_AFTER) &&
              !!tokenBefore.spaceAfter
          )
          tokenBefore.modifiedSpaceAfter = ''
        }

        // restore the dot
        removeValidation(token, '', ValidationTarget.CONTENT)
        removeValidation(token, '', ValidationTarget.SPACE_AFTER)
        token.modifiedContent = '.'
        token.modifiedSpaceAfter = ''

        // restore next token
        // - if next next is dot: restore next space, update next next to next
        // - else: remove space after
        while (nextToken && nextToken.content === '.') {
          // restore next token content
          removeValidation(nextToken, '', ValidationTarget.CONTENT)
          nextToken.modifiedContent = '.'

          const tempToken = findTokenAfter(group, nextToken)
          if (tempToken) {
            if (tempToken.content === '.') {
              // restore space
              removeValidation(nextToken, '', ValidationTarget.SPACE_AFTER)
              nextToken.modifiedSpaceAfter = ''
            } else {
              // remove space
              validate(nextToken, 'after', !!nextToken.spaceAfter)
              nextToken.modifiedSpaceAfter = ''
            }
          }

          nextToken = tempToken
        }
      }
    }
  }
}

export default handler
