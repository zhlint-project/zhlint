import type { IgnoredCase } from '../ignore.js'
import type { Mark, MutableParseResult } from '../parser/index.js'

export type ParserIgnoredCase = {
  name: string
  meta: string
  index: number
  length: number
  originValue: string
}

export type Block = {
  value: string
  marks: Mark[]
  start: number
  end: number
}

export type ParsedStatus = {
  value: string
  modifiedValue: string
  ignoredByRules: IgnoredCase[]
  ignoredByParsers: ParserIgnoredCase[]
  blocks: Block[]
}

export type ParsedBlock = Block &
  MutableParseResult & {
    originValue: string
  }
