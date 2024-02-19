import { ValidationTarget } from '../report.js'
import { checkCharType } from './char.js'
import {
  BRACKET_NOT_CLOSED,
  BRACKET_NOT_OPEN,
  QUOTATION_NOT_CLOSED,
  QUOTATION_NOT_OPEN
} from './messages.js'
import {
  CharType,
  SHORTHAND_CHARS,
  SHORTHAND_PAIR_SET,
  BRACKET_CHAR_SET,
  QUOTATION_CHAR_SET,
  Mark,
  MarkMap,
  MarkSideType,
  MarkType,
  LetterType,
  SingleToken,
  HyperTokenType,
  GroupToken,
  GroupTokenType,
  Token,
  PunctuationType,
  SinglePunctuationType,
  isBracketType,
  isQuotationType
} from './types.js'
import { ParseStatus } from './parse.js'

export const handlePunctuation = (
  i: number,
  char: string,
  type: PunctuationType,
  status: ParseStatus
): void => {
  // end the last unfinished token
  finalizeLastToken(status, i)

  // check the current token type
  // - start of a mark: start an unfinished mark
  // - end of a mark: end the current unfinished mark
  // - neutral quotation: start/end a group by pairing the last unfinished group
  // - left quotation: start a new unfinished group
  // - right quotation: end the current unfinished group
  // - other punctuation: add and end the current token
  if (isBracketType(type)) {
    if (BRACKET_CHAR_SET.left.indexOf(char) >= 0) {
      // push (save) the current unfinished mark if have
      initNewMark(status, i, char)
      // generate a new token and mark it as a mark punctuation by left
      // and finish the token
      addBracketToken(status, i, char, MarkSideType.LEFT)
    } else if (BRACKET_CHAR_SET.right.indexOf(char) >= 0) {
      if (!status.lastMark || !status.lastMark.startValue) {
        addUnmatchedToken(status, i, char)
        addError(status, i, BRACKET_NOT_OPEN)
      } else {
        // generate token as a punctuation
        addBracketToken(status, i, char, MarkSideType.RIGHT)
        // end the last unfinished mark
        // and pop the previous one if exists
        finalizeCurrentMark(status, i, char)
      }
    }
    return
  }
  if (isQuotationType(type)) {
    if (QUOTATION_CHAR_SET.neutral.indexOf(char) >= 0) {
      // - end the last unfinished group
      // - start a new group
      if (status.lastGroup && char === status.lastGroup.startValue) {
        finalizeCurrentGroup(status, i, char)
      } else {
        initNewGroup(status, i, char)
      }
    } else if (QUOTATION_CHAR_SET.left.indexOf(char) >= 0) {
      initNewGroup(status, i, char)
    } else if (QUOTATION_CHAR_SET.right.indexOf(char) >= 0) {
      if (!status.lastGroup || !status.lastGroup.startValue) {
        addUnmatchedToken(status, i, char)
        addError(status, i, QUOTATION_NOT_OPEN)
      } else {
        finalizeCurrentGroup(status, i, char)
      }
    }
    return
  }
  addSinglePunctuationToken(status, i, char, type)
}

export const handleLetter = (
  i: number,
  char: string,
  type: LetterType,
  status: ParseStatus
): void => {
  // check if type changed and last token unfinished
  // - create new token in the current group
  // - append into current unfinished token
  if (status.lastToken) {
    if (status.lastToken.type !== type) {
      finalizeLastToken(status, i)
      initNewContent(status, i, char, type)
    } else {
      appendValue(status, char)
    }
  } else {
    initNewContent(status, i, char, type)
  }
}

// status

export const initNewStatus = (str: string, hyperMarks: Mark[]): ParseStatus => {
  const tokens = [] as unknown as GroupToken
  Object.assign(tokens, {
    type: GroupTokenType.GROUP,
    index: 0,
    spaceAfter: '',
    startIndex: 0,
    endIndex: str.length - 1,
    startValue: '',
    endValue: '',
    innerSpaceBefore: ''
  })
  const status: ParseStatus = {
    lastToken: undefined,
    lastGroup: tokens,
    lastMark: undefined,

    tokens,
    marks: [...hyperMarks],
    groups: [],

    markStack: [],
    groupStack: [],

    errors: []
  }
  return status
}

// finalize token

