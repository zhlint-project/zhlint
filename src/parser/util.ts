import { ContentType } from '.'
import { checkCharType } from './char'
import {
  CharType,
  SHORTHAND_CHARS,
  SHORTHAND_PAIR_SET,
  MARK_CHAR_SET,
  GROUP_CHAR_SET,
  Mark,
  MarkMap,
  MarkSideType,
  MarkType,
  SingleToken,
  SingleTokenType,
  GroupToken,
  GroupTokenType,
  Token,
  ParseStatus,
  PunctuationType
} from './types'

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
  // - neutral quote: start/end a group by pairing the last unfinished group
  // - left quote: start a new unfinished group
  // - right quote: end the current unfinished group
  // - other punctuation: add and end the current token
  if (MARK_CHAR_SET.left.indexOf(char) >= 0) {
    // push (save) the current unfinished mark if have
    initNewMark(status, i, char)
    // generate a new token and mark it as a mark punctuation by left
    // and finish the token
    addBracketToken(status, i, char, MarkSideType.LEFT)
  } else if (MARK_CHAR_SET.right.indexOf(char) >= 0) {
    if (!status.lastMark) {
      throw new Error(`Unmatched closed bracket ${char} at ${i}`)
    }
    // generate token as a punctuation
    addBracketToken(status, i, char, MarkSideType.RIGHT)
    // end the last unfinished mark
    // and pop the previous one if exists
    finalizeCurrentMark(status, i, char)
  } else if (GROUP_CHAR_SET.neutral.indexOf(char) >= 0) {
    // - end the last unfinished group
    // - start a new group
    if (status.lastGroup && char === status.lastGroup.startContent) {
      finalizeCurrentGroup(status, i, char)
    } else {
      initNewGroup(status, i, char)
    }
  } else if (GROUP_CHAR_SET.left.indexOf(char) >= 0) {
    initNewGroup(status, i, char)
  } else if (GROUP_CHAR_SET.right.indexOf(char) >= 0) {
    if (!status.lastGroup) {
      throw new Error(`Unmatched closed quote ${char} at ${i}`)
    }
    finalizeCurrentGroup(status, i, char)
  } else {
    addNormalPunctuationToken(status, i, char, type)
  }
}

export const handleContent = (
  i: number,
  char: string,
  type: ContentType,
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
      appendContent(status, char)
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
    startContent: '',
    endContent: '',
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
    groupStack: []
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

export const addHyperToken = (
  status: ParseStatus,
  index: number,
  mark: Mark,
  content: string,
  markSide: MarkSideType
) => {
  const token: SingleToken = {
    type: `mark-${mark.type}` as SingleTokenType, // TODO enum
    index,
    length: content.length,
    content: content,
    spaceAfter: '', // to be finalized
    mark: mark,
    markSide
  }
  finalizeCurrentToken(status, token)
}

export const addHyperContent = (
  status: ParseStatus,
  index: number,
  content: string
) => {
  const token: SingleToken = {
    type: getHyperContentType(content),
    index,
    length: content.length,
    content: content,
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
    startContent: char,
    endIndex: -1, // to be finalized
    endContent: '' // to be finalized
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
    type: SingleTokenType.MARK_BRACKETS,
    index,
    length: 1,
    content: char,
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
  status.lastMark.endContent = char
  if (status.markStack.length > 0) {
    status.lastMark = status.markStack.pop()
  } else {
    status.lastMark = undefined
  }
}

// normal punctuation

const addNormalPunctuationToken = (
  status: ParseStatus,
  index: number,
  char: string,
  type: PunctuationType
) => {
  const token: SingleToken = {
    type,
    index,
    length: 1,
    content: char,
    spaceAfter: '' // to be finalized
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
    startContent: char,
    endIndex: -1, // to be finalized
    endContent: '', // to be finalized
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
    // index, length, content
    status.lastGroup.endIndex = index
    status.lastGroup.endContent = char
  }
  if (status.groupStack.length > 0) {
    status.lastGroup = status.groupStack.pop()
  } else {
    status.lastGroup = undefined
  }
}

// content

export const initNewContent = (
  status: ParseStatus,
  index: number,
  char: string,
  type: ContentType
) => {
  status.lastToken = {
    type,
    index,
    length: 1, // to be finalized
    content: char, // to be finalized
    spaceAfter: '' // to be finalized
  }
}

export const appendContent = (status: ParseStatus, char: string) => {
  if (status.lastToken) {
    status.lastToken.content += char
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
  if (!status.lastToken || status.lastToken.type !== CharType.CONTENT_HALF) {
    return false
  }
  const nextChar = str[index + 1]
  const nextType = checkCharType(nextChar)
  if (nextType === CharType.CONTENT_HALF) {
    return true
  }
  if (nextType === CharType.SPACE) {
    if (!status.lastGroup) {
      return true
    }
    if (status.lastGroup.startContent !== SHORTHAND_PAIR_SET[char]) {
      return true
    }
  }
  return false
}

export const getHyperContentType = (content: string): SingleTokenType => {
  if (content.match(/\n/)) {
    // Usually it's hexo custom containers.
    return SingleTokenType.HYPER_CONTAINER
  }
  if (content.match(/^<code.*>.*<\/code.*>$/)) {
    // Usually it's <code>...</code>.
    return SingleTokenType.HYPER_CODE
  }
  if (content.match(/^<.+>$/)) {
    // Usually it's other HTML tags.
    return SingleTokenType.HYPER_CONTAINER
  }
  // Usually it's `...`.
  return SingleTokenType.HYPER_CODE
}
