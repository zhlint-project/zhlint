import { Options, Result } from '../src/run'
import { Validation, ValidationTarget } from '../src/report'
import { IgnoredCase } from '../src/ignore'
import { ParsedStatus, Block, ParserIgnoredCase } from '../src/hypers/types'
import {
  Handler,
  Token,
  GroupToken,
  GroupTokenType,
  SingleToken,
  SingleTokenType,
  Mark,
  MarkType
} from '../src/parser'

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
  ParsedStatus,
  ParserIgnoredCase,
  Block
}

export const run: (str: string, options?: Options) => Result
export const report: (resultList: Result[], logger?: Console) => number
