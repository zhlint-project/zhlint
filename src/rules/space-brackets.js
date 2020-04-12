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
  findSpaceAfterHost,
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
  removeValidation(token, '', 'spaceAfter')
  if (condition) {
    addValidation(token, 'space-brackets', 'spaceAfter', messages[type])
  }
}

const checkSide = (spaceAfterHost, size, isRawContent, isOutside, areBothHalfWidthContent) => {
  if (isOutside) {
    if (size === 'half-width') {
      if (areBothHalfWidthContent) {
        return
      }
      validate(spaceAfterHost, 'outside-half', isRawContent && spaceAfterHost.spaceAfter !== ' ')
      spaceAfterHost.spaceAfter = ' '
    } else {
      validate(spaceAfterHost, 'outside-full', isRawContent && spaceAfterHost.spaceAfter)
      spaceAfterHost.spaceAfter = ''
    }
  } else {
    validate(spaceAfterHost, 'inside', isRawContent && spaceAfterHost.spaceAfter)
    spaceAfterHost.spaceAfter = ''
  }
}

module.exports = (token, index, group, matched, marks) => {
  if (token.type === 'mark-brackets') {
    const isRawContent = token.content === token.raw
    const size = token.content.match(/[\(\)]/) ? 'half-width' : 'full-width'
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    if (contentTokenBefore) {
      const tokenBefore = findTokenBefore(group, token)
      const spaceAfterHost = findSpaceAfterHost(group, contentTokenBefore, tokenBefore)
      checkSide(spaceAfterHost, size, isRawContent, token.markSide === 'left',
        contentTokenAfter
        && contentTokenBefore.type === 'content-half'
        && contentTokenAfter.type === 'content-half'
        && token.markSide === 'left')
    }
    if (contentTokenAfter) {
      const tokenBeforeContentAfter = findTokenBefore(group, contentTokenAfter)
      const spaceAfterHost = findSpaceAfterHost(group, token, tokenBeforeContentAfter)
      checkSide(spaceAfterHost, size, isRawContent, token.markSide === 'right',
        contentTokenBefore
        && contentTokenBefore.type === 'content-half'
        && contentTokenAfter.type === 'content-half'
        && token.markSide === 'right')
    }
  }
}
