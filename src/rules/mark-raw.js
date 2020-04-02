// space besides raw mark: one space outside

const { isInlineCode } = require('./util')

const addSpaceOutside = (group, token, index) => {
  const tokenBefore = group[index - 1]
  const tokenAfter = group[index + 1]
  if (tokenBefore) {
    tokenBefore.spaceAfter = ' '
  }
  if (tokenAfter) {
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
