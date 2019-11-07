const escapeStringRegexp = require('escape-string-regexp')

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
    return 'digit'
  }

  if (',.;:?!~-+*/\\%=&|"\'`()[]{}<>'.indexOf(char) >= 0) {
    return 'latin-punctuation'
  }

  if ('，。、；：？！…—～｜·‘’“”《》【】「」（）'.indexOf(char) >= 0) {
    return 'cjk-punctuation'
  }

  // https://jrgraphix.net/research/unicode.php
  // Basic Latin
  if (char.match(/[\u0020-\u007F]/)) {
    return 'latin'
  }
  // Latin-1 Supplement
  if (char.match(/[\u00A0-\u00FF]/)) {
    return 'latin'
  }
  // Latin Extended-A
  if (char.match(/[\u0100-\u017F]/)) {
    return 'latin'
  }
  // Latin Extended-B
  if (char.match(/[\u0180-\u024F]/)) {
    return 'latin'
  }
  // Greek and Coptic
  if (char.match(/[\u0370-\u03FF]/)) {
    return 'greek'
  }

  // https://stackoverflow.com/a/21113538
  // CJK Unified Ideographs
  if (char.match(/[\u4E00-\u9FFF]/)) {
    return 'cjk'
  }
  // CJK Unified Ideographs Extension A
  if (char.match(/[\u3400-\u4DBF]/)) {
    return 'cjk'
  }
  // CJK Unified Ideographs Extension B
  if (char.match(/[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6]/)) {
    return 'cjk'
  }
  // CJK Unified Ideographs Extension C
  if (char.match(/\ud869[\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34]/)) {
    return 'cjk'
  }
  // CJK Unified Ideographs Extension D
  if (char.match(/\ud86d[\udf40-\udfff]|\ud86e[\udc00-\udc1d]/)) {
    return 'cjk'
  }
  // CJK Compatibility Ideographs
  if (char.match(/[\uF900-\uFAFF]/)) {
    return 'cjk'
  }
  // CJK Compatibility Forms
  if (char.match(/[\uFE30-\uFE4F]/)) {
    return 'cjk'
  }
  // CJK Radicals Supplement
  if (char.match(/[\u2E80-\u2EFF]/)) {
    return 'cjk'
  }
  // Private Use Area (part)
  if (char.match(/[\uE815-\uE864]/)) {
    return 'cjk'
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
    return 'cjk-punctuation'
  }

  // emoji
  // todo: wrong regexp
  // learn: https://mathiasbynens.be/notes/javascript-unicode
  // if (char.match(/[\u1F600-\u1F64F]/)) {
  //   return 'emoji'
  // }

  return 'unknown'
}

// todo:
// - each token should have a parent and index
// - should record each meaningless space token
const parse = str => {
  // console.log(str)
  // - ''
  // - 'latin'
  // - 'cjk'
  // - 'space'
  // - 'split'
  // - 'group'
  // - 'mark'
  let tokens = []
  tokens.current = {}
  tokens.last = {}
  tokens.left = ''
  tokens.right = ''
  const tokensStack = []
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const oriType = checkCharType(char)
    const type = oriType === 'digit' ? 'latin' : oriType
    // console.log(i, char, type, tokens)
    if (type === 'space') {
      let spaceContent = char
      let nextIndex = i + 1
      let nextChar = str[nextIndex]
      let nextType = checkCharType(nextChar)
      while (nextType === 'space') {
        spaceContent = spaceContent + nextChar
        nextIndex++
        nextChar = str[nextIndex]
        nextType = checkCharType(nextChar)
      }
      if (nextType === tokens.current.type) {
        tokens.current.content = tokens.current.content + spaceContent
      } else {
        if (tokens.current.content) {
          tokens.current.end = i - 1
          tokens.push(tokens.current)
          tokens.last = tokens.current
          tokens.current = {}
        }
      }
      i = nextIndex - 1
    } else if (
      // is sub or mark
      (type === 'cjk-punctuation' || type === 'latin-punctuation') &&
      `“”‘’"'()《》〈〉『』「」【】（）`.indexOf(char) >= 0
    ) {
      // if left or right
      let isLeft =
        `“‘(《〈『「【（`.indexOf(char) >= 0 ||
        `"'`.indexOf(char) >= 0 && tokens.left !== char
      if (
        `”’)》〉』」】）`.indexOf(char) >= 0 &&
        (!tokens.left || char.charCodeAt(0) - tokens.left.charCodeAt(0) !== 1)
      ) {
        throw new Error(`Error closed punctuation ${char} in column ${i}!`)
      }
      // console.log(`${char} isLeft: ${isLeft}`)
      if (isLeft) {
        // end last token
        if (tokens.current.content) {
          tokens.current.end = i - 1
          tokens.push(tokens.current)
          tokens.last = tokens.current
          tokens.current = {}
        }
        // new last left
        const newTokens = []
        newTokens.type = 'group'
        newTokens.current = {}
        newTokens.last = {}
        newTokens.left = char
        newTokens.start = i
        newTokens.right = ''
        tokens.push(newTokens)
        tokensStack.push(tokens)
        tokens = newTokens
      } else {
        // end last token
        if (tokens.current.content) {
          tokens.current.end = i - 1
          tokens.push(tokens.current)
        }
        // tokens.last = tokens.current
        // tokens.current = {}
        delete tokens.last
        delete tokens.current
        // end last left
        tokens.right = char
        tokens.end = i
        tokens = tokensStack.pop()
      }
    } else if (type === tokens.current.type) {
      tokens.current.content = tokens.current.content + char
    } else {
      if (tokens.current.content) {
        tokens.current.end = i - 1
        tokens.push(tokens.current)
        tokens.last = tokens.current
      }
      tokens.current = {
        type,
        content: char,
        start: i
      }
    }
  }
  if (tokens.current.content) {
    tokens.current.end = str.length - 1
    tokens.push(tokens.current)
  }
  // tokens.last = tokens.current
  // tokens.current = {}
  delete tokens.last
  delete tokens.current
  // if still last left not flushed, throw error
  // console.log(tokens)
  return tokens
}

