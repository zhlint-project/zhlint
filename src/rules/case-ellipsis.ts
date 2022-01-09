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

const validate = (token, type, condition) => {
  if (condition) {
    addValidation(token, 'case-ellipsis', 'spaceAfter', messages[type])
  }
}

export default (token, index, group, matched, marks) => {
  if (token.raw === '.') {
    const tokenBefore = findTokenBefore(group, token)

    // beginning of dot(s)
    if (!tokenBefore || tokenBefore.raw !== '.') {
      let nextToken = findTokenAfter(group, token)

      // make sure the dot(s) are ellipsis
      if (nextToken && nextToken.raw === '.') {

        // reset the space before dots
        removeValidation(tokenBefore, '', 'spaceAfter')
        validate(tokenBefore, 'before',
          !hasValidation(tokenBefore, 'spaceAfter', null)
            && tokenBefore.rawSpaceAfter)
        tokenBefore.spaceAfter = ''

        // restore the dot
        removeValidation(token, '', 'content')
        removeValidation(token, '', 'spaceAfter')
        token.content = '.'
        token.spaceAfter = ''

        // restore next token
        // - if next next is dot: restore next space, update next next to next
        // - else: remove space after
        while (nextToken && nextToken.raw === '.') {

          // restore next token content
          removeValidation(nextToken, '', 'content')
          nextToken.content = '.'

          const tempToken = findTokenAfter(group, nextToken)
          if (tempToken) {
            if (tempToken.raw === '.') {
              // restore space
              removeValidation(nextToken, '', 'spaceAfter')
              nextToken.spaceAfter = ''
            } else {
              // remove space
              validate(nextToken, 'after', nextToken.rawSpaceAfter)
              nextToken.spaceAfter = ''
            }
          }

          nextToken = tempToken
        }
      }
    }
  }
}
