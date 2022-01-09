// space besides hyper mark:
// add 1 space outside the most outside mark if there is any space besides mark or mark group

const {
  findTokenBefore,
  findTokenAfter,
  findMarkSeq,
  findSpaceAfterHost,
  addValidation,
  removeValidation
} = require('./util')

const messages = {
  inside: 'There should be no space inside a Markdown mark.',
  outside: 'There should be a space outside a Markdown mark.',
  before: 'There should be a space before a Markdown mark.',
  after: 'There should be a space after a Markdown mark.'
}

const validate = (token, type, condition) => {
  if (condition) {
    addValidation(token, 'mark-hyper', 'spaceAfter', messages[type])
  }
}

const checkSpace = (group, markSeq) => {
  if (markSeq.some(markToken => markToken.rawSpaceAfter)) {
    return true
  }
  const tokenBefore = findTokenBefore(group, markSeq[0])
  if (tokenBefore) {
    return !!tokenBefore.rawSpaceAfter
  }
  return false
}

module.exports = (token, index, group, matched, marks) => {
  if (token.type === 'mark-hyper') {
    const markSeq = findMarkSeq(group, token)
    const tokenBeforeMarkSeq = findTokenBefore(group, markSeq[0])
    const hasSpace = checkSpace(group, markSeq)

    if (token === markSeq[0]) {
      const spaceAfterHost = findSpaceAfterHost(group, tokenBeforeMarkSeq, markSeq[markSeq.length - 1])
      const seq = [tokenBeforeMarkSeq, ...markSeq].filter(Boolean)
      seq.forEach(token => {
        if (hasSpace) {
          if (token === spaceAfterHost) {
            validate(token, 'outside', token.rawSpaceAfter !== ' ')
            token.spaceAfter = ' '
          } else {
            removeValidation(token, '', 'spaceAfter')
            validate(token, 'inside', token.rawSpaceAfter)
            token.spaceAfter = ''
          }
        } else {
          removeValidation(token, '', 'spaceAfter')
          token.spaceAfter = ''
        }
      })
    }
  }
}
