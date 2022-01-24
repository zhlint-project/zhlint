import { ValidationTarget } from '../logger'
import { CharType, Handler, MutableToken as Token } from '../parser'
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

const messages: Record<string, (char: string) => string> = {
  before: (char) => `There should be a space before the '${char}' character.`,
  after: (char) => `There should be a space after the '${char}' character.`
}

const validate = (
  token: Token,
  type: string,
  char: string,
  condition: boolean
): void => {
  removeValidation(token, 'space-punctuation', ValidationTarget.SPACE_AFTER)
  if (condition) {
    addValidation(
      token,
      'case-math-exp',
      ValidationTarget.SPACE_AFTER,
      messages[type](char)
    )
  }
}

const handler: Handler = (token, _, group) => {
  // calculation: space in both sides
  // - 1 + 1 = 2
  // x 2020/01/01
  // x 2020-01-01
  // x vue-custom-element
  // x 100%
  // x a/b
  // x Chrome 53+
  if (
    token.type.match(/^punctuation-/) &&
    token.modifiedContent &&
    token.modifiedContent.match(/^(\+|-|\*|\/|%|<|>|=)=?$/)
  ) {
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    if (contentTokenBefore && contentTokenAfter) {
      if (
        contentTokenBefore.modifiedContent.match(/^[\d.]+$/) &&
        contentTokenAfter.modifiedContent.match(/^[\d.]+$/)
      ) {
        const nonMarkTokenBefore = findNonMarkTokenBefore(
          group,
          contentTokenBefore
        )
        const nonMarkTokenAfter = findNonMarkTokenAfter(
          group,
          contentTokenAfter
        )
        if (
          token.modifiedContent === '/' &&
          ((nonMarkTokenBefore && nonMarkTokenBefore.modifiedContent === '/') ||
            (nonMarkTokenAfter && nonMarkTokenAfter.modifiedContent === '/'))
        ) {
          return
        }
        if (
          token.modifiedContent === '-' &&
          ((nonMarkTokenBefore && nonMarkTokenBefore.modifiedContent === '-') ||
            (nonMarkTokenAfter && nonMarkTokenAfter.modifiedContent === '-'))
        ) {
          return
        }
      } else if (token.modifiedContent === '-') {
        return
      }
      if ('/%'.indexOf(token.modifiedContent) >= 0) {
        return
      }
      if (
        '+-'.indexOf(token.modifiedContent) >= 0 &&
        !contentTokenBefore.spaceAfter &&
        token.spaceAfter
      ) {
        return
      }
      validate(
        contentTokenBefore,
        'before',
        token.modifiedContent,
        contentTokenBefore.spaceAfter !== ' '
      )
      contentTokenBefore.modifiedSpaceAfter = ' '
      const tokenBefore = findTokenBefore(group, token) as Token
      if (tokenBefore !== contentTokenBefore) {
        validate(
          tokenBefore,
          'before',
          token.modifiedContent,
          tokenBefore.spaceAfter !== ' '
        )
        tokenBefore.modifiedSpaceAfter = ' '
      }
      validate(token, 'after', token.modifiedContent, token.spaceAfter !== ' ')
      token.modifiedSpaceAfter = ' '
      const tokenBeforeContentTokenAfter = findTokenBefore(
        group,
        contentTokenAfter
      ) as Token
      if (tokenBeforeContentTokenAfter !== token) {
        validate(
          tokenBeforeContentTokenAfter,
          'after',
          token.modifiedContent,
          tokenBeforeContentTokenAfter.spaceAfter !== ' '
        )
        tokenBeforeContentTokenAfter.modifiedSpaceAfter = ' '
      }
    }
  }

  // vertical lines: space in neither sides (no space detected around)
  // or both sides (otherwise)
  // - a | b | c
  // - a || b || c
  // x a|b|c
  if (
    token.type === CharType.PUNCTUATION_HALF &&
    token.modifiedContent === '|'
  ) {
    const tokenBefore = findTokenBefore(group, token)
    if (tokenBefore && tokenBefore.modifiedContent !== '|') {
      const tokens: Token[] = []
      let nextToken: Token | undefined = token
      while (nextToken && nextToken.modifiedContent === '|') {
        tokens.push(nextToken)
        nextToken = findTokenAfter(group, nextToken)
      }
      const lastToken = tokens[tokens.length - 1]
      if (tokenBefore.spaceAfter || lastToken.spaceAfter) {
        validate(
          tokenBefore,
          'before',
          tokenBefore.modifiedContent, // TODO
          false
        )
        validate(lastToken, 'after', lastToken.modifiedContent, false) // TODO
        tokenBefore.modifiedSpaceAfter = lastToken.modifiedSpaceAfter = ' '
      } else {
        removeValidation(
          tokenBefore,
          'space-punctuation',
          ValidationTarget.SPACE_AFTER
        )
        removeValidation(
          lastToken,
          'space-punctuation',
          ValidationTarget.SPACE_AFTER
        )
        tokenBefore.modifiedSpaceAfter = lastToken.modifiedSpaceAfter = ''
      }
    }
  }
}

export default handler
