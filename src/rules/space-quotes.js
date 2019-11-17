const quoteIsFullWidth = char => '‘’“”'.indexOf(char) >= 0

module.exports = (token, index, group, matched, marks) => {
  // half-width: one space outside
  // half-width: no space inside
  if (token.type === 'group') {
    const outerTokenBefore = group[index - 1]
    const outerTokenAfter = group[index + 1]
    const firstInnerToken = token[0]
    const lastInnerToken = token[token.length - 1]
    token.innerSpaceBefore = ''
    if (outerTokenBefore) {
      if (quoteIsFullWidth(token.startChar)) {
        outerTokenBefore.spaceAfter = ''
      } else {
        outerTokenBefore.spaceAfter = ' '
      }
    }
    if (lastInnerToken) {
      lastInnerToken.spaceAfter = ''
    }
    if (outerTokenAfter) {
      if (quoteIsFullWidth(token.endChar)) {
        token.spaceAfter = ''
      } else {
        token.spaceAfter = ' '
      }
    }
  }
}
