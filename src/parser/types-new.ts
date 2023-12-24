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

import { Validation } from '../report'

// Char

export enum CharType {
  EMPTY = 'empty',

  SPACE = 'space',

  WESTERN_LETTER = 'western-letter',

  CJK_CHAR = 'cjk-char',

  // periods, commas, secondary commas, colons, semicolons, exclamation marks, question marks, etc.
  HALFWIDTH_PAUSE_OR_STOP_PUNCTUATION_MARK = 'halfwidth-pause-or-stop-punctuation-mark',
  FULLWIDTH_PAUSE_OR_STOP_PUNCTUATION_MARK = 'fullwidth-pause-or-stop-punctuation-mark',

  // single, double, corner, white corner
  // + book title marks
  // left x right
  HALFWIDTH_QUOTATION_OR_BOOK_TITLE_MARK = 'halfwidth-quotation-mark',
  FULLWIDTH_QUOTATION_OR_BOOK_TITLE_MARK = 'fullwidth-quotation-mark',

  // parentheses
  HALFWIDTH_BRACKET = 'halfwidth-bracket',
  FULLWIDTH_BRACKET = 'fullwidth-bracket',

  // // parenthesis, black lenticular brackets, white lenticular brackets,
  // // square brackets, tortoise shell brackets, curly brackets
  // // left x right
  // PARENTHESIS = 'parenthesis',
  // // double angle brackets, angle brackets
  // // left x right
  // BOOK_TITLE_MARK = 'book-title-mark',

  // dashes, ellipsis, connector marks, interpuncts, proper noun marks, solidi, etc.
  HALFWIDTH_OTHER_PUNCTUATION_MARK = 'halfwidth-other-punctuation-mark',
  FULLWIDTH_OTHER_PUNCTUATION_MARK = 'fullwidth-other-punctuation-mark',

  // // ⁈, ⁇, ‼, ⁉
  // SPECIAL_PUNCTUATION_MARK = 'special-punctuation-mark',

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
  startContent: string
  endIndex: number
  endContent: string
}

type MutablePair = {
  modifiedStartContent: string
  ignoredStartContent?: string
  modifiedEndContent: string
  ignoredEndContent?: string
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

export type PauseOrStopPunctuationType =
  | CharType.HALFWIDTH_PAUSE_OR_STOP_PUNCTUATION_MARK
  | CharType.FULLWIDTH_PAUSE_OR_STOP_PUNCTUATION_MARK

export type QuotationOrBookTitleMarkType =
  | CharType.HALFWIDTH_QUOTATION_OR_BOOK_TITLE_MARK
  | CharType.FULLWIDTH_QUOTATION_OR_BOOK_TITLE_MARK

export type BracketType =
  | CharType.HALFWIDTH_BRACKET
  | CharType.FULLWIDTH_BRACKET

export type OtherPunctuationType =
  | CharType.HALFWIDTH_OTHER_PUNCTUATION_MARK
  | CharType.FULLWIDTH_OTHER_PUNCTUATION_MARK

export type PunctuationType =
  | PauseOrStopPunctuationType
  | QuotationOrBookTitleMarkType
  | BracketType
  | OtherPunctuationType

export type ContentTokenType = LetterType | PunctuationType

/**
 * TODO: paired html tags should be hyper wrapper
 */
export enum HyperTokenType {
  /**
   * Brackets
   */
  HYPER_WRAPPER_BRACKET = 'wrapper-bracket',
  /**
   * Inline Markdown marks
   */
  HYPER_WRAPPER = 'wrapper',
  /**
   * - \`xxx\`
   * - &lt;code&gt;xxx&lt;/code&gt;
   */
  HYPER_CONTENT_CODE = 'hyper-content-code',
  /**
   * - Hexo/VuePress container
   * - Other html code
   */
  HYPER_CONTENT = 'hyper-content',
  /**
   * Unpaired brackets/quotes
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

export type SingleTokenType = ContentTokenType | HyperTokenType

export type TokenType = SingleTokenType | GroupTokenType

export type NonCodeVisibleTokenType =
  | ContentTokenType
  | HyperTokenType.HYPER_WRAPPER_BRACKET
  | GroupTokenType.GROUP

export type VisibleTokenType =
  | NonCodeVisibleTokenType
  | HyperTokenType.HYPER_CONTENT_CODE

export type InvisibleTokenType = HyperTokenType.HYPER_WRAPPER

export const isLetterType = (
  type: TokenType | CharType
): type is LetterType => {
  return type === CharType.WESTERN_LETTER || type === CharType.CJK_CHAR
}

export const isPauseOrStopPunctuationType = (
  type: TokenType | CharType
): type is PunctuationType => {
  return (
    type === CharType.HALFWIDTH_PAUSE_OR_STOP_PUNCTUATION_MARK || type === CharType.FULLWIDTH_PAUSE_OR_STOP_PUNCTUATION_MARK
  )
}

export const isQuotationOrBookTitleMarkType = (
  type: TokenType | CharType
): type is PunctuationType => {
  return (
    type === CharType.HALFWIDTH_QUOTATION_OR_BOOK_TITLE_MARK || type === CharType.FULLWIDTH_QUOTATION_OR_BOOK_TITLE_MARK
  )
}

export const isBracketType = (
  type: TokenType | CharType
): type is PunctuationType => {
  return (
    type === CharType.HALFWIDTH_BRACKET || type === CharType.FULLWIDTH_BRACKET
  )
}

export const isOtherPunctuationType = (
  type: TokenType | CharType
): type is PunctuationType => {
  return (
    type === CharType.HALFWIDTH_OTHER_PUNCTUATION_MARK || type === CharType.FULLWIDTH_OTHER_PUNCTUATION_MARK
  )
}

export const isPunctuationType = (
  type: TokenType | CharType
): type is PunctuationType => {
  return (
    isPauseOrStopPunctuationType(type) ||
    isQuotationOrBookTitleMarkType(type) ||
    isBracketType(type) ||
    isOtherPunctuationType(type)
  )
}

export const isNonCodeVisibleType = (
  type: TokenType | CharType
): type is LetterType => {
  return (
    isLetterType(type) ||
    isPunctuationType(type) ||
    type === HyperTokenType.HYPER_WRAPPER_BRACKET ||
    type === GroupTokenType.GROUP
  )
}

export const isVisibleType = (
  type: TokenType | CharType
): type is VisibleTokenType => {
  return (
    isNonCodeVisibleType(type) || type === HyperTokenType.HYPER_CONTENT_CODE
  )
}

export const isInvisibleType = (
  type: TokenType | CharType
): type is InvisibleTokenType => {
  return type === HyperTokenType.HYPER_WRAPPER
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

type MutableCommonToken = CommonToken & {
  modifiedContent: string
  ignoredContent?: string
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
