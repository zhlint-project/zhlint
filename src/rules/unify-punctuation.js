const {
  findTokenBefore,
  findContentTokenBefore,
  findContentTokenAfter
} = require('./util')

const halfWidthMap = {
  '（': `(`,
  '）': `)`,
}

const fullWidthMap = {
  ',': `，`,
  '.': `。`,
  ';': `；`,
  ':': `：`,
  '?': `？`,
  '!': `！`,
}

module.exports = (token, index, group, matched, marks) => {
  // full-width: comma, full stop, colon, quotes
  // half-width: brackets
  // no change for half-width puncatuation between half-width content without space
  if (token.type === 'punctuation-half') {
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    const tokenBefore = findTokenBefore(group, token)
    const tokenBeforeContentTokenAfter = findTokenBefore(group, contentTokenAfter)
    if (contentTokenBefore && contentTokenBefore.type === 'content-half'
      && contentTokenAfter && contentTokenAfter.type === 'content-half'
      && !contentTokenBefore.spaceAfter
      && !tokenBefore.spaceAfter
      && !token.spaceAfter
      && !tokenBeforeContentTokenAfter.spaceAfter) {
      return
    }
    token.content = fullWidthMap[token.content] || token.content
  }
  if (token.type === 'punctuation-width') {
    token.content = halfWidthMap[token.content] || token.content
  }
  if (token.type === 'group') {
    if (token.startContent === '"') {
      token.startContent = '“'
    }
    if (token.startContent === "'") {
      token.startContent = '‘'
    }
    if (token.endContent === '"') {
      token.endContent = '”'
    }
    if (token.endContent === "'") {
      token.endContent = '’'
    }
  }
}
