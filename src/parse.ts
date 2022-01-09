// TODO: TokenGroup
type TokenGroup = Record<string, any> & Array<any>

import checkCharType from './check-char-type'

/**
 * Parse a string into several tokens.
 * - half-width content x {1,n} (letter)
 * - full-width content x {1,n}
 * - half-width punctuation
 * - width-width punctuation
 * - punctuation pair as special marks: brackets
 * - punctuation pair as a group: quotes
 * Types
 * - Token: { type, content, index, length, mark?, markSide?, spaceAfter? }
 * - Mark: { startIndex, startContent, endIndex, endContent, type: 'brackets'|'hyper'|'raw' }
 * - Group: extends Array<Token> { startContent, startIndex, endContent, endIndex, innerSpaceBefore }
 * @param  {string}        str
 * @param  {Mark[]}        hyperMarks Pre-defined marks like HTML tags
 * @return {
 *   tokens: Token[],
 *   marks: Mark[],
 *   groups: Group[]
 * }
 */
const parse = (str, hyperMarks = []) => {
  // constants
  const markChars = {
    left: '(（',
    right: ')）'
  }
  const groupChars = {
    left: `“‘《〈『「【`,
    right: `”’》〉』」】`,
    neutral: `'"`
  }
  const shorthandChars = `'’`
  const shorthandPair = {
    [`'`]: `'`,
    [`’`]: `‘`
  }

  // states
  let lastUnfinishedToken
  let lastUnfinishedGroup: TokenGroup = [] // TODO: TokenGroup
  let lastUnfinishedBracket

  // temp stacks
  const groupStack = []
  const markStack = []

  // results
  const tokens = lastUnfinishedGroup
  const marks = [...hyperMarks]
  const groups = []

  // pre-process hyper marks
  const hyperMarksMap = {}
  hyperMarks.forEach((mark) => {
    hyperMarksMap[mark.startIndex] = mark
    if (mark.type !== 'raw') {
      hyperMarksMap[mark.endIndex] = mark
    }
  })

  // helpers
  const getSpaceLength = (start) => {
    for (let i = start + 1; i < str.length; i++) {
      const char = str[i]
      const type = checkCharType(char)
      if (type !== 'space') {
        return i - start
      }
    }
    return str.length - start
  }
  const endLastUnfinishedToken = (index) => {
    if (lastUnfinishedToken) {
      lastUnfinishedToken.length = index - lastUnfinishedToken.index
      lastUnfinishedGroup.push(lastUnfinishedToken)
      lastUnfinishedToken = null
    }
  }
  const appendBracket = (index, char, markSide) => {
    lastUnfinishedToken = {
      type: 'mark-brackets',
      content: char,
      raw: char,
      index,
      length: 1,
      mark: lastUnfinishedBracket,
      markSide
    }
    lastUnfinishedGroup.push(lastUnfinishedToken)
    lastUnfinishedToken = null
  }
  const createBracket = (index, char, type = 'brackets') => {
    if (lastUnfinishedBracket) {
      markStack.push(lastUnfinishedBracket)
      lastUnfinishedBracket = null
    }
    lastUnfinishedBracket = {
      type,
      startIndex: index,
      startContent: char,
      rawStartContent: char
    }
    marks.push(lastUnfinishedBracket)
  }
  const endLastUnfinishedBracket = (index, char) => {
    lastUnfinishedBracket.endIndex = index
    lastUnfinishedBracket.endContent = char
    lastUnfinishedBracket.rawEndContent = char
    if (markStack.length > 0) {
      lastUnfinishedBracket = markStack.pop()
    } else {
      lastUnfinishedBracket = null
    }
  }
  const appendHyperMark = (index, mark, content, markSide) => {
    lastUnfinishedToken = {
      type: `mark-${mark.type}`,
      content: content,
      raw: content,
      index,
      length: content.length,
      mark: mark,
      markSide
    }
    lastUnfinishedGroup.push(lastUnfinishedToken)
    lastUnfinishedToken = null
  }
  const appendHyperContent = (index, content) => {
    lastUnfinishedToken = {
      type: 'content-hyper',
      content: content,
      raw: content,
      index,
      length: content.length
    }
    lastUnfinishedGroup.push(lastUnfinishedToken)
    lastUnfinishedToken = null
  }
  const createNewGroup = (index, char) => {
    groupStack.push(lastUnfinishedGroup)
    lastUnfinishedGroup = []
    lastUnfinishedGroup.type = 'group'
    lastUnfinishedGroup.startContent = char
    lastUnfinishedGroup.rawStartContent = char
    lastUnfinishedGroup.startIndex = index
    groupStack[groupStack.length - 1].push(lastUnfinishedGroup)
    groups.push(lastUnfinishedGroup)
  }
  const endLastUnfinishedGroup = (index, char) => {
    lastUnfinishedGroup.endIndex = index
    lastUnfinishedGroup.endContent = char
    lastUnfinishedGroup.rawEndContent = char
    if (groupStack.length > 0) {
      lastUnfinishedGroup = groupStack.pop()
    } else {
      lastUnfinishedGroup = null
    }
  }
  const addNormalPunctuation = (index, char, type) => {
    lastUnfinishedToken = { type, content: char, raw: char, index, length: 1 }
    lastUnfinishedGroup.push(lastUnfinishedToken)
    lastUnfinishedToken = null
  }
  const createContent = (index, char, type) => {
    lastUnfinishedToken = { type, content: char, raw: char, index, length: 1 }
  }
  const appendContent = (char) => {
    lastUnfinishedToken.content += char
    lastUnfinishedToken.raw = lastUnfinishedToken.content
    lastUnfinishedToken.length++
  }
  const isShorthand = (i, char) => {
    if (shorthandChars.indexOf(char) < 0) {
      return false
    }
    if (!lastUnfinishedToken || lastUnfinishedToken.type !== 'content-half') {
      return false
    }
    const nextChar = str[i + 1]
    const nextType = checkCharType(nextChar)
    if (nextType === 'content-half') {
      return true
    }
    if (nextType === 'space') {
      if (!lastUnfinishedGroup) {
        return true
      }
      if (lastUnfinishedGroup.startContent !== shorthandPair[char]) {
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
      if (hyperMark.type === 'raw') {
        appendHyperContent(
          i,
          str.substring(hyperMark.startIndex, hyperMark.endIndex)
        )
        i = hyperMark.endIndex - 1
      } else {
        if (i === hyperMark.startIndex) {
          appendHyperMark(i, hyperMark, hyperMark.startContent, 'left')
          i += hyperMark.startContent.length - 1
        } else if (i === hyperMark.endIndex) {
          appendHyperMark(i, hyperMark, hyperMark.endContent, 'right')
          i += hyperMark.endContent.length - 1
        }
      }
    } else if (type === 'space') {
      // end the last unfinished token
      // jump to the next non-space char
      // record the last space
      // - space after a token
      // - inner space before a group
      endLastUnfinishedToken(i)
      const spaceLength = getSpaceLength(i)
      if (lastUnfinishedGroup.length) {
        const lastToken = lastUnfinishedGroup[lastUnfinishedGroup.length - 1]
        const spaceAfter = str.substr(i, spaceLength)
        lastToken.spaceAfter = spaceAfter
        lastToken.rawSpaceAfter = spaceAfter
      } else {
        const innerSpaceBefore = str.substr(i, spaceLength)
        lastUnfinishedGroup.innerSpaceBefore = innerSpaceBefore
        lastUnfinishedGroup.rawInnerSpaceBefore = innerSpaceBefore
      }
      if (spaceLength - 1 > 0) {
        i += spaceLength - 1
      }
    } else if (isShorthand(i, char)) {
      appendContent(char)
    } else if (type.match(/^punctuation/)) {
      // end the last unfinished token
      endLastUnfinishedToken(i)
      // check the current token type
      // - start of a mark: start an unfinished mark
      // - end of a mark: end the current unfinished mark
      // - neutral quote: start/end a group by pairing the last unfinished group
      // - left quote: start a new unfinished group
      // - right quote: end the current unfinished group
      // - other punctuation: add and end the current token
      if (markChars.left.indexOf(char) >= 0) {
        // push (save) the current unfinished mark if have
        createBracket(i, char)
        // generate a new token and mark it as a mark punctuation by left
        // and finish the token
        appendBracket(i, char, 'left')
      } else if (markChars.right.indexOf(char) >= 0) {
        if (!lastUnfinishedBracket) {
          throw new Error(`Unmatched closed bracket ${char} at ${i}`)
        }
        // generate token as a punctuation
        appendBracket(i, char, 'right')
        // end the last unfinished mark
        // and pop the previous one if exists
        endLastUnfinishedBracket(i, char)
      } else if (groupChars.neutral.indexOf(char) >= 0) {
        // - end the last unfinished group
        // - start a new group
        if (lastUnfinishedGroup && char === lastUnfinishedGroup.startContent) {
          endLastUnfinishedGroup(i, char)
        } else {
          createNewGroup(i, char)
        }
      } else if (groupChars.left.indexOf(char) >= 0) {
        createNewGroup(i, char)
      } else if (groupChars.right.indexOf(char) >= 0) {
        if (!lastUnfinishedGroup) {
          throw new Error(`Unmatched closed quote ${char} at ${i}`)
        }
        endLastUnfinishedGroup(i, char)
      } else {
        addNormalPunctuation(i, char, type)
      }
    } else if (type.match(/^content/) || type === 'unknown') {
      // check if type changed and last token unfinished
      // - create new token in the current group
      // - append into current unfinished token
      if (lastUnfinishedToken) {
        if (type !== 'unknown' && lastUnfinishedToken.type !== type) {
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
