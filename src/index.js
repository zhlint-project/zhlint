const replaceBlocks = require('./replace-block')
const parse = require('./parse')
const processRule = require('./process-rule')
const join = require('./join')
const findIgnoredMarks = require('./find-ignored-marks')

const hexoParser = require('./parsers/hexo')
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

const parserMap = {
  hexo: hexoParser,
  markdown: markdownParser
}
const ruleMap = {
  'mark-raw': markRaw,
  'mark-hyper': markHyper,
  'unify-punctuation': unifyPunctuation,
  'space-full-width-content': spaceFullWidthContent,
  'space-punctuation': spacePunctuation,
  'case-math-exp': caseMathExp,
  'space-brackets': spaceBrackets,
  'space-quotes': spaceQuotes,
  'case-traditional': caseTraditional,
  'case-datetime': caseDatetime,
  'case-datetime-zh': caseDatetimeZh,
  'case-ellipsis': caseEllipsis,
  'case-html-entity': caseHtmlEntity,
  'case-raw': caseRaw
}

const matchCallArray = (calls, map) => calls.map(call => {
  switch (typeof call) {
    case 'function':
    return call
    case 'string':
    return map[call]
    default:
    return null
  }
}).filter(Boolean)

const lint = (
  str,
  rules = [
    'mark-raw',
    'mark-hyper',
    'unify-punctuation',
    'space-full-width-content',
    'space-punctuation',
    'case-math-exp',
    'space-brackets',
    'space-quotes',
    'case-traditional',
    'case-datetime',
    'case-datetime-zh',
    'case-ellipsis',
    'case-html-entity',
    'case-raw'
  ],
  hyperParse = [
    'hexo',
    'markdown'
  ],
  ignoredCases = []
) => {
  if (typeof hyperParse === 'function') {
    hyperParse = [hyperParse]
  }
  if (!Array.isArray) {
    hyperParse = [
      str => [{
        value: str,
        marks: [],
        start: 0,
        end: str.length - 1
      }]
    ]
  }

  const blocks = matchCallArray(hyperParse, parserMap)
    .reduce((current, parse) => parse(current), str)

  return replaceBlocks(str, blocks.map(({ value, marks, start, end }) => {
    const data = parse(value, marks)
    const ignoredMarks = findIgnoredMarks(value, ignoredCases)
    matchCallArray(rules, ruleMap).forEach(rule => processRule(data, rule))
    return {
      start, end,
      value: join(data.tokens, ignoredMarks)
    }
  }))
}

module.exports = lint
