import { ParsedStatus } from './hypers/types.js'
import { IgnoredCase } from './ignore.js'
import { Options as RuleOptions } from './rules/util.js'

export type Options = {
  logger?: Console
  rules?: RuleOptions
  hyperParse?:
    | (string | ((status: ParsedStatus) => ParsedStatus))[]
    | ((status: ParsedStatus) => ParsedStatus)
  ignoredCases?: IgnoredCase[]
}

export type NormalizedOptions = {
  logger: Console
  rules: RuleOptions
  hyperParse: Array<(status: ParsedStatus) => ParsedStatus>
  ignoredCases: IgnoredCase[]
}

import ignore, { parseIngoredCase } from './hypers/ignore.js'
import hexo from './hypers/hexo.js'
import vuepress from './hypers/vuepress.js'
import md from './hypers/md.js'

import { defaultConfig as defaultRules } from './rules/index.js'

import { env } from './report.js'
import { Config } from './rc/index.js'

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

const DEPRECATED_OPTIONS = {
  halfWidthPunctuation: 'halfwidthPunctuation',
  fullWidthPunctuation: 'fullwidthPunctuation',
  adjustedFullWidthPunctuation: 'adjustedFullwidthPunctuation',
  spaceBetweenHalfWidthLetters: 'spaceBetweenHalfwidthContent',
  spaceBetweenHalfWidthContent: 'spaceBetweenHalfwidthContent',
  noSpaceBetweenFullWidthLetters: 'noSpaceBetweenFullwidthContent',
  noSpaceBetweenFullWidthContent: 'noSpaceBetweenFullwidthContent',
  spaceBetweenMixedWidthLetters: 'spaceBetweenMixedwidthContent',
  spaceBetweenMixedWidthContent: 'spaceBetweenMixedwidthContent',
  noSpaceBeforePunctuation: 'noSpaceBeforePauseOrStop',
  spaceAfterHalfWidthPunctuation: 'spaceAfterHalfwidthPauseOrStop',
  noSpaceAfterFullWidthPunctuation: 'noSpaceAfterFullwidthPauseOrStop',
  spaceOutsideHalfQuote: 'spaceOutsideHalfwidthQuotation',
  noSpaceOutsideFullQuote: 'noSpaceOutsideFullwidthQuotation',
  noSpaceInsideQuote: 'noSpaceInsideQuotation',
  spaceOutsideHalfBracket: 'spaceOutsideHalfwidthBracket',
  noSpaceOutsideFullBracket: 'noSpaceOutsideFullwidthBracket',
  noSpaceInsideWrapper: 'noSpaceInsideHyperMark',
  noSpaceInsideMark: 'noSpaceInsideHyperMark'
}

const deprecateOptions = (ruleOption: RuleOptions, logger: Console): void => {
  for (const oldKey in DEPRECATED_OPTIONS) {
    const newKey = DEPRECATED_OPTIONS[oldKey]
    if (ruleOption[oldKey]) {
      logger.warn(`[deprecate] ${oldKey} is deprecated, use ${newKey} instead`)
      ruleOption[newKey] = ruleOption[newKey] ?? ruleOption[oldKey]
      delete ruleOption[oldKey]
    }
  }
}

export const normalizeOptions = (options: Options): NormalizedOptions => {
  const logger = options.logger ?? env.defaultLogger

  const rules = options.rules ?? {}
  const preset = rules.preset === 'default' ? defaultRules : {}
  deprecateOptions(rules, logger)

  let hyperParse: Array<string | ((status: ParsedStatus) => ParsedStatus)>

  if (typeof options.hyperParse === 'function') {
    hyperParse = [options.hyperParse]
  } else {
    hyperParse = options.hyperParse || hyperParseInfo.map((item) => item.name)
  }

  const normoalizedOptions: NormalizedOptions = {
    logger,
    ignoredCases: options.ignoredCases || [],
    rules: { ...preset, ...rules },
    hyperParse: matchCallArray<(status: ParsedStatus) => ParsedStatus>(
      hyperParse,
      hyperParseMap
    )
  }

  return normoalizedOptions
}

export const normalizeConfig = (
  config: Config,
  logger: Console = env.defaultLogger
): NormalizedOptions => {
  const options: NormalizedOptions = {
    logger,
    rules: {},
    hyperParse: [],
    ignoredCases: []
  }
  let hyperParse: string[] = []

  // preset
  if (config.preset === 'default') {
    options.rules = { ...defaultRules }
    hyperParse = hyperParseInfo.map((item) => item.name)
  }

  // rules
  if (config.rules) {
    options.rules = { ...options.rules, ...config.rules }
  }

  // hyper parsers
  if (Array.isArray(config.hyperParsers)) {
    hyperParse = config.hyperParsers
  }
  hyperParse.forEach((x) => {
    if (!hyperParseMap[x]) {
      logger.log(`The hyper parser ${x} is invalid.`)
      return
    }
    options.hyperParse.push(hyperParseMap[x])
  })

  // ignored cases
  if (config.caseIgnores) {
    config.caseIgnores.forEach((x) => {
      const ignoredCase = parseIngoredCase(x)
      if (ignoredCase) {
        options.ignoredCases.push(ignoredCase)
      } else {
        logger.log(`The format of ignore case: "${x}" is invalid.`)
      }
    })
  }

  return options
}
