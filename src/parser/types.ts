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

const fullWidthPairs = `“”‘’（）「」『』《》〈〉【】`

export const isFullWidthPair = (str: string): boolean =>
  fullWidthPairs.indexOf(str) >= 0

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
  /**
   * Brackets
   */
  BRACKETS = 'brackets',
  /**
   * Inline Markdown marks
   */
  HYPER = 'hyper',
  /**
   * - \`xxx\`
   * - &lt;code&gt;xxx&lt;/code&gt;
   * - Hexo/VuePress container
   * - Other html code
   */
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
  /**
   * Brackets
   */
  MARK_BRACKETS = 'mark-brackets',
  /**
   * Inline Markdown marks
   */
  MARK_HYPER = 'mark-hyper',
  /**
   * - \`xxx\`
   * - &lt;code&gt;xxx&lt;/code&gt;
   */
  HYPER_CODE = 'hyper-code',
  /**
   * - Hexo/VuePress container
   * - Other html code
   */
  HYPER_UNEXPECTED = 'hyper-container',
  /**
   * Unpaired brackets/quotes
   */
  UNMATCHED = 'unmatched'
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

export type InvisibleTokenType = SingleTokenType.MARK_HYPER

export type HyperTokenType =
  | SingleTokenType.MARK_HYPER
  | SingleTokenType.HYPER_CODE

export type LegacyHyperContentTokenType =
  | SingleTokenType.HYPER_UNEXPECTED
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
): type is InvisibleTokenType => {
  return type === SingleTokenType.MARK_HYPER
}

export const isHyperType = (
  type: TokenType | CharType
): type is HyperTokenType => {
  return (
    type === SingleTokenType.MARK_HYPER || type === SingleTokenType.HYPER_CODE
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

  errors: Validation[]
}

export type ParseResult = {
  tokens: GroupToken
  groups: GroupToken[]
  marks: Mark[]
  errors: Validation[]
}

// Travel

export type Handler = (
  token: MutableToken | Token,
  index: number,
  group: MutableGroupToken | GroupToken
) => void
