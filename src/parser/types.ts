// Char

export enum CharType {
  EMPTY = 'empty',
  SPACE = 'space',
  CONTENT_HALF = 'content-half',
  CONTENT_FULL = 'content-full',
  CJK = 'cjk', // TODO
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
  left: `“‘《〈『「【`,
  right: `”’》〉』」】`,
  neutral: `'"`
}
export const SHORTHAND_CHARS = `'’`
export const SHORTHAND_PAIR_SET: CharSet = {
  [`'`]: `'`,
  [`’`]: `‘`
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

export type Mark = {
  type: MarkType
  meta?: string
  code?: string
  rightCode?: Mark
  startIndex: number
  startContent: string
  endIndex: number
  endContent: string
  rawStartContent?: string
  rawEndContent?: string
}

export type MarkMap = {
  [index: number]: Mark
}

// Token

export enum SingleTokenType {
  MARK_BRACKETS = 'mark-brackets',
  MARK_HYPER = 'mark-hyper',
  MARK_RAW = 'mark-raw',
  CONTENT_HYPER = 'content-hyper'
}

export enum GroupTokenType {
  GROUP = 'group'
}

export type TokenType = CharType | SingleTokenType | GroupTokenType

type CommonToken = {
  index: number
  length: number

  content: string
  raw?: string

  mark?: Mark
  markSide?: MarkSideType

  spaceAfter?: string
  rawSpaceAfter?: string
}

export type SingleToken = CommonToken & {
  type: CharType | SingleTokenType
}

export type GroupToken = Array<Token> &
  CommonToken & {
    type: GroupTokenType

    startIndex?: number
    startContent?: string
    rawStartContent?: string

    endIndex?: number
    endContent?: string
    rawEndContent?: string

    innerSpaceBefore?: string
    rawInnerSpaceBefore?: string
  }

export type Token = SingleToken | GroupToken

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
  token: Token,
  index: number,
  group: GroupToken
) => boolean | RegExpMatchArray | null

export type Filter = FilterFunction | string | RegExp | { type: TokenType }

export type Handler = (
  token: Token,
  index: number,
  group: GroupToken,
  matched: boolean | RegExpMatchArray | null,
  marks: Mark[]
) => void
