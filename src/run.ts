import { Block, Data } from './hypers/types'
import { Validation, ValidationTarget } from './report'
import { IgnoredCase, IgnoredMark } from './ignore'
import { Options as RuleOptions } from './rules/util'

import replaceBlocks from './replace-block'
import { parse, toMutableResult } from './parser'
import processRule from './process-rule'
import join from './join'
import findIgnoredMarks from './ignore'
import { env } from './report'

import ignore from './hypers/ignore'
import hexo from './hypers/hexo'
import vuepress from './hypers/vuepress'
import md from './hypers/md'

import { generateHandlers } from './rules'
import { MutableParseResult, ParseError } from './parser/parse'

const hyperParseInfo = [
  { name: 'ignore', value: ignore },
  { name: 'hexo', value: hexo },
  { name: 'vuepress', value: vuepress },
  { name: 'markdown', value: md }
]
const arrToMap = <T>(
  arr: { name: string; value: T }[]
): { [name: string]: T } =>
  arr.reduce((current, { name, value }) => {
    current[name] = value
    return current
  }, {})

const hyperParseMap = arrToMap<(data: Data) => Data>(hyperParseInfo)

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
  rules?: RuleOptions
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

  // init rules, hyper parsers, rule options, and ignored cases
  const ignoredCases = options.ignoredCases || []
  const rules = generateHandlers(options.rules || {})
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
  const parseErrors: Validation[] = []
  const result = replaceBlocks(
    str,
    finalData.blocks.map(({ value, marks, start, end }) => {
      let lastValue = value
      if (global.__DEV__) {
        logger.log('[Original block value]')
        logger.log(lastValue)
      }
      let result: MutableParseResult
      try {
        result = toMutableResult(parse(value, marks))
      } catch (error) {
        result = toMutableResult((error as ParseError).status)
        parseErrors.push({
          name: '',
          target: ValidationTarget.CONTENT,
          index: (error as ParseError).index,
          length: 0,
          message: error.message
        })
      }
      const ignoredMarks = findIgnoredMarks(value, data.ignoredByRules, logger)

      rules.forEach((rule) => {
        processRule(result, rule)
        if (global.__DEV__) {
          const currentValue = join(result.tokens, ignoredMarks, [], start)
          if (lastValue !== currentValue) {
            logger.log(`[After process by ${rule.name}]`)
            logger.log(currentValue)
          }
          lastValue = currentValue
        }
      })

      ignoredMarks.forEach((mark) => allIgnoredMarks.push(mark))
      lastValue = join(result.tokens, ignoredMarks, allValidations, start)
      if (global.__DEV__) {
        logger.log('[Eventual block value]')
        logger.log(lastValue + '\n')
      }
      return {
        start,
        end,
        value: lastValue
      } as Block
    })
  )

  // filter allValidations with allIgnoredMarks
  const validations = [...parseErrors, ...allValidations].filter(({ index }) =>
    allIgnoredMarks.length > 0
      ? allIgnoredMarks.some(({ start, end }) => index >= start && index <= end)
      : true
  )

  return { origin: str, result, validations }
}

export default run
