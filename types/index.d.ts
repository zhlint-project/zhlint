import { Options, Result } from '../src/run'
import { Handler } from '../src/travel'
import { Validation, ValidationTarget } from '../src/logger'
import { IgnoredCase } from '../src/find-ignored-marks'
import { Data, Block, ParserIgnoredCase } from '../src/parsers/types'
import { Token, GroupToken, GroupTokenType, SingleToken, SingleTokenType, Mark, MarkType } from '../src/parse'

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
