import { Validation, ValidationTarget } from '../report'
import {
  MarkSideType,
  MutableSingleToken as SingleToken,
  MutableGroupToken as GroupToken,
  MutableToken as Token
} from '../parser'

// find tokens

export const findTokenBefore = (
  group: GroupToken,
  token: Token | undefined
): Token | undefined => {
  if (!token) {
    return
  }
  const index = group.indexOf(token)
  if (index < 0) {
    return
  }
  return group[index - 1]
}

export const findTokenAfter = (
  group: GroupToken,
  token: Token | undefined
): Token | undefined => {
  if (!token) {
    return
  }
  const index = group.indexOf(token)
  if (index < 0) {
    return
  }
  return group[index + 1]
}

export const findContentTokenBefore = (
  group: GroupToken,
  token: Token | undefined
): SingleToken | undefined => {
  if (!token) {
    return
  }

  const index = group.indexOf(token)
  if (index < 0) {
    return
  }

  const tokenBefore = findTokenBefore(group, token)
  if (!tokenBefore) {
    return
  }

  // TODO: type enum
  if (
    tokenBefore.type === 'mark-hyper' ||
    (tokenBefore.type === 'content-hyper' && !isInlineCode(tokenBefore))
  ) {
    return findContentTokenBefore(group, group[index - 1])
  }

  if (tokenBefore.type.match(/^content-/)) {
    return tokenBefore as SingleToken
  }
}

export const findContentTokenAfter = (
  group: GroupToken,
  token: Token | undefined
): SingleToken | undefined => {
  if (!token) {
    return
  }

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

  if (tokenAfter.type.match(/^content-/)) {
    return tokenAfter as SingleToken
  }
}

export const findNonMarkTokenBefore = (
  group: GroupToken,
  token: Token | undefined
): Token | undefined => {
  if (!token) {
    return
  }

  const index = group.indexOf(token)
  if (index < 0) {
    return
  }

  const tokenBefore = findTokenBefore(group, token)
  if (!tokenBefore) {
    return
  }

  if (
    tokenBefore.type.match(/^content-/) ||
    tokenBefore.type.match(/^punctuation-/) ||
    tokenBefore.type === 'mark-brackets'
  ) {
    return tokenBefore
  } else if (tokenBefore.type === 'mark-hyper') {
    return findContentTokenBefore(group, group[index - 1])
  }
}

export const findNonMarkTokenAfter = (
  group: GroupToken,
  token: Token | undefined
): Token | undefined => {
  if (!token) {
    return
  }

  const index = group.indexOf(token)
  if (index < 0) {
    return
  }

  const tokenAfter = findTokenAfter(group, token)
  if (!tokenAfter) {
    return
  }

  if (
    tokenAfter.type.match(/^content-/) ||
    tokenAfter.type.match(/^punctuation-/) ||
    tokenAfter.type === 'mark-brackets'
  ) {
    return tokenAfter
  } else if (tokenAfter.type === 'mark-hyper') {
    return findNonMarkTokenAfter(group, group[index + 1])
  }
}

// mark seq

export const spreadMarkSeq = (
  group: GroupToken,
  token: Token,
  seq: Token[],
  isBackward: boolean
): void => {
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

export const findMarkSeq = (group: GroupToken, token: Token): Token[] => {
  const seq: Token[] = [token]
  spreadMarkSeq(group, token, seq, false)
  spreadMarkSeq(group, token, seq, true)
  return seq
}

// others

export const findSpaceAfterHost = (
  group: GroupToken,
  firstPossibleHost: Token | undefined,
  lastPossibleHost: Token | undefined
): Token | undefined => {
  if (!firstPossibleHost && !lastPossibleHost) {
    return
  }
  if (!firstPossibleHost) {
    return lastPossibleHost
  }
  if (!lastPossibleHost) {
    return firstPossibleHost
  }
  if (firstPossibleHost === lastPossibleHost) {
    return firstPossibleHost
  }

  const secondPossibleHost = findTokenAfter(group, firstPossibleHost)
  const sideSecond = getMarkSide(secondPossibleHost)
  const sideLast = getMarkSide(lastPossibleHost)
  if (sideSecond === sideLast) {
    return sideSecond === MarkSideType.LEFT
      ? firstPossibleHost
      : lastPossibleHost
  } else {
    if (sideSecond === MarkSideType.LEFT) {
      return
    }
    let tempToken: Token = lastPossibleHost
    while (tempToken !== firstPossibleHost) {
      if (tempToken.markSide === MarkSideType.RIGHT) {
        return tempToken
      }
      tempToken = findTokenBefore(group, tempToken) as Token
    }
    return firstPossibleHost
  }
}

export const isInlineCode = (token: Token): boolean => {
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

export const isHyperTag = (token: Token): boolean => {
  // markdown tags
  if (token.type === 'content-hyper') {
    return !isInlineCode(token)
  }
  if (token.type === 'mark-hyper') {
    return true
  }
  return false
}

export const getMarkSide = (
  token: Token | undefined
): MarkSideType | undefined => {
  if (!token) {
    return
  }
  if (token.markSide) {
    return token.markSide
  }
  if (token.type === 'content-hyper' && !isInlineCode(token)) {
    // non-inline-code html
    if (token.content.match(/^<[^/].+>$/)) {
      // <...>
      return MarkSideType.LEFT
    } else if (token.content.match(/^<\/.+>$/)) {
      // </...>
      return MarkSideType.RIGHT
    }
  }
}

// validations

export const addValidation = (
  token: Token,
  name: string,
  target: ValidationTarget,
  message: string
): void => {
  if (!token.validations) {
    token.validations = []
  }
  const validation: Validation = {
    index: token.index,
    length: token.length,
    target,
    name,
    message
  }
  if (target === ValidationTarget.START_CONTENT) {
    validation.index = (token as GroupToken).startIndex
  } else if (target === ValidationTarget.END_CONTENT) {
    validation.index = (token as GroupToken).startIndex
    validation.length =
      (token as GroupToken).endIndex - (token as GroupToken).startIndex + 1
  } else if (target === ValidationTarget.INNER_SPACE_BEFORE) {
    validation.index = (token as GroupToken).startIndex
  }
  token.validations.push(validation)
}

export const hasValidation = (
  token: Token,
  name: string,
  target: ValidationTarget
): boolean => {
  if (!token.validations.length) {
    return false
  }
  return token.validations.some((validation) =>
    target
      ? validation.target === target
      : true && name
      ? validation.name === name
      : true
  )
}

export const removeValidation = (
  token: Token,
  name: string,
  target: ValidationTarget
) => {
  token.validations = token.validations.filter((validation) =>
    target
      ? validation.target !== target
      : true && name
      ? validation.name !== name
      : true
  )
}