export const finalizeLastToken = (status: ParseStatus, index: number): void => {
  if (status.lastToken) {
    // the lastToken.index is not the current index anymore
    status.lastToken.length = index - status.lastToken.index
    status.lastGroup && status.lastGroup.push(status.lastToken)
    status.lastToken = undefined
  }
}

export const finalizeCurrentToken = (
  status: ParseStatus,
  token: SingleToken
): void => {
  status.lastGroup && status.lastGroup.push(token)
  status.lastToken = undefined
}

// hyper marks

const markTypeToTokenType = (type: MarkType): HyperTokenType => {
  switch (type) {
    case MarkType.HYPER:
      return HyperTokenType.HYPER_MARK
    case MarkType.BRACKETS:
      return HyperTokenType.BRACKET_MARK
    case MarkType.RAW:
      // technically never since MarkType.RAW should go to addRawContent()
      return HyperTokenType.INDETERMINATED
  }
}

export const addHyperToken = (
  status: ParseStatus,
  index: number,
  mark: Mark,
  value: string,
  markSide: MarkSideType
) => {
  const token: SingleToken = {
    type: markTypeToTokenType(mark.type),
    index,
    length: value.length,
    value: value,
    spaceAfter: '', // to be finalized
    mark: mark,
    markSide
  }
  finalizeCurrentToken(status, token)
}

export const addRawContent = (
  status: ParseStatus,
  index: number,
  value: string
) => {
  const token: SingleToken = {
    type: getHyperContentType(value),
    index,
    length: value.length,
    value: value,
    spaceAfter: '' // to be finalized
  }
  finalizeCurrentToken(status, token)
}

// bracket marks

export const initNewMark = (
  status: ParseStatus,
  index: number,
  char: string,
  type: MarkType = MarkType.BRACKETS
) => {
  if (status.lastMark) {
    status.markStack.push(status.lastMark)
    status.lastMark = undefined
  }
  const mark: Mark = {
    type,
    startIndex: index,
    startValue: char,
    endIndex: -1, // to be finalized
    endValue: '' // to be finalized
  }
  status.marks.push(mark)
  status.lastMark = mark
}

export const addBracketToken = (
  status: ParseStatus,
  index: number,
  char: string,
  markSide: MarkSideType
) => {
  const token: SingleToken = {
    type: HyperTokenType.BRACKET_MARK,
    index,
    length: 1,
    value: char,
    spaceAfter: '', // to be finalized
    mark: status.lastMark,
    markSide
  }
  finalizeCurrentToken(status, token)
}

export const finalizeCurrentMark = (
  status: ParseStatus,
  index: number,
  char: string
) => {
  if (!status.lastMark) {
    return
  }
  status.lastMark.endIndex = index
  status.lastMark.endValue = char
  if (status.markStack.length > 0) {
    status.lastMark = status.markStack.pop()
  } else {
    status.lastMark = undefined
  }
}

// normal punctuation

const addSinglePunctuationToken = (
  status: ParseStatus,
  index: number,
  char: string,
  type: SinglePunctuationType
) => {
  const token: SingleToken = {
    type,
    index,
    length: 1,
    value: char,
    spaceAfter: '' // to be finalized
  }
  finalizeCurrentToken(status, token)
}

const addUnmatchedToken = (
  status: ParseStatus,
  i: number,
  char: string
): void => {
  const token: SingleToken = {
    type: HyperTokenType.UNMATCHED,
    index: i,
    length: 1,
    value: char,
    spaceAfter: ''
  }
  finalizeCurrentToken(status, token)
}

// group

export const initNewGroup = (
  status: ParseStatus,
  index: number,
  char: string
) => {
  status.lastGroup && status.groupStack.push(status.lastGroup)
  const lastGroup = [] as unknown as GroupToken

  Object.assign(lastGroup, {
    type: GroupTokenType.GROUP,
    index,
    spaceAfter: '', // to be finalized
    startIndex: index,
    startValue: char,
    endIndex: -1, // to be finalized
    endValue: '', // to be finalized
    innerSpaceBefore: '' // to be finalized
  })

  // TODO: previous group in stack
  status.groupStack[status.groupStack.length - 1].push(lastGroup)
  status.lastGroup = lastGroup
  status.groups.push(lastGroup)
}

export const finalizeCurrentGroup = (
  status: ParseStatus,
  index: number,
  char: string
) => {
  if (status.lastGroup) {
    // index, length, value
    status.lastGroup.endIndex = index
    status.lastGroup.endValue = char
  }
  if (status.groupStack.length > 0) {
    status.lastGroup = status.groupStack.pop()
  } else {
    status.lastGroup = undefined
  }
}

