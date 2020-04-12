// utils

const findTokenBefore = (group, token) => {
  const index = group.indexOf(token)
  if (index < 0) {
    return
  }
  return group[index - 1]
}

const findTokenAfter = (group, token) => {
  const index = group.indexOf(token)
  if (index < 0) {
    return
  }
  return group[index + 1]
}

const findContentTokenBefore = (group, token) => {
  const index = group.indexOf(token)
  if (index < 0) {
    return
  }
  const tokenBefore = findTokenBefore(group, token)
  if (!tokenBefore) {
    return
  }
  if (
    tokenBefore.type === 'mark-hyper' ||
    (tokenBefore.type === 'content-hyper' && !isInlineCode(tokenBefore))
  ) {
    return findContentTokenBefore(group, group[index - 1])
  }
  if (tokenBefore.type.match(/^content\-/)) {
    return tokenBefore
  }
  return 
}

const findContentTokenAfter = (group, token) => {
  const index = group.indexOf(token)
  if (index < 0) {
    return
  }
  const tokenAfter = findTokenAfter(group, token)
  if (!tokenAfter) {
    return
  }
  if (
    tokenAfter.type === 'mark-hyper' ||
    (tokenAfter.type === 'content-hyper' && !isInlineCode(tokenAfter))
  ) {
    return findContentTokenAfter(group, group[index + 1])
  }
  if (tokenAfter.type.match(/^content\-/)) {
    return tokenAfter
  }
}

const findNonMarkTokenBefore = (group, token) => {
  const index = group.indexOf(token)
  if (index < 0) {
    return
  }
  const tokenBefore = findTokenBefore(group, token)
  if (!tokenBefore) {
    return
  }
  if (
    tokenBefore.type.match(/^content\-/) ||
    tokenBefore.type.match(/^punctuation\-/) ||
    tokenBefore.type === 'mark-brackets'
  ) {
    return tokenBefore
  } else if (tokenBefore.type === 'mark-hyper') {
    return findContentTokenBefore(group, group[index - 1])
  }
  return 
}

const findNonMarkTokenAfter = (group, token) => {
  const index = group.indexOf(token)
  if (index < 0) {
    return
  }
  const tokenAfter = findTokenAfter(group, token)
  if (!tokenAfter) {
    return
  }
  if (
    tokenAfter.type.match(/^content\-/) ||
    tokenAfter.type.match(/^punctuation\-/) ||
    tokenAfter.type === 'mark-brackets'
  ) {
    return tokenAfter
  } else if (tokenAfter.type === 'mark-hyper') {
    return findNonMarkTokenAfter(group, group[index + 1])
  }
}

const spreadMarkSeq = (group, token, seq, isBackward) => {
  if (isBackward) {
    const tokenBefore = findTokenBefore(group, token)
    if (tokenBefore && tokenBefore.type === 'mark-hyper') {
      seq.unshift(tokenBefore)
      spreadMarkSeq(group, tokenBefore, seq, isBackward)
    }
  } else {
    const tokenAfter = findTokenAfter(group, token)
    if (tokenAfter && tokenAfter.type === 'mark-hyper') {
      seq.push(tokenAfter)
      spreadMarkSeq(group, tokenAfter, seq, isBackward)
    }
  }
}

const findMarkSeq = (group, token) => {
  const seq = [token]
  spreadMarkSeq(group, token, seq)
  spreadMarkSeq(group, token, seq, true)
  return seq
}

const findSpaceAfterHost = (group, firstToken, lastToken) => {
  if (!firstToken || !lastToken) {
    return null
  }
  if (firstToken === lastToken) {
    return firstToken
  }
  const secondToken = findTokenAfter(group, firstToken)
  const sideSecond = getMarkSide(secondToken)
  const sideLast = getMarkSide(lastToken)
  if (sideSecond === sideLast) {
    return sideSecond === 'left' ? firstToken : lastToken
  } else {
    if (sideSecond === 'left') {
      return null
    }
    let tempToken = lastToken
    while (tempToken !== firstToken) {
      if (tempToken.markSide === 'right') {
        return tempToken
      }
      tempToken = findTokenBefore(group, tempToken)
    }
    return firstToken
  }
}

const isInlineCode = token => {
  // html tags, raw content
  if (token.type === 'content-hyper') {
    if (token.content.match(/\n/)) {
      return false
    }
    if (token.content.match(/^<code.*>.*<\/code.*>$/)) {
      return true
    }
    if (token.content.match(/^<.+>$/)) {
      return false
    }
    return true
  }
  return false
}

const isHyperTag = token => {
  // markdown tags
  if (token.type === 'content-hyper') {
    return !isInlineCode(token)
  }
  if (token.type === 'mark-hyper') {
    return true
  }
  return false
}

const getMarkSide = token => {
  if (token.markSide) {
    return token.markSide
  }
  if (token.type === 'content-hyper' && !isInlineCode(token)) {
    // non-inline-code html
    if (token.content.match(/^<[^\/].+>$/)) {
      // <...>
      return 'left'
    } else if (token.content.match(/^<\/.+>$/)) {
      // </...>
      return 'right'
    }
  }
}

const addValidation = (token, name, target, message) => {
  if (!token.validations) {
    token.validations = []
  }
  const validation = {
    index: token.index,
    length: token.length,
    target,
    name,
    message
  }
  if (target === 'startContent') {
    validation.index = token.startIndex
  } else if (target === 'endContent') {
    validation.index = token.startIndex
    validation.length = token.endIndex - token.startIndex + 1
  } else if (target === 'innerSpaceBefore') {
    validation.index = token.startIndex
  }
  token.validations.push(validation)
}

const hasValidation = (token, name, target) => {
  if (!token.validations || !token.validations.length) {
    return false
  }
  return validations.some(validation =>
    target ? validation.target === target : true &&
      name ? validation.name === name : true)
}

const removeValidation = (token, name, target) => {
  if (!token.validations) {
    return
  }
  token.validations = token.validations.filter(
    validation => target ? validation.target !== target : true &&
      name ? validation.name !== name : true)
}

module.exports = {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findContentTokenAfter,
  findNonMarkTokenBefore,
  findNonMarkTokenAfter,
  findMarkSeq,
  findSpaceAfterHost,
  isInlineCode,
  isHyperTag,
  getMarkSide,
  addValidation,
  hasValidation,
  removeValidation
}
