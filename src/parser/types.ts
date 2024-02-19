/**
 * @fileOverview
 *
 * This file contains the types for the parser.
 *
 * - Chars
 * - Pairs
 * - Marks
 * - Tokens
 */

import { Validation } from '../report.js'

// Char

export enum CharType {
  EMPTY = 'empty',

  SPACE = 'space',

  WESTERN_LETTER = 'western-letter',
  CJK_CHAR = 'cjk-char',

  // periods, commas, secondary commas, colons, semicolons, exclamation marks, question marks, etc.
  HALFWIDTH_PAUSE_OR_STOP = 'halfwidth-pause-or-stop',
  FULLWIDTH_PAUSE_OR_STOP = 'fullwidth-pause-or-stop',

  // single, double, corner, white corner
  // + book title marks
  // left x right
  HALFWIDTH_QUOTATION = 'halfwidth-quotation',
  FULLWIDTH_QUOTATION = 'fullwidth-quotation',

  // parentheses
  HALFWIDTH_BRACKET = 'halfwidth-bracket',
  FULLWIDTH_BRACKET = 'fullwidth-bracket',

  // // parenthesis, black lenticular brackets, white lenticular brackets,
  // // square brackets, tortoise shell brackets, curly brackets
  // // left x right
  // PARENTHESIS = 'parenthesis',
  // // double angle brackets, angle brackets
  // // left x right
  // BOOK_TITLE_MARK = 'book-title',

  // dashes, ellipsis, connector marks, interpuncts, proper noun marks, solidi, etc.
  HALFWIDTH_OTHER_PUNCTUATION = 'halfwidth-other-punctuation',
  FULLWIDTH_OTHER_PUNCTUATION = 'fullwidth-other-punctuation',

  // // ⁈, ⁇, ‼, ⁉
  // SPECIAL_PUNCTUATION_MARK = 'special-punctuation',

  UNKNOWN = 'unknown'
}

type CharSet = {
  [setName: string]: string
}

export const BRACKET_CHAR_SET: CharSet = {
  left: '([{（〔［｛',
  right: ')]}）〕］｝'
}
export const QUOTATION_CHAR_SET: CharSet = {
  left: `“‘《〈『「【〖`,
  right: `”’》〉』」】〗`,
  neutral: `'"`
}
export const SHORTHAND_CHARS = `'’`
export const SHORTHAND_PAIR_SET: CharSet = {
  [`'`]: `'`,
  [`’`]: `‘`
}

const FULLWIDTH_PAIRS = `“”‘’（）〔〕［］｛｝《》〈〉「」『』【】〖〗`

export const isFullwidthPair = (str: string): boolean =>
  FULLWIDTH_PAIRS.indexOf(str) >= 0

// Reusable

type Pair = {
  startIndex: number
  startValue: string
  endIndex: number
  endValue: string
}

type MutablePair = {
  modifiedStartValue: string
  ignoredStartValue?: string
  modifiedEndValue: string
  ignoredEndValue?: string
}

// Mark

/**
 * Marks are hyper info, including content and wrappers.
 * They are categorized by parsers, not by usage.
 */
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
  meta?: string // TODO: AST type enum
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

export type LetterType = CharType.WESTERN_LETTER | CharType.CJK_CHAR

export type PauseOrStopType =
  | CharType.HALFWIDTH_PAUSE_OR_STOP
  | CharType.FULLWIDTH_PAUSE_OR_STOP

export type QuotationType =
  | CharType.HALFWIDTH_QUOTATION
  | CharType.FULLWIDTH_QUOTATION

export type BracketType =
  | CharType.HALFWIDTH_BRACKET
  | CharType.FULLWIDTH_BRACKET

export type OtherPunctuationType =
  | CharType.HALFWIDTH_OTHER_PUNCTUATION
  | CharType.FULLWIDTH_OTHER_PUNCTUATION

export type SinglePunctuationType = PauseOrStopType | OtherPunctuationType

export type PunctuationType = SinglePunctuationType | BracketType

export type NormalContentTokenType = LetterType | SinglePunctuationType

