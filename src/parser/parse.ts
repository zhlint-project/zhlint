import { checkCharType } from './char'
import {
  CharType,
  GroupToken,
  GroupTokenType,
  Mark,
  MarkMap,
  MarkSideType,
  MarkType,
  ParseStatus
} from './types'
import {
  appendContent,
  appendHyperContent,
  appendHyperMark,
  finalizeCurrentToken,
  getConnectingSpaceLength,
  handleContent,
  handlePunctuation,
  isShorthand
} from './util'

export type ParseResult = {
  tokens: GroupToken
  groups: GroupToken[]
  marks: Mark[]
}

/**
 * Parse a string into several tokens.
 * - half-width content x {1,n} (letter)
 * - full-width content x {1,n}
 * - half-width punctuation
 * - width-width punctuation
 * - punctuation pair as special marks: brackets
 * - punctuation pair as a group: quotes
 */
export const parse = (str: string, hyperMarks: Mark[] = []): ParseResult => {
  // init top-level tokens
  const tokens = [] as unknown as GroupToken
  tokens.type = GroupTokenType.GROUP

  // pre-process hyper marks
  const hyperMarkMap: MarkMap = {}
  hyperMarks.forEach((mark) => {
    hyperMarkMap[mark.startIndex] = mark
    if (mark.type !== MarkType.RAW) {
      hyperMarkMap[mark.endIndex] = mark
    }
  })

  // states
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
      finalizeCurrentToken(status, i)
      // for hyper mark without startContent
      delete hyperMarkMap[i]
      // check the next token
      // - if the mark type is raw
      //   - append next token
      // - else
      //   - start mark: append token
      //   - end mark: append token, append mark
      if (hyperMark.type === MarkType.RAW) {
        appendHyperContent(
          status,
          i,
          str.substring(hyperMark.startIndex, hyperMark.endIndex)
        )
        i = hyperMark.endIndex - 1
      } else {
        if (i === hyperMark.startIndex) {
          appendHyperMark(
            status,
            i,
            hyperMark,
            hyperMark.startContent,
            MarkSideType.LEFT
          )
          i += hyperMark.startContent.length - 1
        } else if (i === hyperMark.endIndex) {
          appendHyperMark(
            status,
            i,
            hyperMark,
            hyperMark.endContent,
            MarkSideType.RIGHT
          )
          i += hyperMark.endContent.length - 1
        }
      }
    } else if (type === CharType.SPACE) {
      if (!status.lastGroup) {
        throw new Error(`Unmatched token group at ${i}`)
      }
      // end the last unfinished token
      // jump to the next non-space char
      // record the last space
      // - space after a token
      // - inner space before a group
      finalizeCurrentToken(status, i)
      const spaceLength = getConnectingSpaceLength(str, i)
      const space = str.substring(i, i + spaceLength)
      if (status.lastGroup.length) {
        const lastToken = status.lastGroup[status.lastGroup.length - 1]
        lastToken.spaceAfter = lastToken.rawSpaceAfter = space
      } else {
        status.lastGroup.innerSpaceBefore =
          status.lastGroup.rawInnerSpaceBefore = space
      }
      if (spaceLength - 1 > 0) {
        i += spaceLength - 1
      }
    } else if (isShorthand(str, status, i, char)) {
      appendContent(status, char)
    } else if (
      type === CharType.PUNCTUATION_FULL ||
      type === CharType.PUNCTUATION_HALF
    ) {
      handlePunctuation(i, char, type, status)
    } else if (
      type === CharType.CONTENT_FULL ||
      type === CharType.CONTENT_HALF ||
      type === CharType.UNKNOWN
    ) {
      handleContent(i, char, type, status)
    }
  }
  finalizeCurrentToken(status, str.length)

  // throw error if `markStack` or `groupStack` not fully flushed
  if (status.markStack.length > 0) {
    const mark = status.markStack[status.markStack.length - 1]
    throw new Error(
      `Unmatched closed bracket ${mark.startContent} at ${mark.startIndex}`
    )
  }
  if (status.groupStack.length > 0) {
    const group = status.groupStack[status.groupStack.length - 1]
    throw new Error(
      `Unmatched closed quote ${group.startContent} at ${group.startIndex}`
    )
  }

  return {
    tokens: status.tokens,
    groups: status.groups,
    marks: status.marks
  }
}
