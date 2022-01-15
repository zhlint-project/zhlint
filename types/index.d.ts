import { Options, Result } from '../src/run'
import { Validation, ValidationTarget } from '../src/logger'
import { IgnoredCase } from '../src/ignore'
import { Data, Block, ParserIgnoredCase } from '../src/hypers/types'
import {
  Handler,
  Token,
  GroupToken,
  GroupTokenType,
  SingleToken,
  SingleTokenType,
  Mark,
  MarkType
} from '../src/parser/index'

export {
  Options,
  Result,
  Handler,
  Validation,
  ValidationTarget,
  IgnoredCase,
  Token,
  GroupToken,
  GroupTokenType,
  SingleToken,
  SingleTokenType,
  Mark,
  MarkType,
  Data,
  ParserIgnoredCase,
  Block
}

export const run: (str: string, options?: Options) => Result
export const report: (resultList: Result[], logger?: Console) => number
