const ignoredCaseMatcher = /^(?:(?<prefix>.+?)\-,)?(?<textStart>.+?)(?:,(?<textEnd>.+?))?(?:,\-(?<suffix>.+?))?$/

const parseIngoredCase = text => {
  const matchResult = text.match(ignoredCaseMatcher)
  if (matchResult) {
    const {
      prefix,
      textStart,
      textEnd,
      suffix
    } = matchResult.groups
    return {
      prefix,
      textStart,
      textEnd,
      suffix
    }
  }
}

module.exports = data => {
  const { ignoredByRules, raw } = data
  const matcher = /<\!\-\-\szhlint\signore\:\s*(.+?)\s*\-\-\>/g
  let result
  while ((result = matcher.exec(raw)) !== null) {
    const ignoredCase = parseIngoredCase(result[1])
    if (ignoredCase) {
      ignoredByRules.push(ignoredCase)
    }
  }
  return data
}
