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

// Char

import { Validation } from '../report'

export enum CharType {
  EMPTY = 'empty',
  SPACE = 'space',
  LETTERS_HALF = 'letters-half',
  LETTERS_FULL = 'letters-full',
  PUNCTUATION_HALF = 'punctuation-half',
  PUNCTUATION_FULL = 'punctuation-full',
  UNKNOWN = 'unknown'
}

type CharSet = {
  [setName: string]: string
}

export const BRACKET_CHAR_SET: CharSet = {
  left: '(（',
  right: ')）'
}
export const QUOTE_CHAR_SET: CharSet = {
  left: `“‘《〈『「【{`,
  right: `”’》〉』」】}`,
  neutral: `'"`
}
export const SHORTHAND_CHARS = `'’`
export const SHORTHAND_PAIR_SET: CharSet = {
  [`'`]: `'`,
  [`’`]: `‘`
}

const FULL_WIDTH_PAIRS = `“”‘’（）「」『』《》〈〉【】`

export const isFullWidthPair = (str: string): boolean =>
  FULL_WIDTH_PAIRS.indexOf(str) >= 0

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

export type LettersType = CharType.LETTERS_FULL | CharType.LETTERS_HALF

export type PunctuationType =
  | CharType.PUNCTUATION_FULL
  | CharType.PUNCTUATION_HALF

export type ContentTokenType = LettersType | PunctuationType

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

export const isLettersType = (
  type: TokenType | CharType
): type is LettersType => {
  return type === CharType.LETTERS_FULL || type === CharType.LETTERS_HALF
}

export const isPunctuationType = (
  type: TokenType | CharType
): type is PunctuationType => {
  return (
    type === CharType.PUNCTUATION_FULL || type === CharType.PUNCTUATION_HALF
  )
}

export const isNonCodeVisibleType = (
  type: TokenType | CharType
): type is LettersType => {
  return (
    isLettersType(type) ||
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
