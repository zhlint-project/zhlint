import { Validation, ValidationTarget } from '../report'
import {
  MarkSideType,
  MutableGroupToken as GroupToken,
  MutableToken as Token,
  SingleTokenType,
  isNonHyperVisibleType,
  isInvisibleType,
  isVisibleType,
  isLegacyHyperContentType
} from '../parser'

// find tokens

/**
 * Find the previous token if exists
 */
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

/**
 * Find the next token if exists
 */
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

/**
 * Find a certain token before, which:
 * - group, content, punctuation, and bracket will be passed
 * - code, container, and unknown will be failed
 * - hyper mark will be skipped
 */
export const findNonHyperVisibleTokenBefore = (
  group: GroupToken,
  token: Token | undefined
): Token | undefined => {
  if (!token) {
    return
  }
  const beforeToken = findTokenBefore(group, token)
  if (!beforeToken) {
    return
  }
  // hyper mark: skip
  if (isInvisibleType(beforeToken.type)) {
    return findNonHyperVisibleTokenBefore(group, beforeToken)
  }
  // content, punctuation, bracket, group: return token
  if (isNonHyperVisibleType(beforeToken.type)) {
    return beforeToken
  }
  // code, unknown, container: return undefined
  return
}

/**
 * Find a certain token after, which:
 * - group, content, punctuation, and bracket will be passed
 * - code, container, and unknown will be failed
 * - hyper mark will be skipped
 */
export const findNonHyperVisibleTokenAfter = (
  group: GroupToken,
  token: Token | undefined
): Token | undefined => {
  if (!token) {
    return
  }
  const afterToken = findTokenAfter(group, token)
  if (!afterToken) {
    return
  }
  // hyper mark: skip
  if (isInvisibleType(afterToken.type)) {
    return findNonHyperVisibleTokenAfter(group, afterToken)
  }
  // content, punctuation, bracket, group: return token
  if (isNonHyperVisibleType(afterToken.type)) {
    return afterToken
  }
  // code, unknown, container: return undefined
  return
}

/**
 * Find a certain token before, which:
 * - group, content, punctuation, bracket, and code will be passed
 * - container, and unknown will be failed
 * - hyper mark will be skipped
 */
export const findExpectedVisibleTokenBefore = (
  group: GroupToken,
  token: Token | undefined
): Token | undefined => {
  if (!token) {
    return
  }
  const beforeToken = findTokenBefore(group, token)
  if (!beforeToken) {
    return
  }
  // hyper mark: skip
  if (isInvisibleType(beforeToken.type)) {
    return findNonHyperVisibleTokenBefore(group, beforeToken)
  }
  // content, punctuation, bracket, group: return token
  if (isVisibleType(beforeToken.type)) {
    return beforeToken
  }
  // unknown, container: return undefined
  return
}

/**
 * Find a certain token after, which:
 * - group, content, punctuation, bracket, and code will be passed
 * - container, and unknown will be failed
 * - hyper mark will be skipped
 */
export const findExpectedVisibleTokenAfter = (
  group: GroupToken,
  token: Token | undefined
): Token | undefined => {
  if (!token) {
    return
  }
  const beforeToken = findTokenAfter(group, token)
  if (!beforeToken) {
    return
  }
  // hyper mark: skip
  if (isInvisibleType(beforeToken.type)) {
    return findNonHyperVisibleTokenAfter(group, beforeToken)
  }
  // content, punctuation, bracket, group: return token
  if (isVisibleType(beforeToken.type)) {
    return beforeToken
  }
  // unknown, container: return undefined
  return
}

// hyper mark seq

const spreadHyperMarkSeq = (
  group: GroupToken,
  token: Token,
  seq: Token[],
  isBackward: boolean
): void => {
  if (isBackward) {
    const tokenBefore = findTokenBefore(group, token)
    if (tokenBefore && tokenBefore.type === SingleTokenType.MARK_HYPER) {
      seq.unshift(tokenBefore)
      spreadHyperMarkSeq(group, tokenBefore, seq, isBackward)
    }
  } else {
    const tokenAfter = findTokenAfter(group, token)
    if (tokenAfter && tokenAfter.type === SingleTokenType.MARK_HYPER) {
      seq.push(tokenAfter)
      spreadHyperMarkSeq(group, tokenAfter, seq, isBackward)
    }
  }
}

export const findHyperMarkSeq = (group: GroupToken, token: Token): Token[] => {
  const seq: Token[] = [token]
  spreadHyperMarkSeq(group, token, seq, false)
  spreadHyperMarkSeq(group, token, seq, true)
  return seq
}

export const hasSpaceInHyperMarkSeq = (
  group: GroupToken,
  markSeq: Token[]
): boolean => {
  if (markSeq.some((markToken) => markToken.modifiedSpaceAfter)) {
    return true
  }
  const tokenBefore = findTokenBefore(group, markSeq[0])
  if (tokenBefore) {
    return !!tokenBefore.modifiedSpaceAfter
  }
  return false
}

export const findSpaceHostInHyperMarkSeq = (
  group: GroupToken,
  markSeq: Token[]
): Token | undefined => {
  // TODO
  group
  markSeq
  return
}

// others

export const _findSpaceAfterHost = (
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
    if (_getMarkSide(lastPossibleHost) === MarkSideType.LEFT) {
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
  const sideSecond = _getMarkSide(secondPossibleHost)
  const sideLast = _getMarkSide(lastPossibleHost)

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
  return token.type === SingleTokenType.HYPER_CODE
}

export const _isUnexpectedHtmlTag = (token: Token): boolean => {
  // html tags, raw content
  if (isLegacyHyperContentType(token.type)) {
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

export const _isHyperTag = (token: Token): boolean => {
  // markdown tags
  if (isLegacyHyperContentType(token.type)) {
    return !isInlineCode(token)
  }
  if (token.type === 'mark-hyper') {
    return true
  }
  return false
}

export const _getMarkSide = (
  token: Token | undefined
): MarkSideType | undefined => {
  if (!token) {
    return
  }
  if (token.markSide) {
    return token.markSide
  }
  if (isLegacyHyperContentType(token.type) && !isInlineCode(token)) {
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