const travel = (tokens, filter, handler) => {
  let normalizedFilter = () => false
  if (typeof filter === 'object' && filter.type) {
    normalizedFilter = token => token.type === filter.type
  } else if (filter instanceof RegExp || typeof filter === 'string') {
    normalizedFilter = token => token.content.match(filter)
  } else if (typeof filter === 'function') {
    normalizedFilter = (token, i, tokens) => filter(token, i, tokens)
  }
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const result = normalizedFilter(token, i, tokens)
    if (result) {
      handler(token, i, tokens, result)
    }
    if (token.type === 'group') {
      travel(token, filter, handler)
    }
  }
}

/**
  options
  - spaceBetweenLatinAndCjk: false|true|'keep'
  - spaceBesideBrackets: false|'inside'|'outside'|'both'|'keep'
  - spaceBesidePunctuation: false|'right'|'right-for-latin'|'keep'
  - punctuationWidth: 'full'|'half'|'keep'
  - bracketsWidth: 'full'|'half'|'keep'
  - quotesWidth: 'full'|'half'|'keep'
  - replaceCharMap: { [charBefore]: char }
  - replace:
    | [{ input, output }]
    | {
        pre: [{ input, output }],
        post: [{ input, output }]
      }
 */
const prepareOptions = options => {
  const spaceBetweenLatinAndCjk =
    options.hasOwnProperty('spaceBetweenLatinAndCjk')
      ? options.spaceBetweenLatinAndCjk
      : 'keep'
  const spaceBesideBrackets =
    options.hasOwnProperty('spaceBesideBrackets')
      ? options.spaceBesideBrackets
      : 'keep'
  const spaceBesidePunctuation =
    options.hasOwnProperty('spaceBesidePunctuation')
      ? options.spaceBesidePunctuation
      : 'keep'
  const punctuationWidth =
    options.hasOwnProperty('punctuationWidth')
      ? options.punctuationWidth
      : 'keep'
  const half2FullMap = {
    ',': '，',
    '.': '。',
    ';': '；',
    ':': '：',
    '?': '？',
    '!': '！',
    '...': '……',
    '--': '——'
  }
  const full2HalfMap = {
    '，': ',',
    '。': '.',
    '；': ';',
    '：': ':',
    '？': '?',
    '！': '!',
    '……': '...',
    '——': '--'
  }
  const bracketsWidth =
    options.hasOwnProperty('bracketsWidth')
      ? options.bracketsWidth
      : 'keep'
  const half2FullBracketMap = {
    '(': '（',
    ')': '）'
  }
  const full2HalfBracketMap = {
    '（': '(',
    '）': ')'
  }
  const quotesWidth =
    options.hasOwnProperty('quotesWidth')
      ? options.quotesWidth
      : 'keep'
  const half2FullLeftQuoteMap = {
    '"': '“',
    '\'': '‘'
  }
  const half2FullRightQuoteMap = {
    '"': '”',
    '\'': '’'
  }
  const full2HalfQuoteMap = {
    '“': '"',
    '”': '"',
    '‘': '\'',
    '’': '\''
  }
  const preReplaceOptions = []
  const postReplaceOptions = []
  const parseReplaceOptions = (src, dest) => {
    if (!Array.isArray(src)) {
      return
    }
    src.forEach(({ input, output }) => {
      if (typeof input === 'string') {
        input = escapeStringRegexp(input)
      }
      dest.push({ input, output })
    })
  }
  const replaceCharMap = options.replaceCharMap || {}
  for (const input in replaceCharMap) {
    preReplaceOptions.push({ input, output: replaceCharMap[input] })
  }
  if (Array.isArray(options.replace)) {
    parseReplaceOptions(options.replace, postReplaceOptions)
  } else {
    const { pre, post } = options.replace || {}
    parseReplaceOptions(pre, preReplaceOptions)
    parseReplaceOptions(post, postReplaceOptions)
  }

  return {
    spaceBetweenLatinAndCjk,

    spaceBesideBrackets,

    spaceBesidePunctuation,

    punctuationWidth,
    half2FullMap,
    full2HalfMap,

    bracketsWidth,
    full2HalfBracketMap,
    half2FullBracketMap,

    quotesWidth,
    full2HalfQuoteMap,
    half2FullLeftQuoteMap,
    half2FullRightQuoteMap,

    preReplaceOptions,
    postReplaceOptions,
  }
}

