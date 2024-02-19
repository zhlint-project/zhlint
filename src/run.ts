import type {
  ParsedBlock,
  ParsedStatus,
  ParserIgnoredCase
} from './hypers/types.js'
import type { Validation } from './report.js'
import type { NormalizedOptions, Options } from './options.js'
import type { Config } from './rc/index.js'
import type { IgnoredCase } from './ignore.js'
import type { Piece } from './replace-block.js'

import { normalizeOptions, normalizeConfig } from './options.js'
import { MutableToken, parse, toMutableResult, travel } from './parser/index.js'
import generateHandlers from './rules/index.js'
import findIgnoredMarks from './ignore.js'
import join from './join.js'
import replaceBlocks from './replace-block.js'

export type { Options } from './options.js'

export type DebugInfo = {
  pieces: Piece[]
  blocks: ParsedBlock[]
  ignoredCases: IgnoredCase[]
  ignoredByParsers: ParserIgnoredCase[]
  ignoredTokens: MutableToken[]
  parserErrors: Validation[]
  ruleErrors: Validation[]
  ignoredRuleErrors: Validation[]
}

export type Result = {
  file?: string
  disabled?: boolean
  origin: string
  result: string
  validations: Validation[]
  __debug__?: DebugInfo
}

export const run = (str: string, options: Options = {}): Result => {
  const normalizedOptions = normalizeOptions(options)
  return lint(str, normalizedOptions)
}

export const runWithConfig = (str: string, config: Config): Result => {
  const normalizedOptions = normalizeConfig(config)
  return lint(str, normalizedOptions)
}

const lint = (str: string, normalizedOptions: NormalizedOptions): Result => {
  // return if the file is totally ignored
  const disabledMatcher = /<!--\s*zhlint\s*disabled\s*-->/g
  if (str.match(disabledMatcher)) {
    return { origin: str, result: str, validations: [], disabled: true }
  }

  const { logger, ignoredCases, rules, hyperParse } = normalizedOptions

  // init status
  // str -> ignoredByRules, ignoredByParsers
  // blocks -> marks, ignoredMarks
  const status: ParsedStatus = {
    value: str,
    modifiedValue: str,
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

  const ignoredTokens: MutableToken[] = []
  const parserErrors: Validation[] = []
  const ruleErrors: Validation[] = []
  const ignoredRuleErrors: Validation[] = []

  // Run all the hyper parsers
  const parsedStatus = hyperParse.reduce(
    (current, parse) => parse(current),
    status
  )

  // 1. Parse each block without ignoredByParsers
  // 2. Parse all ignoredByRules into marks for each block
  // 3. Run all rule processes for each block
  // 4. Join all tokens with ignoredMarks and all errors for each block
  // 5. Replace each block back to the string
  const ruleHandlers = generateHandlers(rules)
  const modifiedBlocks: ParsedBlock[] = parsedStatus.blocks.map(
    ({ value, marks, start, end }) => {
      let lastValue = value

      if (globalThis.__DEV__) {
        logger.log('[Original block value]')
        logger.log(lastValue)
      }

      const result = toMutableResult(parse(value, marks), rules)
      parserErrors.push(...result.errors)

      const ignoredMarks = findIgnoredMarks(
        value,
        status.ignoredByRules,
        logger
      )

      ruleHandlers.forEach((rule) => {
        travel(result.tokens, rule)
        if (globalThis.__DEV__) {
          const currentValue = join(
            result.tokens,
            start,
            ignoredMarks,
            [],
            [],
            []
          )
          if (lastValue !== currentValue) {
            logger.log(`[After process by ${rule.name}]`)
            logger.log(currentValue)
          }
          lastValue = currentValue
        }
      })

      lastValue = join(
        result.tokens,
        start,
        ignoredMarks,
        ignoredTokens,
        ruleErrors,
        ignoredRuleErrors
      )

      if (globalThis.__DEV__) {
        logger.log('[Eventual block value]')
        logger.log(lastValue + '\n')
      }

      return {
        ...result,
        start,
        end,
        value: lastValue,
        originValue: value
      }
    }
  )

  const result = replaceBlocks(str, modifiedBlocks)

  const debugInfo: DebugInfo = {
    pieces: result.pieces,
    blocks: modifiedBlocks,
    ignoredCases: parsedStatus.ignoredByRules,
    ignoredByParsers: parsedStatus.ignoredByParsers,
    ignoredTokens,
    parserErrors,
    ruleErrors,
    ignoredRuleErrors
  }

  return {
    origin: str,
    result: result.value,
    validations: [...parserErrors, ...ruleErrors],
    __debug__: debugInfo
  }
}

export default run
