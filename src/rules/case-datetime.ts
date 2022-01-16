import { ValidationTarget } from '../logger'
import { Handler } from '../parser'
import {
  findTokenBefore,
  findNonMarkTokenBefore,
  findNonMarkTokenAfter,
  removeValidation
} from './util'

const handler: Handler = (token, _, group) => {
  if (token.type.match(/^punctuation-/) && token.content === ':') {
    const tokenBefore = findTokenBefore(group, token)
    const nonMarkTokenBefore = findNonMarkTokenBefore(group, token)
    const nonMarkTokenAfter = findNonMarkTokenAfter(group, token)
    const tokenBeforeNonMarkTokenAfter = findTokenBefore(
      group,
      nonMarkTokenAfter
    )
    if (
      nonMarkTokenBefore &&
      !nonMarkTokenBefore.spaceAfter &&

      tokenBefore &&
      !tokenBefore.spaceAfter &&

      nonMarkTokenAfter &&
      tokenBeforeNonMarkTokenAfter &&
      !tokenBeforeNonMarkTokenAfter.spaceAfter &&

      !token.spaceAfter
    ) {
      removeValidation(token, 'unify-punctuation', ValidationTarget.CONTENT)
      token.modifiedContent = ':'
    }
  }
}

export default handler
