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
  // todo: special cases? dot dot dot, hyphen hyphen?
  if (token.type === 'punctuation-half') {
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
