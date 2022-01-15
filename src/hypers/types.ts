import { IgnoredCase } from '../ignore'
import { Mark } from '../parser/types'

export type ParserIgnoredCase = {
  name: string
  index: number
  length: number
  raw: string
  meta: string
}

export type Block = {
  value: string
  marks: Mark[]
  start: number
  end: number
}

export type Data = {
  content: string
  raw: string
  ignoredByRules: IgnoredCase[]
  ignoredByParsers: ParserIgnoredCase[]
  blocks: Block[]
}
