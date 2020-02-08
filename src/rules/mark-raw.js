// space besides raw mark: one space outside

module.exports = (token, index, group, matched, marks) => {
  if (token.type === 'content-hyper') {
    const tokenBefore = group[index - 1]
    const tokenAfter = group[index + 1]
    if (tokenBefore) {
      tokenBefore.spaceAfter = ' '
    }
    if (tokenAfter) {
      token.spaceAfter = ' '
    }
  }
}
