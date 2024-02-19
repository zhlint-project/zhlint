import { Validation } from '../report.js'
import { checkCharType } from './char.js'
import {
  CharType,
  isLetterType,
  isPunctuationType,
  Mark,
  MutableMark,
  MarkMap,
  MarkSideType,
  MarkType,
  MutableSingleToken,
  MutableGroupToken,
  MutableToken,
  Token,
  GroupToken
} from './types.js'
import {
  handleLetter,
  handlePunctuation,
  appendValue,
  addRawContent,
  addHyperToken,
  finalizeLastToken,
  getConnectingSpaceLength,
  getHyperMarkMap,
  getPreviousToken,
  initNewStatus,
  isShorthand,
  handleErrors
} from './util.js'
import { Options as RuleOptions } from '../rules/util.js'

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

export type MutableParseResult = {
  tokens: MutableGroupToken
  groups: MutableGroupToken[]
  marks: MutableMark[]
  errors: Validation[]
}

/**
 * Parse a string into several tokens.
 * - half-width content x {1,n} (English words)
 * - full-width content x {1,n} (Chinese sentenses without punctuations in between)
 * - half-width punctuation -> halfwidth pause or stop punctuation mark
 * - width-width punctuation -> fullwidth pause or stop punctuation mark
 * - punctuation pair as special marks: brackets -> bracket
 * - punctuation pair as a group: quotations -> quotation or book title mark
 * - -> halfwidth/fullwidth other punctuation mark
 * Besides them there are some special tokens
 * - content-hyper from hyperMarks as input
 * For spaces they would be included as one or multiple successive spaces in
 * - afterSpace after a token or
 * - innerSpaceBefore after the left quotation of a group
 */
export const parse = (str: string, hyperMarks: Mark[] = []): ParseResult => {
  // init status and hyper marks
  const status: ParseStatus = initNewStatus(str, hyperMarks)
  const hyperMarkMap: MarkMap = getHyperMarkMap(hyperMarks)

  // travel every character in the string
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const type = checkCharType(char)
    const hyperMark = hyperMarkMap[i]

    // finally get `status.marks` and `status.lastGroup` as the top-level tokens
    // - hyper marks: finalize current token -> add mark
    // - space: end current -> move forward -> record space beside
    // - punctuation: whether start/end a mark or group, or just add a normal one
    // - content: whether start a new one or append into the current one
    if (hyperMark) {
      // end the last unfinished token
      finalizeLastToken(status, i)
      // for hyper mark without startValue
      delete hyperMarkMap[i]
      // check the next token
      // - if the mark type is raw
      //   - append next token
      // - else (the mark type is hyper)
      //   - start: append token
      //   - end hyper mark: append token, append mark
      if (hyperMark.type === MarkType.RAW) {
        addRawContent(
          status,
          i,
          str.substring(hyperMark.startIndex, hyperMark.endIndex)
        )
        i = hyperMark.endIndex - 1
      } else {
        if (i === hyperMark.startIndex) {
          addHyperToken(
            status,
            i,
            hyperMark,
            hyperMark.startValue,
            MarkSideType.LEFT
          )
          i += hyperMark.startValue.length - 1
        } else if (i === hyperMark.endIndex) {
          addHyperToken(
            status,
            i,
            hyperMark,
            hyperMark.endValue,
            MarkSideType.RIGHT
          )
          i += hyperMark.endValue.length - 1
        }
      }
    } else if (type === CharType.SPACE) {
      // end the last unfinished token
      // jump to the next non-space char
      // record the last space
      // - space after a token
      // - inner space before a group
      finalizeLastToken(status, i)
      if (status.lastGroup) {
        const spaceLength = getConnectingSpaceLength(str, i)
        const spaces = str.substring(i, i + spaceLength)
        if (status.lastGroup.length) {
          const lastToken = getPreviousToken(status)
          if (lastToken) {
            lastToken.spaceAfter = spaces
          }
        } else {
          status.lastGroup.innerSpaceBefore = spaces
        }
        if (spaceLength - 1 > 0) {
          i += spaceLength - 1
        }
      }
    } else if (isShorthand(str, status, i, char)) {
      appendValue(status, char)
    } else if (isPunctuationType(type)) {
      handlePunctuation(i, char, type, status)
    } else if (isLetterType(type)) {
      handleLetter(i, char, type, status)
    } else if (type === CharType.EMPTY) {
      // Nothing
    } else {
      handleLetter(i, char, CharType.WESTERN_LETTER, status)
    }
  }
  finalizeLastToken(status, str.length)

  // handle all the unmatched parsing tokens
  handleErrors(status)

  return {
    tokens: status.tokens,
    groups: status.groups,
    marks: status.marks,
    errors: status.errors
  }
}

const toMutableToken = (token: Token): MutableToken => {
  if (Array.isArray(token)) {
    const mutableToken: MutableGroupToken = token as MutableGroupToken
    mutableToken.modifiedType = token.type
    mutableToken.modifiedValue = token.value
    mutableToken.modifiedSpaceAfter = token.spaceAfter
    mutableToken.modifiedStartValue = token.startValue
    mutableToken.modifiedEndValue = token.endValue
    mutableToken.modifiedInnerSpaceBefore = token.innerSpaceBefore
    mutableToken.validations = []
    token.forEach(toMutableToken)
    return mutableToken
  } else {
    const mutableToken: MutableSingleToken = token as MutableSingleToken
    mutableToken.modifiedType = token.type
    mutableToken.modifiedValue = token.value
    mutableToken.modifiedSpaceAfter = token.spaceAfter
    mutableToken.validations = []
    return mutableToken
  }
}

const toMutableMark = (mark: Mark): MutableMark => {
  const mutableMark: MutableMark = mark as MutableMark
  mutableMark.modifiedStartValue = mark.startValue
  mutableMark.modifiedEndValue = mark.endValue
  return mutableMark
}

export const toMutableResult = (
  result: ParseResult,
  options: RuleOptions = {}
): MutableParseResult => {
  if (!options.noSinglePair) {
    result.errors.length = 0
  }

  toMutableToken(result.tokens)
  result.marks.forEach(toMutableMark)
  return result as MutableParseResult
}
