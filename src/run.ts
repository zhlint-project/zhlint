import { Block, ParsedStatus } from './hypers/types'
import { Validation } from './report'
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

import generateHandlers, { defaultConfig as defaultRules } from './rules'

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

const hyperParseMap =
  arrToMap<(status: ParsedStatus) => ParsedStatus>(hyperParseInfo)

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
  // TODO: deprecate string[]
  hyperParse?:
    | (string | ((status: ParsedStatus) => ParsedStatus))[]
    | ((status: ParsedStatus) => ParsedStatus)
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
  const preset = options.rules?.preset === 'default' ? defaultRules : {}
  const ruleOptions = { ...preset, ...options.rules }
  const rules = generateHandlers(ruleOptions)
  let hyperParserList: (string | ((status: ParsedStatus) => ParsedStatus))[]
  if (typeof options.hyperParse === 'function') {
    hyperParserList = [options.hyperParse]
  } else {
    hyperParserList =
      options.hyperParse || hyperParseInfo.map((item) => item.name)
  }

  // init status
  // str -> ignoredByRules, ignoredByParsers
  // blocks -> marks, ignoredMarks
  const status: ParsedStatus = {
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

  const parserErrors: Validation[] = []
  const ruleErrors: Validation[] = []
  const allIgnoredMarks: IgnoredMark[] = []

  // Run all the hyper parsers
  const parsedStatus = matchCallArray<(status: ParsedStatus) => ParsedStatus>(
    hyperParserList,
    hyperParseMap
  ).reduce((current, parse) => parse(current), status)

  // 1. Parse each block without ignoredByParsers
  // 2. Parse all ignoredByRules into marks for each block
  // 3. Run all rule processes for each block
  // 4. Push all ignored marks into allIgnoredMarks for each block
  // 5. Join all tokens with ignoredMarks and all errors for each block
  // 6. Replace each block back to the string
  const modifiedBlocks: Block[] = parsedStatus.blocks.map(
    ({ value, marks, start, end }) => {
      let lastValue = value
      if (global.__DEV__) {
        logger.log('[Original block value]')
        logger.log(lastValue)
      }
      const result = toMutableResult(parse(value, marks), ruleOptions)
      parserErrors.push(...result.errors)
      const ignoredMarks = findIgnoredMarks(value, status.ignoredByRules, logger)

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
      lastValue = join(result.tokens, ignoredMarks, ruleErrors, start)
      if (global.__DEV__) {
        logger.log('[Eventual block value]')
        logger.log(lastValue + '\n')
      }
      return {
        start,
        end,
        value: lastValue
      } as Block
    }
  )

  return {
    origin: str,
    result: replaceBlocks(str, modifiedBlocks),
    validations: [...parserErrors, ...ruleErrors].filter(({ index }) =>
      allIgnoredMarks.length
        ? allIgnoredMarks.some(
            ({ start, end }) => index >= start && index <= end
          )
        : true
    )
  }
}

export default run