module.exports = (str, options = {}) => {
  const {
    spaceBetweenLatinAndCjk,
    spaceBesideBrackets,
    spaceBesidePunctuation,
    punctuationWidth,
    half2FullMap,
    full2HalfMap,
    bracketsWidth,
    full2HalfBracketMap,
    half2FullBracketMap,
    quotesWidth,
    full2HalfQuoteMap,
    half2FullLeftQuoteMap,
    half2FullRightQuoteMap,
    preReplaceOptions,
    postReplaceOptions,
  } = prepareOptions(options)

  // apply pre replace options
  const strBefore = preReplaceOptions.reduce((result, { input, output }) => result.replace(input, output), str)

  // parse: string -> tokens
  const topLevelTokens = parse(strBefore)

  // travel
  let lastToken
  let lastTokens
  const outputTokens = []
  travel(topLevelTokens, () => true, (token, index, tokens) => {

    // if in a same group with the last token
    if (lastToken && lastTokens === tokens && token.type !== 'group') {
      // process the spaces in a same group
      // - between a half width letter and a full width letter
      // - after a punctuation, before a letter
      // - after a letter, before a punctuations
      // - other situations
      if (
        lastToken.type === 'latin' && token.type === 'cjk' ||
        lastToken.type === 'cjk' && token.type === 'latin'
        ) {
        // spacing between a latin char and a cjk char
        // - one space
        // - keep
        // - no space
        if (spaceBetweenLatinAndCjk === true) {
          outputTokens.push(' ')
        } else if (spaceBetweenLatinAndCjk === 'keep') {
          const start = lastToken.end + 1
          const end = token.start
          outputTokens.push(str.substring(start, end))
        }
      } else if (
        (lastToken.type === 'cjk-punctuation' || lastToken.type === 'latin-punctuation') &&
        (token.type === 'cjk' || token.type === 'latin')
      ) {
        // spacing after a punctuation (before a cjk/latin char):
        // - a space
        // - a space only if the char after is latin (and the punctuation _should_ be half width)
        // - keep
        // - no space
        if (spaceBesidePunctuation === 'right') {
          outputTokens.push(' ')
        } else if (
          lastToken.type === 'latin-punctuation' &&
          spaceBesidePunctuation === 'right-for-latin' &&
          punctuationWidth !== 'full'
        ) {
          outputTokens.push(' ')
        } else if (spaceBesidePunctuation === 'keep') {
          const start = lastToken.end + 1
          const end = token.start
          outputTokens.push(str.substring(start, end))
        }
      } else if (
        (token.type === 'cjk-punctuation' || token.type === 'latin-punctuation') &&
        (lastToken.type === 'cjk' || lastToken.type === 'latin')
      ) {
        // spacing before a punctuation (after a cjk/latin char):
        // - keep
        // - no space
        if (spaceBesidePunctuation === 'keep') {
          const start = lastToken.end + 1
          const end = token.start
          outputTokens.push(str.substring(start, end))
        }
      } else {
        // space in other situations
        // - keep
        const start = lastToken.end + 1
        const end = token.start
        outputTokens.push(str.substring(start, end))
      }
    }

    // start of a group
    // split characters into 3 parts
    // - first round: before the left bracket/quote, and the left bracket/quote
    // - second round: after the left bracket/quote
    // @notice:
    // they couldn't be done in a same token travel because
    // we haven't already gotten the next token when it comes to the start identity
    if (token.type === 'group') {
      // make sure there is another token in the same group before
      if (lastToken) {
        // space outside a left bracket/quote
        // - one space
        // - keep
        // - no space
        if (spaceBesideBrackets === 'outside' || spaceBesideBrackets === 'both') {
          outputTokens.push(' ')
        } else if (spaceBesideBrackets === 'keep') {
          const start = lastToken.end + 1
          const end = token.start
          outputTokens.push(str.substring(start, end))
        }
      }
      // the left bracket/quote
      // - full width left bracket
      // - half width left bracket
      // - full width left quote
      // - half width quote
      // - keep
      if (bracketsWidth === 'full' && half2FullBracketMap[token.left]) {
        outputTokens.push(half2FullBracketMap[token.left])
      } else if (bracketsWidth === 'half' && full2HalfBracketMap[token.left]) {
        outputTokens.push(full2HalfBracketMap[token.left])
      } else if (quotesWidth === 'full' && half2FullLeftQuoteMap[token.left]) {
        outputTokens.push(half2FullLeftQuoteMap[token.left])
      } else if (quotesWidth === 'half' && full2HalfQuoteMap[token.left]) {
        outputTokens.push(full2HalfQuoteMap[token.left])
      } else {
        outputTokens.push(token.left)
      }
    }
    if (lastToken && lastToken.type === 'group') {
      // prepend space inside group
      // - one space
      // - keep
      // - no space
      if (spaceBesideBrackets === 'inside' || spaceBesideBrackets === 'both') {
        outputTokens.push(' ')
      } else if (spaceBesideBrackets === 'keep') {
        const start = lastToken.start + 1
        const end = token.start
        outputTokens.push(str.substring(start, end))
      }
    }

    // end of a group
    // split characters into 3 parts
    // - before the right bracket/quote
    // - the right bracket/quote
    // - after the right bracket/quote
    // @notice:
    // they could be done in a same token travel
    // @notice:
    // for the last token of a string, the space
    // before the right bracket/quote will not be processed here
    // so there will be another process at the end of the whole travel
    if (lastTokens && tokens.indexOf(lastTokens) >= 0) {
      // space inside group
      // - one space
      // - keep
      // - no space
      if (spaceBesideBrackets === 'inside' || spaceBesideBrackets === 'both') {
        outputTokens.push(' ')
      } else if (spaceBesideBrackets === 'keep') {
        const start = lastToken.end + 1
        const end = lastTokens.end
        outputTokens.push(str.substring(start, end))
      }
      // group right identifier
      // - full width right bracket
      // - half width right bracket
      // - full width right quote
      // - half width quote
      // - keep
      if (bracketsWidth === 'full' && half2FullBracketMap[lastTokens.right]) {
        outputTokens.push(half2FullBracketMap[lastTokens.right])
      } else if (bracketsWidth === 'half' && full2HalfBracketMap[lastTokens.right]) {
        outputTokens.push(full2HalfBracketMap[lastTokens.right])
      } else if (quotesWidth === 'full' && half2FullRightQuoteMap[lastTokens.right]) {
        outputTokens.push(half2FullRightQuoteMap[lastTokens.right])
      } else if (quotesWidth === 'half' && full2HalfQuoteMap[lastTokens.right]) {
        outputTokens.push(full2HalfQuoteMap[lastTokens.right])
      } else {
        outputTokens.push(lastTokens.right)
      }
      // space outside group
      // - one space
      // - keep
      // - no space
      if (spaceBesideBrackets === 'outside' || spaceBesideBrackets === 'both') {
        outputTokens.push(' ')
      } else if (spaceBesideBrackets === 'keep') {
        const start = lastTokens.end + 1
        const end = token.start
        outputTokens.push(str.substring(start, end))
      }
    }

    // append content
    // - convert punctuation from half width to full width
    // - convert punctuation from full width to half width
    // - keep
    if (token.type === 'latin-punctuation' && punctuationWidth === 'full') {
      outputTokens.push(half2FullMap[token.content] || token.content)
    } else if (token.type === 'cjk-punctuation' && punctuationWidth === 'half') {
      outputTokens.push(full2HalfMap[token.content] || token.content)
    } else {
      outputTokens.push(token.content)
    }

    // update travel states
    lastToken = token
    lastTokens = tokens
  })

  // append identifier for end of groups if has
  if (lastTokens && lastTokens !== topLevelTokens) {
    // space inside group
    // - one space
    // - keep
    // - no space
    // todo: use parent to find all unclosed group(s), with outside space
    if (spaceBesideBrackets === 'inside' || spaceBesideBrackets === 'both') {
      outputTokens.push(' ')
    } else if (spaceBesideBrackets === 'keep') {
      const start = lastToken.end + 1
      const end = lastTokens.end
      outputTokens.push(str.substring(start, end))
    }
    // end of the group
    outputTokens.push(lastTokens.right)
  }

  // join linted tokens together
  const strAfter = outputTokens.join('')

  // apply post replace options
  const finalStr = postReplaceOptions.reduce((result, { input, output }) => result.replace(input, output), strAfter)

  return finalStr
}

module.exports.checkCharType = checkCharType
module.exports.parse = parse
module.exports.travel = travel
