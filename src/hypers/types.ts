import { IgnoredCase } from '../ignore'
import { Mark } from '../parser'

export type ParserIgnoredCase = {
  name: string
  meta: string
  index: number
  length: number
  originContent: string
}

export type Block = {
  value: string
  marks: Mark[]
  start: number
  end: number
}

export type Data = {
  content: string
  modifiedContent: string
  ignoredByRules: IgnoredCase[]
  ignoredByParsers: ParserIgnoredCase[]
  blocks: Block[]
}
