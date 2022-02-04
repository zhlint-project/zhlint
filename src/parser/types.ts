// Char

import { Validation } from '../report'

export enum CharType {
  EMPTY = 'empty',
  SPACE = 'space',
  CONTENT_HALF = 'content-half',
  CONTENT_FULL = 'content-full',
  PUNCTUATION_HALF = 'punctuation-half',
  PUNCTUATION_FULL = 'punctuation-full',
  UNKNOWN = 'unknown'
}

type CharSet = {
  [setName: string]: string
}

export const MARK_CHAR_SET: CharSet = {
  left: '(（',
  right: ')）'
}
export const GROUP_CHAR_SET: CharSet = {
  left: `“‘《〈『「【{`,
  right: `”’》〉』」】}`,
  neutral: `'"`
}
export const SHORTHAND_CHARS = `'’`
export const SHORTHAND_PAIR_SET: CharSet = {
  [`'`]: `'`,
  [`’`]: `‘`
}

// Reusable

type Pair = {
  startIndex: number
  startContent: string
  endIndex: number
  endContent: string
}

type MutablePair = {
  modifiedStartContent: string
  modifiedEndContent: string
}

// Mark

export enum MarkType {
  BRACKETS = 'brackets',
  HYPER = 'hyper',
  RAW = 'raw'
}

export enum MarkSideType {
  LEFT = 'left',
  RIGHT = 'right'
}

export type Mark = Pair & {
  type: MarkType
  meta?: string // AST type enum
}

export type RawMark = Mark & {
  code: MarkSideType
  rightPair?: RawMark
}

export type MutableMark = Mark & MutablePair

export type MutableRawMark = RawMark & MutablePair

export type MarkMap = {
  [index: number]: Mark
}

export const isRawMark = (mark: Mark): mark is RawMark => {
  return (mark as RawMark).code !== undefined
}

// Token type

export type ContentType = CharType.CONTENT_FULL | CharType.CONTENT_HALF

export type PunctuationType =
  | CharType.PUNCTUATION_FULL
  | CharType.PUNCTUATION_HALF

export type CharTokenType = ContentType | PunctuationType

export enum SingleTokenType {
  MARK_BRACKETS = 'mark-brackets',
  MARK_HYPER = 'mark-hyper',
  CONTENT_HYPER = 'content-hyper', // TEMP
  HYPER_CONTAINER = 'hyper-container',
  HYPER_INVISIBLE = 'hyper-invisible',
  HYPER_CODE = 'hyper-code'
}

export enum GroupTokenType {
  GROUP = 'group'
}

export type TokenType = CharTokenType | SingleTokenType | GroupTokenType

export type NonHyperVisibleTokenType =
  | ContentType
  | PunctuationType
  | SingleTokenType.MARK_BRACKETS
  | GroupTokenType.GROUP

export type VisibleTokenType =
  | NonHyperVisibleTokenType
  | SingleTokenType.HYPER_CODE

export type invisibleTokenType =
  | SingleTokenType.MARK_HYPER
  | SingleTokenType.HYPER_INVISIBLE

export type hyperTokenType =
  | SingleTokenType.MARK_HYPER
  | SingleTokenType.HYPER_INVISIBLE
  | SingleTokenType.HYPER_CODE

export type hyperContentTokenType =
  | SingleTokenType.HYPER_CONTAINER
  | SingleTokenType.HYPER_INVISIBLE
  | SingleTokenType.HYPER_CODE

export const isContentType = (
  type: TokenType | CharType
): type is ContentType => {
  return type === CharType.CONTENT_FULL || type === CharType.CONTENT_HALF
}

export const isPunctuationType = (
  type: TokenType | CharType
): type is PunctuationType => {
  return (
    type === CharType.PUNCTUATION_FULL || type === CharType.PUNCTUATION_HALF
  )
}

export const isNonHyperVisibleType = (
  type: TokenType | CharType
): type is ContentType => {
  return (
    isContentType(type) ||
    isPunctuationType(type) ||
    type === SingleTokenType.MARK_BRACKETS ||
    type === GroupTokenType.GROUP
  )
}

export const isVisibleType = (
  type: TokenType | CharType
): type is VisibleTokenType => {
  return isNonHyperVisibleType(type) || type === SingleTokenType.HYPER_CODE
}

export const isInvisibleType = (
  type: TokenType | CharType
): type is VisibleTokenType => {
  return (
    type === SingleTokenType.MARK_HYPER ||
    type === SingleTokenType.HYPER_INVISIBLE
  )
}

export const isHyperType = (
  type: TokenType | CharType
): type is VisibleTokenType => {
  return (
    type === SingleTokenType.MARK_HYPER ||
    type === SingleTokenType.HYPER_INVISIBLE ||
    type === SingleTokenType.HYPER_CODE
  )
}

export const isHyperContentType = (
  type: TokenType | CharType
): type is hyperContentTokenType => {
  return (
    type === SingleTokenType.HYPER_CONTAINER ||
    type === SingleTokenType.HYPER_INVISIBLE ||
    type === SingleTokenType.HYPER_CODE
  )
}

// Token

type CommonToken = {
  index: number
  length: number

  content: string
  spaceAfter: string

  mark?: Mark
  markSide?: MarkSideType
}

type MutableCommonToken = {
  modifiedContent: string
  modifiedSpaceAfter: string
  validations: Validation[]
}

export type SingleToken = CommonToken & {
  type: CharTokenType | SingleTokenType
}

export type MutableSingleToken = CommonToken &
  MutableCommonToken & {
    type: CharTokenType | SingleTokenType
    modifiedType: CharTokenType | SingleTokenType
  }

export type GroupToken = Array<Token> &
  CommonToken &
  Pair & {
    type: GroupTokenType
    innerSpaceBefore: string
  }

export type MutableGroupToken = Array<MutableToken> &
  CommonToken &
  MutableCommonToken &
  Pair &
  MutablePair & {
    type: GroupTokenType
    modifiedType: GroupTokenType
    innerSpaceBefore: string
    modifiedInnerSpaceBefore: string
  }

export type Token = SingleToken | GroupToken

export type MutableToken = MutableSingleToken | MutableGroupToken

// Status

export type ParseStatus = {
  lastToken?: Token
  lastGroup?: GroupToken
  lastMark?: Mark

  tokens: GroupToken
  marks: Mark[]
  groups: GroupToken[]

  markStack: Mark[]
  groupStack: GroupToken[]
}

// Travel

export type FilterFunction = (
  token: MutableToken | Token,
  index: number,
  group: MutableGroupToken | GroupToken
) => boolean | RegExpMatchArray | null

export type Filter = FilterFunction | string | RegExp | { type: TokenType }

export type Handler = (
  token: MutableToken | Token,
  index: number,
  group: MutableGroupToken | GroupToken,
  matched: boolean | RegExpMatchArray | null,
  marks: MutableMark[] | Mark[]
) => void
