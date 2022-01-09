const {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findContentTokenAfter,
  findSpaceAfterHost,
  getMarkSide,
  addValidation
} = require('./util')

const quoteIsFullWidth = char => '‘’“”《》〈〉『』「」【】'.indexOf(char) >= 0

const messages = {
  inside: 'There should be no space inside quotes',
  'outside-full': 'There should be no space outside full-width quotes',
  'outside-half': 'There should be one space outside half-width quotes'
}

const validate = (token, type, target, condition) => {
  if (condition) {
    addValidation(token, 'space-quotes', target, messages[type])
  }
}

const checkOutside = (spaceAfterHost, quoteContent, isRawQuoteContent) => {
  if (spaceAfterHost) {
    if (quoteIsFullWidth(quoteContent)) {
      validate(spaceAfterHost, 'outside-full', 'spaceAfter', isRawQuoteContent && spaceAfterHost.spaceAfter)
      spaceAfterHost.spaceAfter = ''
    } else {
      validate(spaceAfterHost, 'outside-half', 'spaceAfter', isRawQuoteContent && spaceAfterHost.spaceAfter !== ' ')
      spaceAfterHost.spaceAfter = ' '
    }
  }
}

module.exports = (token, index, group, matched, marks) => {
  if (token.type === 'group') {

    // no space inside
    validate(token, 'inside', 'innerSpaceBefore', token.rawInnerSpaceBefore)
    token.innerSpaceBefore = ''
    const lastInnerToken = token[token.length - 1]
    if (lastInnerToken) {
      validate(lastInnerToken, 'inside', 'spaceAfter', lastInnerToken.rawSpaceAfter)
      lastInnerToken.spaceAfter = ''
    }

    // content before:
    // - one space if quote is half-width
    // - no space if quote is full-width
    const contentTokenBefore = findContentTokenBefore(group, token)
    if (contentTokenBefore) {
      const tokenBefore = findTokenBefore(group, token)
      const spaceAfterHost = findSpaceAfterHost(group, contentTokenBefore, tokenBefore)
      checkOutside(spaceAfterHost, token.startContent, token.startContent === token.rawStartContent)
    }

    // content after:
    // - one space if quote is half-width
    // - no space if quote is full-width
    const contentTokenAfter = findContentTokenAfter(group, token)
    if (contentTokenAfter) {
      const tokenBeforeContentAfter = findTokenBefore(group, contentTokenAfter)
      const spaceAfterHost = findSpaceAfterHost(group, token, tokenBeforeContentAfter)
      checkOutside(spaceAfterHost, token.endContent, token.endContent === token.rawEndContent)
    }
  }
}
