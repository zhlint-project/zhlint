const {
  findTokenBefore,
  findTokenAfter,
  removeValidation
} = require('./util')

const abbrs = [
  'Mr.',
  'Mrs.',
  'Dr.',
  'Jr.',
  'Sr.',
  'vs.',
  'etc.',
  'i.e.',
  'e.g.',
  'a.k.a.'
].map(str => str.split('.').reverse().slice(1))

const hasAbbr = (token, group, abbrs) => {
  const tokenBefore = findTokenBefore(group, token)
  if (
    tokenBefore &&
    !tokenBefore.rawSpaceAfter
  ) {
    const matchedAbbrs = abbrs
      .filter(abbr => abbr[0] === tokenBefore.content)
      .map(abbr => abbr.slice(1))
    if (matchedAbbrs && matchedAbbrs.length) {
      const lastMatched = matchedAbbrs[matchedAbbrs.length - 1]
      if (lastMatched.length) {
        const tokenBeforeBefore = findTokenBefore(group, tokenBefore)
        if (
          tokenBeforeBefore &&
          !tokenBeforeBefore.rawSpaceAfter &&
          tokenBeforeBefore.raw === '.'
        ) {
          const result = hasAbbr(tokenBeforeBefore, group, matchedAbbrs)
          if (result) {
            return [tokenBefore, ...result]
          }
        }
      } else {
        return [tokenBefore.content]
      }
    }
  }
}

module.exports = (token, index, group, matched, marks) => {
  if (token.raw === '.') {

    // end of the content or has space after or full-width content after
    const tokenAfter = findTokenAfter(group, token)
    if (
      tokenAfter &&
      tokenAfter.type === 'content-half' &&
      !token.rawSpaceAfter
    ) {
      return
    }

    // raw content back match abbrs and no raw space after
    const result = hasAbbr(token, group, abbrs)

    // then keep all periods as they are
    if (result) {
      result.forEach((content, i) => {
        const periodToken = group[index - i * 2]
        if (periodToken.content !== '.') {
          removeValidation(periodToken, 'content', 'unify-punctuation')
        }
        periodToken.content = '.'
        periodToken.type = 'punctuation-half'
      })
    }
  }
}
