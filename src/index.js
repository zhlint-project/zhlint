const replaceBlocks = require('./replace-block')
const parse = require('./parse')
const processRule = require('./process-rule')
const join = require('./join')
const findIgnoredMarks = require('./find-ignored-marks')

const hexoParser = require('./parsers/hexo')
const markdownParser = require('./parsers/md')

const markRaw = require('./rules/mark-raw')
const markHyper = require('./rules/mark-hyper')
const unifyPunctuation = require('./rules/unify-punctuation')
const spaceFullWidthContent = require('./rules/space-full-width-content')
const spacePunctuation = require('./rules/space-punctuation')
const caseMathExp = require('./rules/case-math-exp')
const spaceBrackets = require('./rules/space-brackets')
const spaceQuotes = require('./rules/space-quotes')
const caseTraditional = require('./rules/case-traditional')
const caseDatetime = require('./rules/case-datetime')
const caseDatetimeZh = require('./rules/case-datetime-zh')
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

/**
 * rules
 * - mark-raw: content-hyper: <code>...</code>|`...` -> one space outside
 * - mark-hyper: hyper-mark: if has space in seq then ensure space outside
 * - unify-punctuation:
 *   - half-width -> full-width,
 *     - except {half}:{half}
 * - space-full-width-content: content-*:
 *   - <>...</> -> space outside,
 *   - different type -> one space
 * - space-punctuation: punctuation-*:
 *   - /[&%- -> void,
 *   - content before -> no space before, 
 *   - full-width -> no space beside
 *   - half-width -> one space after when either side is full-width content
 * - case-math-exp: punctuation-*: + - * / % =:
 *   - and 4 spaces,
 *   - except 0/0/0, 0-0-0, a-b, /, %, Chrome 53+
 * - space-brackets: mark-brackets:
 *   - half-width -> one space outside
 *   - half-width -> no space inside
 *     - add outside space out of marks
 * - space-quotes: group:
 *   - half-width -> one space outside, out of marks
 * - case-traditional: 「 『 』 」
 * - case-datetime: punctuation-*: 00:00:00
 * - case-datetime-zh: 0年0月0日0天0号0时0分0秒
 * - case-ellipsis: ...
 * - case-html-entity: &{half};
 * - case-raw: AC/DC
 */
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
