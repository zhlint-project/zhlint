// space besides raw mark: one space outside

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
    if (token.content.match(/<code.*>.*<\/code.*>/)) {
      addSpaceOutside(group, token, index)
      return
    }
    if (token.content.match(/<.+>/)) {
      return
    }
    addSpaceOutside(group, token, index)
  }
}
