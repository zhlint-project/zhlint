module.exports = (token, index, group, matched, marks) => {
  // token is a punctuation between 2 contents
  // (exception: between 2 half-width content)
  // full-width -> no space
  // half-width -> one space after
  // todo: spacial cases? short single quote, datetime, score
  if (token.type.match(/^punctuation\-/)) {
    const tokenBefore = group[index - 1]
    const tokenAfter = group[index + 1]
    if (tokenBefore && tokenAfter
      && tokenBefore.type.match(/^content\-/)
      && tokenAfter.type.match(/^content\-/)
      && (
        tokenBefore.type !== 'content-half'
        || tokenAfter.type !== 'content-half'
      )
    ) {
      tokenBefore.spaceAfter = ''
      if (token.type === 'punctuation-half') {
        token.spaceAfter = ' '
      }
      if (token.type === 'punctuation-full') {
        token.spaceAfter = ''
      }
    }
  }
}
