import { ParsedStatus } from './hypers/types'
import { IgnoredCase } from './ignore'
import { Options as RuleOptions } from './rules/util'

export type Options = {
  logger?: Console
  rules?: RuleOptions
  hyperParse?:
    | (string | ((status: ParsedStatus) => ParsedStatus))[]
    | ((status: ParsedStatus) => ParsedStatus)
  ignoredCases?: IgnoredCase[]
}

type NormalizedOptions = {
  logger: Console
  rules: RuleOptions
  hyperParse: Array<(status: ParsedStatus) => ParsedStatus>
  ignoredCases: IgnoredCase[]
}

import ignore from './hypers/ignore'
import hexo from './hypers/hexo'
import vuepress from './hypers/vuepress'
import md from './hypers/md'

import { defaultConfig as defaultRules } from './rules'

import { env } from './report'

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
  noSpaceInsideMark: 'noSpaceInsideWrapper',
  spaceBetweenHalfWidthContent: 'spaceBetweenHalfWidthLetters',
  noSpaceBetweenFullWidthContent: 'noSpaceBetweenFullWidthLetters',
  spaceBetweenMixedWidthContent: 'spaceBetweenMixedWidthLetters'
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
