// space besides hyper mark:
// add 1 space outside the most outside mark if there is any space besides mark or mark group

const {
  findTokenBefore,
  findTokenAfter,
  findMarkSeq,
  addValidation
} = require('./util')

const messages = {
  before: 'There should be a space before a Markdown mark.',
  inside: 'There should be no space inside a Markdown mark.',
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
    const hasSpace = checkSpace(group, markSeq)
    const tokenBefore = findTokenBefore(group, token)
    const tokenAfter = findTokenAfter(group, token)
    if (token.markSide === 'left') {
      if (tokenBefore) {
        const spaceAfter = (hasSpace && token === markSeq[0]) ? ' ' : ''
        validate(tokenBefore, 'before', (tokenBefore.rawSpaceAfter || '') !== spaceAfter)
        tokenBefore.spaceAfter = spaceAfter
      }
      if (tokenAfter) {
        validate(token, 'inside', token.rawSpaceAfter)
        token.spaceAfter = ''
      }
    }
    else if (token.markSide === 'right') {
      if (tokenBefore) {
        validate(tokenBefore, 'inside', tokenBefore.rawSpaceAfter)
        tokenBefore.spaceAfter = ''
      }
      if (tokenAfter) {
        const spaceAfter = (hasSpace && token === markSeq[markSeq.length - 1]) ? ' ' : ''
        validate(token, 'after', (token.rawSpaceAfter || '') !== spaceAfter)
        token.spaceAfter = spaceAfter
      }
    }
  }
}