// general content

export const initNewContent = (
  status: ParseStatus,
  index: number,
  char: string,
  type: LetterType
) => {
  status.lastToken = {
    type,
    index,
    length: 1, // to be finalized
    value: char, // to be finalized
    spaceAfter: '' // to be finalized
  }
}

export const appendValue = (status: ParseStatus, char: string) => {
  if (status.lastToken) {
    status.lastToken.value += char
    status.lastToken.length++
  }
}

// others

/**
 * Get the length of connecting spaces from a certain index
 */
export const getConnectingSpaceLength = (
  str: string,
  start: number
): number => {
  // not even a space
  if (checkCharType(str[start]) !== CharType.SPACE) {
    return 0
  }

  // find the next non-space char
  for (let i = start + 1; i < str.length; i++) {
    const char = str[i]
    const type = checkCharType(char)
    if (type !== CharType.SPACE) {
      return i - start
    }
  }

  // space till the end
  return str.length - start
}

export const getPreviousToken = (status: ParseStatus): Token | undefined => {
  if (status.lastGroup) {
    return status.lastGroup[status.lastGroup.length - 1]
  }
}

export const getHyperMarkMap = (hyperMarks: Mark[]) => {
  const hyperMarkMap: MarkMap = {}
  hyperMarks.forEach((mark) => {
    hyperMarkMap[mark.startIndex] = mark
    if (mark.type !== MarkType.RAW) {
      hyperMarkMap[mark.endIndex] = mark
    }
  })
  return hyperMarkMap
}

export const isShorthand = (
  str: string,
  status: ParseStatus,
  index: number,
  char: string
): boolean => {
  if (SHORTHAND_CHARS.indexOf(char) < 0) {
    return false
  }
  if (!status.lastToken || status.lastToken.type !== CharType.WESTERN_LETTER) {
    return false
  }
  if (str.length <= index + 1) {
    return false
  }
  const nextChar = str[index + 1]
  const nextType = checkCharType(nextChar)
  if (nextType === CharType.WESTERN_LETTER || nextType === CharType.SPACE) {
    if (!status.lastGroup) {
      return true
    }
    if (status.lastGroup.startValue !== SHORTHAND_PAIR_SET[char]) {
      return true
    }
  }
  return false
}

export const getHyperContentType = (content: string): HyperTokenType => {
  if (content.match(/\n/)) {
    // Usually it's hexo custom containers.
    return HyperTokenType.HYPER_CONTENT
  }
  if (content.match(/^<code.*>.*<\/code.*>$/)) {
    // Usually it's <code>...</code>.
    return HyperTokenType.CODE_CONTENT
  }
  if (content.match(/^<.+>$/)) {
    // Usually it's other HTML tags.
    return HyperTokenType.HYPER_CONTENT
  }
  // Usually it's `...`.
  return HyperTokenType.CODE_CONTENT
}

// error handling

const addError = (
  status: ParseStatus,
  index: number,
  message: string
): void => {
  status.errors.push({
    name: '',
    index,
    length: 0,
    message,
    target: ValidationTarget.VALUE
  })
}

export const handleErrors = (status: ParseStatus): void => {
  // record an error if the last mark not fully resolved
  const lastMark = status.lastMark
  if (lastMark && lastMark.type === MarkType.BRACKETS && !lastMark.endValue) {
    addError(status, lastMark.startIndex, BRACKET_NOT_CLOSED)
  }

  // record an error if `markStack` not fully resolved
  if (status.markStack.length > 0) {
    status.markStack.forEach((mark) => {
      if (mark !== lastMark) {
        addError(status, mark.startIndex, BRACKET_NOT_CLOSED)
      }
    })
  }

  // record an error if the last group not fully resolved
  const lastGroup = status.lastGroup
  if (lastGroup && lastGroup.startValue && !lastGroup.endValue) {
    addError(status, lastGroup.startIndex, QUOTATION_NOT_CLOSED)
  }

  // record an error if `groupStack` not fully resolved
  if (status.groupStack.length > 0) {
    status.groupStack.forEach((group) => {
      if (group !== lastGroup && group.startValue && !group.endValue) {
        addError(status, group.startIndex, QUOTATION_NOT_CLOSED)
      }
    })
  }
}
