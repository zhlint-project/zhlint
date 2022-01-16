// space besides raw mark: one space outside

import { ValidationTarget } from '../logger'
import { Handler, ModifiedGroupToken as GroupToken, ModifiedToken as Token, SingleTokenType } from '../parser'
import { isInlineCode, addValidation } from './util'

const messages = {
  before: 'There should be a space before a piece of inline code.',
  after: 'There should be a space after a piece of inline code.'
}

const validate = (token: Token, type: string, condition: boolean): void => {
  if (condition) {
    addValidation(token, 'mark-raw', ValidationTarget.SPACE_AFTER, messages[type])
  }
}

const addSpaceOutside = (group: GroupToken, token: Token, index: number): void => {
  const tokenBefore = group[index - 1]
  const tokenAfter = group[index + 1]
  if (tokenBefore) {
    validate(tokenBefore, 'before', tokenBefore.modifiedSpaceAfter !== ' ')
    tokenBefore.modifiedSpaceAfter = ' '
  }
  if (tokenAfter) {
    validate(token, 'after', token.modifiedSpaceAfter !== ' ')
    token.modifiedSpaceAfter = ' '
  }
}

const handler: Handler = (token, index, group) => {
  if (token.type === SingleTokenType.CONTENT_HYPER) {
    if (isInlineCode(token)) {
      addSpaceOutside(group, token, index)
    }
  }
}

export default handler
