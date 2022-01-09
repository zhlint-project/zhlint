// space besides raw mark: one space outside

const { isInlineCode, addValidation } = require('./util')

const messages = {
  before: 'There should be a space before a piece of inline code.',
  after: 'There should be a space after a piece of inline code.'
}

const validate = (token, type, condition) => {
  if (condition) {
    addValidation(token, 'mark-raw', 'spaceAfter', messages[type])
  }
}

const addSpaceOutside = (group, token, index) => {
  const tokenBefore = group[index - 1]
  const tokenAfter = group[index + 1]
  if (tokenBefore) {
    validate(tokenBefore, 'before', tokenBefore.spaceAfter !== ' ')
    tokenBefore.spaceAfter = ' '
  }
  if (tokenAfter) {
    validate(token, 'after', token.spaceAfter !== ' ')
    token.spaceAfter = ' '
  }
}

module.exports = (token, index, group, matched, marks) => {
  if (token.type === 'content-hyper') {
    if (isInlineCode(token)) {
      addSpaceOutside(group, token, index)
    }
  }
}
