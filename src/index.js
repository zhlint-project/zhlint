const replaceBlocks = require('./replace-block')
const parse = require('./parse')
const processRule = require('./process-rule')
const join = require('./join')
const findIgnoredMarks = require('./find-ignored-marks')

const markdownParser = require('./parsers/md')

const markHyper = require('./rules/mark-hyper')
const markRaw = require('./rules/mark-raw')
const spacePunctuation = require('./rules/space-punctuation')
const spaceBrackets = require('./rules/space-brackets')
const spaceQuotes = require('./rules/space-quotes')
const spaceFullWidthContent = require('./rules/space-full-width-content')
const unifyPunctuation = require('./rules/unify-punctuation')
const caseTraditional = require('./rules/case-traditional')
const caseDatetime = require('./rules/case-datetime')
const caseDatetimeZh = require('./rules/case-datetime-zh')
const caseMathExp = require('./rules/case-math-exp')
const caseEllipsis = require('./rules/case-ellipsis')
const caseHtmlEntity = require('./rules/case-html-entity')
const caseRaw = require('./rules/case-raw')

const ruleMap = {
  'mark-hyper': markHyper,
  'mark-raw': markRaw,
  'space-punctuation': spacePunctuation,
  'space-brackets': spaceBrackets,
  'space-quotes': spaceQuotes,
  'space-full-width-content': spaceFullWidthContent,
  'unify-punctuation': unifyPunctuation,
  'case-traditional': caseTraditional,
  'case-datetime': caseDatetime,
  'case-datetime-zh': caseDatetimeZh,
  'case-math-exp': caseMathExp
}

const matchRules = rules => rules.map(rule => {
  switch (typeof rule) {
    case 'function':
    return rule
    case 'string':
    return ruleMap[rule]
    default:
    return
  }
}).filter(Boolean)

const lint = (
  str,
  rules = [
    markRaw,
    markHyper,
    unifyPunctuation,
    spaceFullWidthContent,
    spacePunctuation,
    caseMathExp,
    spaceBrackets,
    spaceQuotes,
    caseTraditional,
    caseDatetime,
    caseDatetimeZh,
    caseEllipsis,
    caseHtmlEntity,
    caseRaw
  ],
  hyperParse = markdownParser,
  ignoredCases = []
) => {
  const blocks =
    typeof hyperParse === 'function'
      ? hyperParse(str)
      : [{
          value: str,
          marks: [],
          start: 0,
          end: str.length - 1
        }]
  return replaceBlocks(str, blocks.map(({ value, marks, start, end }) => {
    const data = parse(value, marks)
    const ignoredMarks = findIgnoredMarks(value, ignoredCases)
    matchRules(rules).forEach(rule => processRule(data, rule))
    return {
      start, end,
      value: join(data.tokens, ignoredMarks)
    }
  }))
}

module.exports = lint
