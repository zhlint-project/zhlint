const {
  findTokenBefore,
  findContentTokenBefore,
  findContentTokenAfter,
  addValidation
} = require('./util')

const halfWidthMap = {
  '（': `(`,
  '）': `)`,
}

const fullWidthMap = {
  ',': `，`,
  '.': `。`,
  ';': `；`,
  ':': `：`,
  '?': `？`,
  '!': `！`,
}

const messages = {
  full: ({ origin, result }) => `The punctuation \`${origin}\` should be full-width as \`${result}\`.`,
  half: ({ origin, result }) => `The punctuation \`${origin}\` should be half-width as \`${result}\`.`,
  bracketStart: ({ origin, result }) => `The left bracket \`${origin}\` should be full-width as \`${result}\`.`,
  bracketEnd: ({ origin, result }) => `The right bracket \`${origin}\` should be full-width as \`${result}\`.`
}

const targets = {
  full: 'content',
  half: 'content',
  bracketStart: 'startContent',
  bracketEnd: 'endContent'
}

const validate = (token, type, args, condition) => {
  if (condition) {
    addValidation(token, 'unify-punctuation', targets[type], messages[type](args))
  }
}

module.exports = (token, index, group, matched, marks) => {
  // full-width: comma, full stop, colon, quotes
  // half-width: brackets
  // no change for half-width punctuation between half-width content without space
  if (token.type === 'punctuation-half') {
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    const tokenBefore = findTokenBefore(group, token)
    const tokenBeforeContentTokenAfter = findTokenBefore(group, contentTokenAfter)
    if (contentTokenBefore && contentTokenBefore.type === 'content-half'
      && contentTokenAfter && contentTokenAfter.type === 'content-half'
      && !contentTokenBefore.spaceAfter
      && !tokenBefore.spaceAfter
      && !token.spaceAfter
      && !tokenBeforeContentTokenAfter.spaceAfter) {
      return
    }
    if (fullWidthMap[token.content]) {
      validate(token, 'full',
        { origin: token.content, result: fullWidthMap[token.content] }, true)
      token.rawType = token.type
      token.type = 'punctuation-full'
      token.content = fullWidthMap[token.content]
    }
  }
  else if (token.type === 'mark-brackets') {
    if (halfWidthMap[token.content]) {
      validate(token, 'half',
        { origin: token.content, result: halfWidthMap[token.content] }, true)
      token.content = halfWidthMap[token.content]
    }
  }
  else if (token.type === 'group') {
    if (token.startContent === '"') {
      validate(token, 'bracketStart',
        { origin: token.startContent, result: '“' }, true)
      token.startContent = '“'
    }
    if (token.startContent === "'") {
      validate(token, 'bracketStart',
        { origin: token.startContent, result: '‘' }, true)
      token.startContent = '‘'
    }
    if (token.endContent === '"') {
      validate(token, 'bracketEnd',
        { origin: token.startContent, result: '”' }, true)
      token.endContent = '”'
    }
    if (token.endContent === "'") {
      validate(token, 'bracketEnd',
        { origin: token.startContent, result: '’' }, true)
      token.endContent = '’'
    }
  }
}
