import checkCharType, { CharType } from './check-char-type'

// Constants

type CharSet = {
  [setName: string]: string
}

const MARK_CHAR_SET: CharSet = {
  left: '(（',
  right: ')）'
}
const GROUP_CHAR_SET: CharSet = {
  left: `“‘《〈『「【`,
  right: `”’》〉』」】`,
  neutral: `'"`
}
const SHORTHAND_CHARS = `'’`
const SHORTHAND_PAIR_SET: CharSet = {
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
  startIndex: number
  startContent: string
  endIndex: number
  endContent: string
  rawStartContent?: string
  rawEndContent?: string
}

type MarkMap = {
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

// Output

export type ParseResult = {
  tokens: Token[]
  marks: Mark[]
  groups: GroupToken[]
}

/**
 * Parse a string into several tokens.
 * - half-width content x {1,n} (letter)
 * - full-width content x {1,n}
 * - half-width punctuation
 * - width-width punctuation
 * - punctuation pair as special marks: brackets
 * - punctuation pair as a group: quotes
 * @param  {string}   str
 * @param  {Mark[]}   hyperMarks Pre-defined marks like HTML tags
 * @return {
 *   tokens: Token[],
 *   marks: Mark[],
 *   groups: Group[]
 * }
 */
const parse = (str: string, hyperMarks: Mark[] = []): ParseResult => {
  // states
  let lastUnfinishedToken: Token | undefined
  let lastUnfinishedGroup: GroupToken | undefined = [] as unknown as GroupToken
  let lastUnfinishedBracket: Mark | undefined

  // temp stacks
  const groupStack: GroupToken[] = []
  const markStack: Mark[] = []

  // results
  const tokens = lastUnfinishedGroup
  const marks = [...hyperMarks]
  const groups: GroupToken[] = []

  // pre-process hyper marks
  const hyperMarksMap: MarkMap = {}
  hyperMarks.forEach((mark) => {
    hyperMarksMap[mark.startIndex] = mark
    if (mark.type !== MarkType.RAW) {
      hyperMarksMap[mark.endIndex] = mark
    }
  })

  // helpers
  const getSpaceLength = (start: number): number => {
    for (let i = start + 1; i < str.length; i++) {
      const char = str[i]
      const type = checkCharType(char)
      if (type !== CharType.SPACE) {
        return i - start
      }
    }
    return str.length - start
  }
  const endLastUnfinishedToken = (index: number): void => {
    if (lastUnfinishedToken) {
      lastUnfinishedToken.length = index - lastUnfinishedToken.index
      lastUnfinishedGroup && lastUnfinishedGroup.push(lastUnfinishedToken)
      lastUnfinishedToken = undefined
    }
  }
  const appendBracket = (
    index: number,
    char: string,
    markSide: MarkSideType
  ) => {
    lastUnfinishedToken = {
      type: SingleTokenType.MARK_BRACKETS,
      content: char,
      raw: char,
      index,
      length: 1,
      mark: lastUnfinishedBracket,
      markSide
    }
    lastUnfinishedGroup && lastUnfinishedGroup.push(lastUnfinishedToken)
    lastUnfinishedToken = undefined
  }
  const createBracket = (
    index: number,
    char: string,
    type: MarkType = MarkType.BRACKETS
  ) => {
    if (lastUnfinishedBracket) {
      markStack.push(lastUnfinishedBracket)
      lastUnfinishedBracket = undefined
    }
    lastUnfinishedBracket = {
      type,
      startIndex: index,
      startContent: char,
      endIndex: -1,
      endContent: '',
      rawStartContent: char
    }
    marks.push(lastUnfinishedBracket)
  }
  const endLastUnfinishedBracket = (index: number, char: string) => {
    if (!lastUnfinishedBracket) {
      return
    }
    lastUnfinishedBracket.endIndex = index
    lastUnfinishedBracket.endContent = char
    lastUnfinishedBracket.rawEndContent = char
    if (markStack.length > 0) {
      lastUnfinishedBracket = markStack.pop()
    } else {
      lastUnfinishedBracket = undefined
    }
  }
  const appendHyperMark = (
    index: number,
    mark: Mark,
    content: string,
    markSide: MarkSideType
  ) => {
    lastUnfinishedToken = {
      type: `mark-${mark.type}` as SingleTokenType, // TODO enum
      content: content,
      raw: content,
      index,
      length: content.length,
      mark: mark,
      markSide
    }
    lastUnfinishedGroup && lastUnfinishedGroup.push(lastUnfinishedToken)
    lastUnfinishedToken = undefined
  }
  const appendHyperContent = (index: number, content: string) => {
    lastUnfinishedToken = {
      type: SingleTokenType.CONTENT_HYPER,
      content: content,
      raw: content,
      index,
      length: content.length
    }
    lastUnfinishedGroup && lastUnfinishedGroup.push(lastUnfinishedToken)
    lastUnfinishedToken = undefined
  }
  const createNewGroup = (index: number, char: string) => {
    lastUnfinishedGroup && groupStack.push(lastUnfinishedGroup)
    lastUnfinishedGroup = [] as unknown as GroupToken
    lastUnfinishedGroup.type = GroupTokenType.GROUP
    lastUnfinishedGroup.startContent = char
    lastUnfinishedGroup.rawStartContent = char
    lastUnfinishedGroup.startIndex = index
    groupStack[groupStack.length - 1].push(lastUnfinishedGroup)
    groups.push(lastUnfinishedGroup)
  }
  const endLastUnfinishedGroup = (index: number, char: string) => {
    if (lastUnfinishedGroup) {
      lastUnfinishedGroup.endIndex = index
      lastUnfinishedGroup.endContent = char
      lastUnfinishedGroup.rawEndContent = char
    }
    if (groupStack.length > 0) {
      lastUnfinishedGroup = groupStack.pop()
    } else {
      lastUnfinishedGroup = undefined
    }
  }
  const addNormalPunctuation = (
    index: number,
    char: string,
    type: CharType
  ) => {
    lastUnfinishedToken = { type, content: char, raw: char, index, length: 1 }
    lastUnfinishedGroup && lastUnfinishedGroup.push(lastUnfinishedToken)
    lastUnfinishedToken = undefined
  }
  const createContent = (index: number, char: string, type: CharType) => {
    lastUnfinishedToken = { type, content: char, raw: char, index, length: 1 }
  }
  const appendContent = (char: string) => {
    if (lastUnfinishedToken) {
      lastUnfinishedToken.content += char
      lastUnfinishedToken.raw = lastUnfinishedToken.content
      lastUnfinishedToken.length++
    }
  }
  const isShorthand = (index: number, char: string): boolean => {
    if (SHORTHAND_CHARS.indexOf(char) < 0) {
      return false
    }
    if (
      !lastUnfinishedToken ||
      lastUnfinishedToken.type !== CharType.CONTENT_HALF
    ) {
      return false
    }
    const nextChar = str[index + 1]
    const nextType = checkCharType(nextChar)
    if (nextType === CharType.CONTENT_HALF) {
      return true
    }
    if (nextType === CharType.SPACE) {
      if (!lastUnfinishedGroup) {
        return true
      }
      if (lastUnfinishedGroup.startContent !== SHORTHAND_PAIR_SET[char]) {
        return true
      }
    }
    return false
  }

  // travel every character in the string
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const type = checkCharType(char)
    const hyperMark = hyperMarksMap[i]

    // finally get `marks` and `lastUnfinishedGroup` as the top-level tokens
    // - hyper marks: end last unfinished token -> add mark
    // - space: end current -> move forward -> record space beside
    // - punctuation: whether start/end a mark or group, or just add a normal one
    // - content: whether start a new one or append into the current one
    if (hyperMark) {
      // end the last unfinished token
      endLastUnfinishedToken(i)
      // for hyper mark without startContent
      delete hyperMarksMap[i]
      // check the next token
      // - if the mark type is raw
      //   - append next token
      // - else
      //   - start mark: append token
      //   - end mark: append token, append mark
      if (hyperMark.type === MarkType.RAW) {
        appendHyperContent(
          i,
          str.substring(hyperMark.startIndex, hyperMark.endIndex)
        )
        i = hyperMark.endIndex - 1
      } else {
        if (i === hyperMark.startIndex) {
          appendHyperMark(
            i,
            hyperMark,
            hyperMark.startContent,
            MarkSideType.LEFT
          )
          i += hyperMark.startContent.length - 1
        } else if (i === hyperMark.endIndex) {
          appendHyperMark(
            i,
            hyperMark,
            hyperMark.endContent,
            MarkSideType.RIGHT
          )
          i += hyperMark.endContent.length - 1
        }
      }
    } else if (type === CharType.SPACE) {
      // end the last unfinished token
      // jump to the next non-space char
      // record the last space
      // - space after a token
      // - inner space before a group
      endLastUnfinishedToken(i)
      const spaceLength = getSpaceLength(i)
      if (lastUnfinishedGroup.length) {
        const lastToken = lastUnfinishedGroup[lastUnfinishedGroup.length - 1]
        // TODO: str.substr()
        const spaceAfter = str.substr(i, spaceLength)
        lastToken.spaceAfter = spaceAfter
        lastToken.rawSpaceAfter = spaceAfter
      } else {
        // TODO: str.substr()
        const innerSpaceBefore = str.substr(i, spaceLength)
        lastUnfinishedGroup.innerSpaceBefore = innerSpaceBefore
        lastUnfinishedGroup.rawInnerSpaceBefore = innerSpaceBefore
      }
      if (spaceLength - 1 > 0) {
        i += spaceLength - 1
      }
    } else if (isShorthand(i, char)) {
      appendContent(char)
    } else if (
      type === CharType.PUNCTUATION_FULL ||
      type === CharType.PUNCTUATION_HALF
    ) {
      // end the last unfinished token
      endLastUnfinishedToken(i)
      // check the current token type
      // - start of a mark: start an unfinished mark
      // - end of a mark: end the current unfinished mark
      // - neutral quote: start/end a group by pairing the last unfinished group
      // - left quote: start a new unfinished group
      // - right quote: end the current unfinished group
      // - other punctuation: add and end the current token
      if (MARK_CHAR_SET.left.indexOf(char) >= 0) {
        // push (save) the current unfinished mark if have
        createBracket(i, char)
        // generate a new token and mark it as a mark punctuation by left
        // and finish the token
        appendBracket(i, char, MarkSideType.LEFT)
      } else if (MARK_CHAR_SET.right.indexOf(char) >= 0) {
        if (!lastUnfinishedBracket) {
          throw new Error(`Unmatched closed bracket ${char} at ${i}`)
        }
        // generate token as a punctuation
        appendBracket(i, char, MarkSideType.RIGHT)
        // end the last unfinished mark
        // and pop the previous one if exists
        endLastUnfinishedBracket(i, char)
      } else if (GROUP_CHAR_SET.neutral.indexOf(char) >= 0) {
        // - end the last unfinished group
        // - start a new group
        if (lastUnfinishedGroup && char === lastUnfinishedGroup.startContent) {
          endLastUnfinishedGroup(i, char)
        } else {
          createNewGroup(i, char)
        }
      } else if (GROUP_CHAR_SET.left.indexOf(char) >= 0) {
        createNewGroup(i, char)
      } else if (GROUP_CHAR_SET.right.indexOf(char) >= 0) {
        if (!lastUnfinishedGroup) {
          throw new Error(`Unmatched closed quote ${char} at ${i}`)
        }
        endLastUnfinishedGroup(i, char)
      } else {
        addNormalPunctuation(i, char, type)
      }
    } else if (
      type === CharType.CONTENT_FULL ||
      type === CharType.CONTENT_HALF ||
      type === CharType.UNKNOWN
    ) {
      // check if type changed and last token unfinished
      // - create new token in the current group
      // - append into current unfinished token
      if (lastUnfinishedToken) {
        if (type !== CharType.UNKNOWN && lastUnfinishedToken.type !== type) {
          endLastUnfinishedToken(i)
          createContent(i, char, type)
        } else {
          appendContent(char)
        }
      } else {
        createContent(i, char, type)
      }
    }
  }
  endLastUnfinishedToken(str.length)

  // throw error if `markStack` or `groupStack` not fully flushed
  if (markStack.length > 0) {
    const mark = markStack[markStack.length - 1]
    throw new Error(
      `Unmatched closed bracket ${mark.startContent} at ${mark.startIndex}`
    )
  }
  if (groupStack.length > 0) {
    const group = groupStack[groupStack.length - 1]
    throw new Error(
      `Unmatched closed quote ${group.startContent} at ${group.startIndex}`
    )
  }

  return { tokens, groups, marks }
}

export default parse