export type HalfwidthPuntuationType =
  | CharType.HALFWIDTH_PAUSE_OR_STOP
  | CharType.HALFWIDTH_QUOTATION
  | CharType.HALFWIDTH_BRACKET
  | CharType.HALFWIDTH_OTHER_PUNCTUATION

export type FullwidthPuntuationType =
  | CharType.FULLWIDTH_PAUSE_OR_STOP
  | CharType.FULLWIDTH_QUOTATION
  | CharType.FULLWIDTH_BRACKET
  | CharType.FULLWIDTH_OTHER_PUNCTUATION

export type HalfwidthTokenType =
  | CharType.WESTERN_LETTER
  | FullwidthPuntuationType

export type FullwidthTokenType = CharType.CJK_CHAR | FullwidthPuntuationType

/**
 * TODO: paired html tags should be hyper mark
 */
export enum HyperTokenType {
  /**
   * Brackets
   */
  BRACKET_MARK = 'bracket-mark',
  /**
   * Inline Markdown marks
   */
  HYPER_MARK = 'hyper-mark',

  /**
   * - \`xxx\`
   * - &lt;code&gt;xxx&lt;/code&gt;
   */
  CODE_CONTENT = 'code-content',
  /**
   * - Hexo/VuePress container
   * - Other html code
   */
  HYPER_CONTENT = 'hyper-content',

  /**
   * Unpaired brackets/quotations
   */
  UNMATCHED = 'unmatched',
  /**
   * For indeterminate tokens
   */
  INDETERMINATED = 'indeterminated'
}

export enum GroupTokenType {
  GROUP = 'group'
}

export type SingleTokenType = NormalContentTokenType | HyperTokenType

export type TokenType = SingleTokenType | GroupTokenType

export type NonTokenCharType =
  | BracketType
  | QuotationType
  | CharType.EMPTY
  | CharType.SPACE
  | CharType.UNKNOWN

export type GeneralType = TokenType | NonTokenCharType

export const getHalfwidthTokenType = (type: TokenType): TokenType => {
  switch (type) {
    case CharType.CJK_CHAR:
      return CharType.WESTERN_LETTER
    case CharType.FULLWIDTH_PAUSE_OR_STOP:
      return CharType.HALFWIDTH_PAUSE_OR_STOP
    case CharType.FULLWIDTH_OTHER_PUNCTUATION:
      return CharType.HALFWIDTH_OTHER_PUNCTUATION
  }
  return type
}

export const getFullwidthTokenType = (type: TokenType): TokenType => {
  switch (type) {
    case CharType.WESTERN_LETTER:
      return CharType.CJK_CHAR
    case CharType.HALFWIDTH_PAUSE_OR_STOP:
      return CharType.FULLWIDTH_PAUSE_OR_STOP
    case CharType.HALFWIDTH_OTHER_PUNCTUATION:
      return CharType.FULLWIDTH_OTHER_PUNCTUATION
  }
  return type
}

export type NonCodeVisibleTokenType =
  | NormalContentTokenType
  | HyperTokenType.BRACKET_MARK
  | GroupTokenType.GROUP

export type VisibleTokenType =
  | NonCodeVisibleTokenType
  | HyperTokenType.CODE_CONTENT

export type InvisibleTokenType = HyperTokenType.HYPER_MARK

export type VisibilityUnknownTokenType = HyperTokenType.HYPER_CONTENT

export const isLetterType = (type: GeneralType): type is LetterType => {
  return type === CharType.WESTERN_LETTER || type === CharType.CJK_CHAR
}

export const isPauseOrStopType = (
  type: GeneralType
): type is PauseOrStopType => {
  return (
    type === CharType.HALFWIDTH_PAUSE_OR_STOP ||
    type === CharType.FULLWIDTH_PAUSE_OR_STOP
  )
}

export const isQuotationType = (type: GeneralType): type is QuotationType => {
  return (
    type === CharType.HALFWIDTH_QUOTATION ||
    type === CharType.FULLWIDTH_QUOTATION
  )
}

