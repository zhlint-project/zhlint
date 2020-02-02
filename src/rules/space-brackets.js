module.exports = (token, index, group, matched, marks) => {
  // half-width: one space outside
  // half-width: no space inside
  if (token.type === 'mark-brackets') {
    const tokenBefore = group[index - 1]
    const tokenAfter = group[index + 1]
    const { markSide } = token
    const size = token.content.match(/[\(\)]/) ? 'half-width' : 'full-width'
    if (markSide === 'left') {
      if (tokenBefore) {
        if (size === 'half-width' && tokenBefore.type.match(/^content\-/)) {
          if (tokenBefore.type !== 'content-half') {
            tokenBefore.spaceAfter = ' '
          }
        } else {
          tokenBefore.spaceAfter = ''
        }
      }
      token.spaceAfter = ''
    }
    if (markSide === 'right') {
      if (tokenBefore) {
        tokenBefore.spaceAfter = ''
      }
      if (tokenAfter) {
        if (size === 'half-width' && tokenBefore.type.match(/^content\-/)) {
          if (tokenAfter.type !== 'content-half') {
            token.spaceAfter = ' '
          }
        } else {
          token.spaceAfter = ''
        }
      }
    }
  }
}
