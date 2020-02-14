const replaceBlocks = require('./replace-block')
const parse = require('./parse')
const processRule = require('./process-rule')
const join = require('./join')

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

const lint = (
  str,
  rules = [
    markHyper,
    markRaw,
    spaceFullWidthContent,
    spacePunctuation,
    caseMathExp,
    spaceBrackets,
    spaceQuotes,
    unifyPunctuation,
    caseTraditional,
    caseDatetime,
    caseDatetimeZh
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
    const data = parse(value, marks, ignoredCases)
    rules.forEach(rule => processRule(data, rule))
    return {
      start, end,
      value: join(data.tokens)
    }
  }))
}

module.exports = lint