export const isBracketType = (type: GeneralType): type is BracketType => {
  return (
    type === CharType.HALFWIDTH_BRACKET || type === CharType.FULLWIDTH_BRACKET
  )
}

export const isOtherPunctuationType = (
  type: GeneralType
): type is OtherPunctuationType => {
  return (
    type === CharType.HALFWIDTH_OTHER_PUNCTUATION ||
    type === CharType.FULLWIDTH_OTHER_PUNCTUATION
  )
}

export const isSinglePunctuationType = (
  type: GeneralType
): type is SinglePunctuationType => {
  return isPauseOrStopType(type) || isOtherPunctuationType(type)
}

export const isPunctuationType = (
  type: GeneralType
): type is PunctuationType => {
  return (
    isPauseOrStopType(type) ||
    isQuotationType(type) ||
    isBracketType(type) ||
    isOtherPunctuationType(type)
  )
}

export const isHalfwidthPunctuationType = (
  type: GeneralType
): type is HalfwidthPuntuationType => {
  return (
    type === CharType.HALFWIDTH_PAUSE_OR_STOP ||
    type === CharType.HALFWIDTH_QUOTATION ||
    type === CharType.HALFWIDTH_BRACKET ||
    type === CharType.HALFWIDTH_OTHER_PUNCTUATION
  )
}

export const isHalfwidthType = (
  type: GeneralType
): type is HalfwidthTokenType => {
  return type === CharType.WESTERN_LETTER || isHalfwidthPunctuationType(type)
}

export const isFullwidthPunctuationType = (
  type: GeneralType
): type is FullwidthPuntuationType => {
  return (
    type === CharType.FULLWIDTH_PAUSE_OR_STOP ||
    type === CharType.FULLWIDTH_QUOTATION ||
    type === CharType.FULLWIDTH_BRACKET ||
    type === CharType.FULLWIDTH_OTHER_PUNCTUATION
  )
}

export const isFullwidthType = (
  type: GeneralType
): type is FullwidthTokenType => {
  return type === CharType.CJK_CHAR || isFullwidthPunctuationType(type)
}

export const isNonCodeVisibleType = (type: GeneralType): type is LetterType => {
  return (
    isLetterType(type) ||
    isSinglePunctuationType(type) ||
    type === HyperTokenType.BRACKET_MARK ||
    type === GroupTokenType.GROUP
  )
}

export const isVisibleType = (type: GeneralType): type is VisibleTokenType => {
  return isNonCodeVisibleType(type) || type === HyperTokenType.CODE_CONTENT
}

export const isInvisibleType = (
  type: GeneralType
): type is InvisibleTokenType => {
  // OTHERS?
  return type === HyperTokenType.HYPER_MARK
}

export const isVisibilityUnknownType = (
  type: GeneralType
): type is VisibilityUnknownTokenType => {
  return type === HyperTokenType.HYPER_CONTENT
}

// Token

type CommonToken = {
  index: number
  length: number

  value: string
  spaceAfter: string

  mark?: Mark
  markSide?: MarkSideType
}

type MutableCommonToken = CommonToken & {
  modifiedValue: string
  ignoredValue?: string
  modifiedSpaceAfter: string
  ignoredSpaceAfter?: string
  validations: Validation[]
}

export type SingleToken = CommonToken & {
  type: SingleTokenType
}

export type MutableSingleToken = MutableCommonToken & {
  type: SingleTokenType
  modifiedType: SingleTokenType
  ignoredType?: SingleTokenType
}

export type GroupToken = Array<Token> &
  CommonToken &
  Pair & {
    type: GroupTokenType
    innerSpaceBefore: string
  }

export type MutableGroupToken = Array<MutableToken> &
  MutableCommonToken &
  Pair &
  MutablePair & {
    type: GroupTokenType
    modifiedType: GroupTokenType
    ignoredType?: GroupTokenType
    innerSpaceBefore: string
    modifiedInnerSpaceBefore: string
    ignoredInnerSpaceBefore?: string
  }

export type Token = SingleToken | GroupToken

export type MutableToken = MutableSingleToken | MutableGroupToken
