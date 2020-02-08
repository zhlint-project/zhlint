// space besides hyper mark: one or no space outside, no space inside

module.exports = (token, index, group, matched, marks) => {
  if (token.type === 'mark-hyper') {
    const tokenBefore = group[index - 1]
    const tokenAfter = group[index + 1]
    if (token.markSide === 'left') {
      if (tokenBefore) {
        tokenBefore.spaceAfter = ' '
      }
      if (tokenAfter) {
        token.spaceAfter = ''
      }
    }
    else if (token.markSide === 'right') {
      if (tokenBefore) {
        tokenBefore.spaceAfter = ''
      }
      if (tokenAfter) {
        token.spaceAfter = ' '
      }
    }
  }
}
