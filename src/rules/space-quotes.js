const {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findContentTokenAfter,
  getMarkSide
} = require('./util')

const quoteIsFullWidth = char => '‘’“”《》〈〉『』「」【】'.indexOf(char) >= 0

module.exports = (token, index, group, matched, marks) => {
  if (token.type === 'group') {
    // no space inside
    token.innerSpaceBefore = ''
    const lastInnerToken = token[token.length - 1]
    if (lastInnerToken) {
      lastInnerToken.spaceAfter = ''
    }
    // half-width: one space outside
    const tokenBefore = findTokenBefore(group, token)
    const contentTokenBefore = findContentTokenBefore(group, token)
    // - no mark -> tokenBefore.spaceAfter = isHalfWidth() ? ' ' : ''
    // - has mark -> isHalfWidth()
    //   - ? content.spaceAfter = markSide ? ' ' : '', before.spaceAfter = markSide ? '' : ' '
    //   - : content.spaceAfter = before.spaceAfter = ''
    if (tokenBefore) {
      if (!contentTokenBefore) {
        tokenBefore.spaceAfter = ''
      } else {
        const isFullWidth = quoteIsFullWidth(token.startContent)
        if (contentTokenBefore === tokenBefore) {
          tokenBefore.spaceAfter = isFullWidth ? '' : ' '
        } else {
          if (isFullWidth) {
            tokenBefore.spaceAfter = ''
            contentTokenBefore.spaceAfter = ''
          } else {
            const markSide = getMarkSide(findTokenAfter(group, contentTokenBefore))
            contentTokenBefore.spaceAfter = markSide === 'left' ? ' ' : ''
            tokenBefore.spaceAfter = markSide === 'left' ? '' : ' '
          }
        }
      }
    }
    const tokenAfter = findTokenAfter(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    if (tokenAfter) {
      if (!contentTokenAfter) {
        token.spaceAfter = ''
      } else {
        const isFullWidth = quoteIsFullWidth(token.endContent)
        if (contentTokenAfter === tokenAfter) {
          token.spaceAfter = isFullWidth ? '' : ' '
        } else {
          const tokenBeforeContentTokenAfter = findTokenBefore(group, contentTokenAfter)
          if (isFullWidth) {
            token.spaceAfter = ''
            tokenBeforeContentTokenAfter.spaceAfter = ''
          } else {
            const markSide = getMarkSide(tokenAfter)
            token.spaceAfter = markSide === 'left' ? ' ' : ''
            tokenBeforeContentTokenAfter.spaceAfter = markSide === 'left' ? '' : ' '
          }
        }
      }
      if (quoteIsFullWidth(token.endContent)) {
        token.spaceAfter = ''
      } else {
        token.spaceAfter = ' '
      }
    }
  }
}
