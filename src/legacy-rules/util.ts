import { Validation, ValidationTarget } from '../report'
import {
  MarkSideType,
  MutableSingleToken as SingleToken,
  MutableGroupToken as GroupToken,
  MutableToken as Token,
  SingleTokenType,
  isHyperContentType,
  TokenType,
  isContentType,
  isPunctuationType
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
    (isHyperContentType(tokenBefore.type) && !isInlineCode(tokenBefore))
  ) {
    return findContentTokenBefore(group, group[index - 1])
  }

  if (isContentTypeOrHyperContentType(tokenBefore.type)) {
    return tokenBefore as SingleToken
  }
}

const isContentTypeOrHyperContentType = (type: TokenType): boolean => {
  return isContentType(type) || isHyperContentType(type)
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
    (isHyperContentType(tokenAfter.type) && !isInlineCode(tokenAfter))
  ) {
    return findContentTokenAfter(group, group[index + 1])
  }

  if (isContentTypeOrHyperContentType(tokenAfter.type)) {
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
    isContentTypeOrHyperContentType(tokenBefore.type) ||
    isPunctuationType(tokenBefore.type) ||
    tokenBefore.type === SingleTokenType.MARK_BRACKETS
  ) {
    return tokenBefore
  } else if (tokenBefore.type === SingleTokenType.MARK_HYPER) {
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
    isContentTypeOrHyperContentType(tokenAfter.type) ||
    isPunctuationType(tokenAfter.type) ||
    tokenAfter.type === SingleTokenType.MARK_BRACKETS
  ) {
    return tokenAfter
  } else if (tokenAfter.type === SingleTokenType.MARK_HYPER) {
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
    if (tokenBefore && tokenBefore.type === SingleTokenType.MARK_HYPER) {
      seq.unshift(tokenBefore)
      spreadMarkSeq(group, tokenBefore, seq, isBackward)
    }
  } else {
    const tokenAfter = findTokenAfter(group, token)
    if (tokenAfter && tokenAfter.type === SingleTokenType.MARK_HYPER) {
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
  // If either first or last possible host then directly return another.
  // If neither first nor last possible host then return nothing.
  // If first equals to last then return it directly.
  if (!firstPossibleHost && !lastPossibleHost) {
    return
  }
  if (!firstPossibleHost) {
    // If first token doesn't exist (no left extra content)
    // and last token is left side mark, then no after space
    if (getMarkSide(lastPossibleHost) === MarkSideType.LEFT) {
      return
    }
    return lastPossibleHost
  }
  if (!lastPossibleHost) {
    return firstPossibleHost
  }
  if (firstPossibleHost === lastPossibleHost) {
    return firstPossibleHost
  }

  // If first and last both exists but different.
  // Detech whether this mark seq is on the left side or right.
  const secondPossibleHost = findTokenAfter(group, firstPossibleHost)
  const sideSecond = getMarkSide(secondPossibleHost)
  const sideLast = getMarkSide(lastPossibleHost)

  // If first and last mark have the same side, then return
  if (sideSecond === sideLast) {
    // - first mark if it's the left side
    // - last mark if it's the right side
    return sideSecond === MarkSideType.LEFT
      ? firstPossibleHost
      : lastPossibleHost
  }

  // If first mark is the left side and last mark is the right side,
  // that usually means multiple marks partially overlapped.
  // This situation is abnormal but technically exists.
  // We'd better do nothing and leave this issue to human.
  if (sideSecond === MarkSideType.LEFT) {
    return
  }

  // If first mark is the right side and last mark is the left side,
  // that usually means multiple marks closely near eath other.
  // We'd better find the gap outside the both sides of marks.
  let tempToken: Token = lastPossibleHost
  while (tempToken !== firstPossibleHost) {
    if (tempToken.markSide === MarkSideType.RIGHT) {
      return tempToken
    }
    tempToken = findTokenBefore(group, tempToken) as Token
  }
  return firstPossibleHost
}

export const isInlineCode = (token: Token): boolean => {
  // html tags, raw content
  if (isHyperContentType(token.type)) {
    if (token.content.match(/\n/)) {
      // Usually it's hexo custom containers.
      return false
    }
    if (token.content.match(/^<code.*>.*<\/code.*>$/)) {
      // Usually it's <code>...</code>.
      return true
    }
    if (token.content.match(/^<.+>$/)) {
      // Usually it's other HTML tags.
      return false
    }
    // Usually it's `...`.
    return true
  }
  return false
}

export const isUnexpectedHtmlTag = (token: Token): boolean => {
  // html tags, raw content
  if (isHyperContentType(token.type)) {
    if (token.content.match(/\n/)) {
      // Usually it's hexo custom containers.
      return false
    }
    if (token.content.match(/^<code.*>.*<\/code.*>$/)) {
      // Usually it's <code>...</code>.
      return false
    }
    if (token.content.match(/^<.+>$/)) {
      // Usually it's other HTML tags.
      return true
    }
    // Usually it's `...`.
    return false
  }
  return false
}

export const isHyperTag = (token: Token): boolean => {
  // markdown tags
  if (isHyperContentType(token.type)) {
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
  if (isHyperContentType(token.type) && !isInlineCode(token)) {
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
