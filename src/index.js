const markdownParser = require('./parsers/md')

const markHyper = require('./rules/mark-hyper')
const markRaw = require('./rules/mark-raw')
const spacePunctuation = require('./rules/space-punctuation')
const spaceBrackets = require('./rules/space-brackets')
const spaceQuotes = require('./rules/space-quotes')
const spaceFullWidthContent = require('./rules/space-full-width-content')
const unifyPunctuation = require('./rules/unify-punctuation')
const caseTraditional = require('./rules/case-traditional')
const caseDatetime = require('./rules/case-datetime')
const caseDatetimeZh = require('./rules/case-datetime-zh')

/**
 * Check whether the character is full-width or half-width,
 * content or punctuation, or empty, or space, or emoji etc.
 * @param  {string} char
 * @return {string}
 * - 'empty'
 * - 'space'
 * - 'content-half'
 * - 'content-full'
 * - 'punctuation-half'
 * - 'punctuation-width'
 * - 'unknown'
 */
const checkCharType = char => {
  // console.log(char.charCodeAt(0).toString(16), char)
  // console.log(char.charCodeAt(1).toString(16), char)

  if (!char) {
    return 'empty'
  }

  // space
  if (char.match(/\s/)) {
    return 'space'
  }

  // 0-9
  if (char.match(/[0-9]/)) {
    return 'content-half'
  }

  if (',.;:?!~-+*/\\%=&|"\'`()[]{}<>'.indexOf(char) >= 0) {
    return 'punctuation-half'
  }

  if ('，。、；：？！…—～｜·‘’“”《》【】「」（）'.indexOf(char) >= 0) {
    return 'punctuation-full'
  }

  // https://jrgraphix.net/research/unicode.php
  // Basic Latin
  if (char.match(/[\u0020-\u007F]/)) {
    return 'content-half'
  }
  // Latin-1 Supplement
  if (char.match(/[\u00A0-\u00FF]/)) {
    return 'content-half'
  }
  // Latin Extended-A
  if (char.match(/[\u0100-\u017F]/)) {
    return 'content-half'
  }
  // Latin Extended-B
  if (char.match(/[\u0180-\u024F]/)) {
    return 'content-half'
  }
  // Greek and Coptic
  if (char.match(/[\u0370-\u03FF]/)) {
    return 'content-half'
  }

  // https://stackoverflow.com/a/21113538
  // CJK Unified Ideographs
  if (char.match(/[\u4E00-\u9FFF]/)) {
    return 'content-full'
  }
  // CJK Unified Ideographs Extension A
  if (char.match(/[\u3400-\u4DBF]/)) {
    return 'content-full'
  }
  // CJK Unified Ideographs Extension B
  if (char.match(/[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6]/)) {
    return 'content-full'
  }
  // CJK Unified Ideographs Extension C
  if (char.match(/\ud869[\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34]/)) {
    return 'content-full'
  }
  // CJK Unified Ideographs Extension D
  if (char.match(/\ud86d[\udf40-\udfff]|\ud86e[\udc00-\udc1d]/)) {
    return 'content-full'
  }
  // CJK Compatibility Ideographs
  if (char.match(/[\uF900-\uFAFF]/)) {
    return 'content-full'
  }
  // CJK Compatibility Forms
  if (char.match(/[\uFE30-\uFE4F]/)) {
    return 'content-full'
  }
  // CJK Radicals Supplement
  if (char.match(/[\u2E80-\u2EFF]/)) {
    return 'content-full'
  }
  // Private Use Area (part)
  if (char.match(/[\uE815-\uE864]/)) {
    return 'content-full'
  }
  // todo: wrong regexp
  // learn: https://mathiasbynens.be/notes/javascript-unicode
  // if (char.match(/[\u20000-\u2A6DF]/)) {
  //   return 'cjk'
  // }
  // // CJK Compatibility Ideographs Supplement
  // if (char.match(/[\u2F800-\u2FA1F]/)) {
  //   return 'cjk'
  // }

  // CJK Symbols and Punctuation
  if (char.match(/[\u3000-\u303F]/)) {
    return 'punctuation-full'
  }

  // emoji
  // todo: wrong regexp
  // learn: https://mathiasbynens.be/notes/javascript-unicode
  // if (char.match(/[\u1F600-\u1F64F]/)) {
  //   return 'emoji'
  // }

  return 'unknown'
}

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
 * @param  {string} str
 * @param  {Mark[]} hyperMarks Pre-defined marks like HTML tags
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
  let lastUnfinishedGroup = []
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
  hyperMarks.forEach(mark => {
    hyperMarksMap[mark.startIndex] = mark
    if (mark.type !== 'raw') {
      hyperMarksMap[mark.endIndex] = mark
    }
  })

  // helpers
  const getSpaceLength = start => {
    for (let i = start + 1; i < str.length; i++) {
      const char = str[i]
      const type = checkCharType(char)
      if (type !== 'space') {
        return i - start;
      }
    }
    return str.length - start;
  }
  const endLastUnfinishedToken = index => {
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
    lastUnfinishedBracket = { startIndex: index, startContent: char, type }
    marks.push(lastUnfinishedBracket)
  }
  const endLastUnfinishedBracket = (index, char) => {
    lastUnfinishedBracket.endIndex = index
    lastUnfinishedBracket.endContent = char
    if (markStack.length) {
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
    lastUnfinishedGroup.startIndex = index
    groupStack[groupStack.length - 1].push(lastUnfinishedGroup)
    groups.push(lastUnfinishedGroup)
  }
  const endLastUnfinishedGroup = (index, char) => {
    lastUnfinishedGroup.endContent = char
    lastUnfinishedGroup.endIndex = index
    if (groupStack.length) {
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
    if (
      !lastUnfinishedToken ||
      lastUnfinishedToken.type !== 'content-half'
    ) {
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
        appendHyperContent(i,
          str.substring(hyperMark.startIndex, hyperMark.endIndex))
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
  if (markStack.length) {
    const mark = markStack[markStack.length - 1]
    throw new Error(`Unmatched closed bracket ${mark.startContent} at ${mark.startIndex}`)
  }
  if (groupStack.length) {
    const group = groupStack[groupStack.length - 1]
    throw new Error(`Unmatched closed quote ${group.startContent} at ${group.startIndex}`)
  }

  return { tokens, groups, marks }
}

/**
 * Travel through a group nestedly
 * @param  {Group}                                         group
 * @param  {function | string | RegExp | { type: stirng }} filter
 * @param  {function(token, index, group, matched, marks)} handler
 * @param  {Array<Mark>}                                   marks
 */
const travel = (group, filter, handler, marks) => {
  let normalizedFilter = () => false
  if (typeof filter === 'object' && filter.type) {
    normalizedFilter = token => token.type === filter.type
  } else if (filter instanceof RegExp || typeof filter === 'string') {
    normalizedFilter = token => token.content.match(filter)
  } else if (typeof filter === 'function') {
    normalizedFilter = (token, i, group) => filter(token, i, group)
  }
  for (let i = 0; i < group.length; i++) {
    const token = group[i]
    const matched = normalizedFilter(token, i, group)
    if (matched) {
      handler(token, i, group, matched, marks)
    }
    if (Array.isArray(token)) {
      travel(token, filter, handler, marks)
    }
  }
}

/**
 * Join tokens back into string
 * @param  {Array<Token>} tokens
 * @return {string}
 */
const join = tokens => [
  tokens.startContent,
  tokens.innerSpaceBefore,
  ...tokens.map(token =>
    Array.isArray(token)
      ? join(token)
      : [
          token.content,
          token.spaceAfter
        ].filter(Boolean).join('')
  ),
  tokens.endContent,
  tokens.spaceAfter
].filter(Boolean).join('')

/**
 * Process a single lint rule
 * @param  {{ tokens, groups, marks }}      data
 * @param  {function | { filter, handler }} rule
 */
const processRule = (data, rule) => {
  if (!rule) {
    return data
  }
  const handler = typeof rule === 'function' ? rule : rule.handler
  const filter = typeof rule === 'function' ? () => true : rule.filter
  if (!handler) {
    return data
  }
  travel(data.tokens, filter, handler, data.marks)
}

const replaceBlocks = (str, blocks) => {
  const pieces = blocks.reduce((pieces, block, index) => {
    const { start, end } = block
    const lastPiece = pieces[pieces.length - 1]
    nextStart = lastPiece ? lastPiece.end : 0
    if (nextStart < start) {
      const nonBlockPiece = {
        nonBlock: true,
        start: nextStart,
        end: start,
      }
      nonBlockPiece.value = str.substring(nonBlockPiece.start, nonBlockPiece.end)
      pieces.push(nonBlockPiece)
    }
    pieces.push(block)
    if (index === blocks.length - 1 && end !== str.length) {
      const nonBlockPiece = {
        nonBlock: true,
        start: end,
        end: str.length
      }
      nonBlockPiece.value = str.substring(nonBlockPiece.start, nonBlockPiece.end)
      pieces.push(nonBlockPiece)
    }
    return pieces
  }, [])
  return pieces.map(({ value }) => value).join('')
}

const lint = (str, rules = [
  markHyper,
  markRaw,
  spacePunctuation,
  spaceBrackets,
  spaceQuotes,
  spaceFullWidthContent,
  unifyPunctuation,
  caseTraditional,
  caseDatetime,
  caseDatetimeZh
], hyperParse = markdownParser) => {
  const blocks =
    typeof hyperParse === 'function'
      ? hyperParse(str)
      : [{
          value: str,
          marks: [],
          start: 0,
          end: str.length - 1
        }]
  return replaceBlocks(str, blocks.map(({ value, marks, start, end }) => {
    const data = parse(value, marks)
    rules.forEach(rule => processRule(data, rule))
    return {
      start, end,
      value: join(data.tokens)
    }
  }))
}

module.exports = lint

module.exports.checkCharType = checkCharType
module.exports.parse = parse
module.exports.travel = travel
module.exports.join = join
module.exports.processRule = processRule
module.exports.replaceBlocks = replaceBlocks
