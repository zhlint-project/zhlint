import { Block, ParsedStatus } from './hypers/types'
import { Validation } from './report'
import { IgnoredMark } from './ignore'
import { NormalizedOptions, Options } from './options'
import { Config } from './rc'

import { normalizeOptions, normalizeConfig } from './options'
import { parse, toMutableResult, travel } from './parser'
import generateHandlers from './rules'
import findIgnoredMarks from './ignore'
import join from './join'
import replaceBlocks from './replace-block'

export { Options } from './options'

export type Result = {
  file?: string
  disabled?: boolean
  origin: string
  result: string
  validations: Validation[]
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
  const parsedStatus = hyperParse.reduce(
    (current, parse) => parse(current),
    status
  )

  // 1. Parse each block without ignoredByParsers
  // 2. Parse all ignoredByRules into marks for each block
  // 3. Run all rule processes for each block
  // 4. Push all ignored marks into allIgnoredMarks for each block
  // 5. Join all tokens with ignoredMarks and all errors for each block
  // 6. Replace each block back to the string
  const ruleHandlers = generateHandlers(rules)
  const modifiedBlocks: Block[] = parsedStatus.blocks.map(
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
      if (globalThis.__DEV__) {
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
