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
  findContentTokenAfter,
  getMarkSide,
  removeValidation,
  addValidation
} = require('./util')

const messages = {
  'outside-half': 'There should be one space outside half-width brackets',
  'outside-full': 'There should be on space outside full-width brackets',
  'inside': 'There should be no space inside brackets',
}

const validate = (token, type, condition) => {
  if (condition) {
    removeValidation(token, '', 'spaceAfter')
    addValidation(token, 'space-brackets', 'spaceAfter', messages[type])
  }
}

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
              if (getMarkSide(tokenBefore) === 'left') {
                validate(contentTokenBefore, 'outside-half', contentTokenBefore.rawSpaceAfter !== ' ')
                contentTokenBefore.spaceAfter = ' '
              } else {
                validate(tokenBefore, 'outside-half', tokenBefore.rawSpaceAfter !== ' ')
                tokenBefore.spaceAfter = ' '
              }
            } else {
              validate(contentTokenBefore, 'outside-half', contentTokenBefore.rawSpaceAfter !== ' ')
              contentTokenBefore.spaceAfter = ' '
            }
          }
        } else {
          validate(contentTokenBefore, 'outside-full', contentTokenBefore.rawSpaceAfter)
          contentTokenBefore.spaceAfter = ''
        }
      }
      validate(token, 'inside', token.rawSpaceAfter)
      token.spaceAfter = ''
    }
    if (markSide === 'right') {
      if (tokenBefore) {
        validate(tokenBefore, 'inside', tokenBefore.rawSpaceAfter)
        tokenBefore.spaceAfter = ''
      }
      if (contentTokenAfter) {
        const contentTokenAfterBefore = findTokenBefore(group, contentTokenAfter)
        if (size === 'half-width') {
          if (contentTokenAfter.type !== 'content-half') {
            if (contentTokenAfterBefore !== token) {
              if (getMarkSide(contentTokenAfterBefore) === 'right') {
                validate(contentTokenAfterBefore, 'outside-half', contentTokenAfterBefore.rawSpaceAfter !== ' ')
                contentTokenAfterBefore.spaceAfter = ' '
              } else {
                validate(token, 'outside-half', token.rawSpaceAfter !== ' ')
                token.spaceAfter = ' '
              }
            } else {
              validate(contentTokenAfterBefore, 'outside-half', contentTokenAfterBefore.rawSpaceAfter !== ' ')
              contentTokenAfterBefore.spaceAfter = ' '
            }
          }
        } else {
          validate(contentTokenAfterBefore, 'outside-full', contentTokenAfterBefore.rawSpaceAfter)
          contentTokenAfterBefore.spaceAfter = ''
        }
      }
    }
  }
}
