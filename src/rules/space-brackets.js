// deps:
// - for hyper marks, should move inside spaces outside
// - for raw marks, should ensure spaces out of both sides
// examples:
// - a ** (a) ** a -> a **(a)** a -> a **(a)** a
// - a** (a) **a   -> a **(a)** a -> a **(a)** a
// - a **(a)** a   -> a **(a)** a -> a **(a)** a
// - a**(a)**a     -> a **(a)** a -> a **(a)** a
// - a( ** a ** )a -> a( **a** )a -> a (**a**) a
// - a(** a **)a   -> a( **a** )a -> a (**a**) a
// - a( **a** )a   -> a( **a** )a -> a (**a**) a
// - a(**a**)a     -> a( **a** )a -> a (**a**) a

const {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findContentTokenAfter
} = require('./util')

module.exports = (token, index, group, matched, marks) => {
  // half-width: one space outside
  // half-width: no space inside
  // add outside space out of marks
  if (token.type === 'mark-brackets') {
    const tokenBefore = findTokenBefore(group, token)
    const contentTokenBefore = findContentTokenBefore(group, token)
    const tokenAfter = findTokenAfter(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    const { markSide } = token
    const size = token.content.match(/[\(\)]/) ? 'half-width' : 'full-width'
    if (markSide === 'left') {
      if (contentTokenBefore) {
        if (size === 'half-width' && contentTokenBefore) {
          if (contentTokenBefore.type !== 'content-half') {
            if (contentTokenBefore !== tokenBefore) {
              if (tokenBefore.markSide === 'left') {
                contentTokenBefore.spaceAfter = ' '
              } else {
                tokenBefore.spaceAfter = ' '
              }
            } else {
              contentTokenBefore.spaceAfter = ' '
            }
          }
        } else {
          contentTokenBefore.spaceAfter = ''
        }
      }
      token.spaceAfter = ''
    }
    if (markSide === 'right') {
      if (tokenBefore) {
        tokenBefore.spaceAfter = ''
      }
      if (contentTokenAfter) {
        const contentTokenAfterBefore = findTokenBefore(group, contentTokenAfter)
        if (size === 'half-width') {
          if (contentTokenAfter.type !== 'content-half') {
            if (contentTokenAfterBefore !== token) {
              if (contentTokenAfterBefore.markSide === 'right') {
                contentTokenAfterBefore.spaceAfter = ' '
              } else {
                token.spaceAfter = ' '
              }
            } else {
              contentTokenAfterBefore.spaceAfter = ' '
            }
          }
        } else {
          contentTokenAfterBefore.spaceAfter = ''
        }
      }
    }
  }
}
