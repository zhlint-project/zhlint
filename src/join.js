/**
 * Join tokens back into string
 * @param  {Array<Token>} tokens
 * @return {string}
 */
const join = tokens => [
  tokens.startContent,
  tokens.innerSpaceBefore,
  ...tokens.map(token =>
    Array.isArray(token)
      ? join(token)
      : [
          token.content,
          token.spaceAfter
        ].filter(Boolean).join('')
  ),
  tokens.endContent,
  tokens.spaceAfter
].filter(Boolean).join('')

module.exports = join
