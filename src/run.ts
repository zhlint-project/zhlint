import { Block, Data } from './hypers/types'
import { Validation } from './logger'
import { IgnoredCase, IgnoredMark } from './ignore'

import replaceBlocks from './replace-block'
import { parse, toMutableResult, Handler } from './parser'
import processRule from './process-rule'
import join from './join'
import findIgnoredMarks from './ignore'
import { env } from './logger'

import ignore from './hypers/ignore'
import hexo from './hypers/hexo'
import vuepress from './hypers/vuepress'
import md from './hypers/md'

import markRaw from './rules/mark-raw'
import markHyper from './rules/mark-hyper'
import unifyPunctuation from './rules/unify-punctuation'
import caseAbbr from './rules/case-abbr'
import spaceFullWidthContent from './rules/space-full-width-content'
import spacePunctuation from './rules/space-punctuation'
import caseMathExp from './rules/case-math-exp'
import caseBackslash from './rules/case-backslash'
import spaceBrackets from './rules/space-brackets'
import spaceQuotes from './rules/space-quotes'
import caseTraditional from './rules/case-traditional'
import caseDatetime from './rules/case-datetime'
import caseDatetimeZh from './rules/case-datetime-zh'
import caseEllipsis from './rules/case-ellipsis'
import caseHtmlEntity from './rules/case-html-entity'
import caseRaw from './rules/case-raw'
import caseLinebreak from './rules/case-linebreak'
// import markRawReview from './rules/mark-raw-review'

const hyperParseInfo = [
  { name: 'ignore', value: ignore },
  { name: 'hexo', value: hexo },
  { name: 'vuepress', value: vuepress },
  { name: 'markdown', value: md }
]

/**
 * rules
 * - mark-raw: content-hyper: <code>...</code>|`...` -> one space outside
 * - mark-hyper: hyper-mark: if has space in seq then ensure space outside
 * - unify-punctuation:
 *   - half-width -> full-width,
 *     - except {half}:{half}
 * - abbr: e.g. Mr. vs.
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
 * - case-backslash: \
 *   - half width and no raw space after -> no space after
 *   - full width before -> one space before
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
 * - case-linebreak: preserve all rawSpaceAfter includes '\n'
 * - mark-raw-review: remove unnecessary validations
 */
const rulesInfo = [
  { name: 'mark-raw', value: markRaw },
  { name: 'mark-hyper', value: markHyper },
  { name: 'unify-punctuation', value: unifyPunctuation },
  { name: 'case-abbr', value: caseAbbr },
  { name: 'space-full-width-content', value: spaceFullWidthContent },
  { name: 'space-punctuation', value: spacePunctuation },
  { name: 'case-math-exp', value: caseMathExp },
  { name: 'case-backslash', value: caseBackslash },
  { name: 'space-brackets', value: spaceBrackets },
  { name: 'space-quotes', value: spaceQuotes },
  { name: 'case-traditional', value: caseTraditional },
  { name: 'case-datetime', value: caseDatetime },
  { name: 'case-datetime-zh', value: caseDatetimeZh },
  { name: 'case-ellipsis', value: caseEllipsis },
  { name: 'case-html-entity', value: caseHtmlEntity },
  { name: 'case-raw', value: caseRaw },
  { name: 'case-linebreak', value: caseLinebreak }
]

const arrToMap = <T>(
  arr: { name: string; value: T }[]
): { [name: string]: T } =>
  arr.reduce((current, { name, value }) => {
    current[name] = value
    return current
  }, {})

const hyperParseMap = arrToMap<(data: Data) => Data>(hyperParseInfo)
const ruleMap = arrToMap<Handler>(rulesInfo)

const matchCallArray = <T>(calls: unknown[], map: { [name: string]: T }): T[] =>
  calls
    .map((call) => {
      switch (typeof call) {
        case 'function':
          return call
        case 'string':
          return map[call]
        default:
          return null
      }
    })
    .filter(Boolean) as T[]

export type Options = {
  logger?: Console
  rules?: (string | Handler)[]
  hyperParse?: (string | ((data: Data) => Data))[] | ((data: Data) => Data)
  ignoredCases?: IgnoredCase[]
}

export type Result = {
  file?: string
  disabled?: boolean
  origin: string
  result: string
  validations: Validation[]
}

const run = (str: string, options: Options = {}): Result => {
  // return if the file is totally ignored
  const disabledMatcher = /<!--\s*zhlint\s*disabled\s*-->/g
  if (str.match(disabledMatcher)) {
    return { origin: str, result: str, validations: [], disabled: true }
  }

  // init logger
  const logger = options.logger || env.defaultLogger

  // init rules, hyper parsers, and ignored cases
  const ignoredCases = options.ignoredCases || []
  const rulesInput = options.rules || rulesInfo.map((item) => item.name)
  let hyperParserList: (string | ((data: Data) => Data))[]
  if (typeof options.hyperParse === 'function') {
    hyperParserList = [options.hyperParse]
  } else {
    hyperParserList =
      options.hyperParse || hyperParseInfo.map((item) => item.name)
  }

  // init data
  // str -> ignoredByRules, ignoredByParsers
  // blocks -> marks, ignoredMarks
  const data: Data = {
    content: str,
    modifiedContent: str,
    ignoredByRules: ignoredCases,
    ignoredByParsers: [],
    blocks: [
      {
        value: str,
        marks: [],
        start: 0,
        end: str.length - 1
      }
    ]
  }

  const allValidations: Validation[] = []
  const allIgnoredMarks: IgnoredMark[] = []

  // Run all the hyper parsers
  const finalData = matchCallArray<(data: Data) => Data>(
    hyperParserList,
    hyperParseMap
  ).reduce((current, parse) => parse(current), data)

  // 1. Parse each block without ignoredByParsers
  // 2. Parse all ignoredByRules into marks for each block
  // 3. Run all rule processes for each block
  // 4. Push all ignored marks into allIgnoredMarks for each block
  // 5. Join all tokens with ignoredMarks and allValidations for each block
  // 6. Replace each block back to the string
  const result = replaceBlocks(
    str,
    finalData.blocks.map(({ value, marks, start, end }) => {
      const result = toMutableResult(parse(value, marks))
      const ignoredMarks = findIgnoredMarks(value, data.ignoredByRules, logger)
      matchCallArray(rulesInput, ruleMap).forEach((rule) =>
        processRule(result, rule)
      )
      ignoredMarks.forEach((mark) => allIgnoredMarks.push(mark))
      return {
        start,
        end,
        value: join(result.tokens, ignoredMarks, allValidations, start)
      } as Block
    })
  )

  // filter allValidations with allIgnoredMarks
  const validations = allValidations.filter(({ index }) =>
    allIgnoredMarks.length > 0
      ? allIgnoredMarks.some(({ start, end }) => index >= start && index <= end)
      : true
  )

  return { origin: str, result, validations }
}

export default run
