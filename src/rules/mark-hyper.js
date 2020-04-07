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

module.exports = (token, index, group, matched, marks) => {
  if (token.type === 'mark-hyper') {
    const markSeq = findMarkSeq(group, token)

    const hasSpace = !!(
      markSeq.some(markToken => markToken.spaceAfter) ||
      (findTokenBefore(group, markSeq[0]) || {}).spaceAfter
    )

    const tokenBefore = findTokenBefore(group, token)
    const tokenAfter = findTokenAfter(group, token)
    if (token.markSide === 'left') {
      if (tokenBefore) {
        const spaceAfter = (hasSpace && token === markSeq[0]) ? ' ' : ''
        validate(tokenBefore, 'before', tokenBefore.spaceAfter == spaceAfter)
        tokenBefore.spaceAfter = spaceAfter
      }
      if (tokenAfter) {
        validate(token, 'inside', token.spaceAfter)
        token.spaceAfter = ''
      }
    }
    else if (token.markSide === 'right') {
      if (tokenBefore) {
        validate(tokenBefore, 'inside', tokenBefore.spaceAfter)
        tokenBefore.spaceAfter = ''
      }
      if (tokenAfter) {
        validate(token, 'after', token.spaceAfter)
        token.spaceAfter = (hasSpace && token === markSeq[markSeq.length - 1]) ? ' ' : ''
      }
    }
  }
}
