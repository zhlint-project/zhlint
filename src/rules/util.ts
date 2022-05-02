import { Validation, ValidationTarget } from '../report'
import {
  MarkSideType,
  MutableGroupToken as GroupToken,
  MutableToken as Token,
  SingleTokenType,
  isNonHyperVisibleType,
  isInvisibleType,
  isVisibleType,
  GroupTokenType,
  TokenType
} from '../parser'

// options

export type Options = {
  // punctuation
  halfWidthPunctuation?: string
  fullWidthPunctuation?: string
  unifiedPunctuation?: 'traditional' | 'simplified'

  // space around content
  spaceBetweenHalfWidthContent?: boolean
  noSpaceBetweenFullWidthContent?: boolean
  spaceBetweenMixedWidthContent?: boolean

  // space around punctuation
  noSpaceBeforePunctuation?: boolean
  spaceAfterHalfWidthPunctuation?: boolean
  noSpaceAfterFullWidthPunctuation?: boolean

  // space around quote and bracket
  spaceOutsideQuote?: boolean
  noSpaceInsideQuote?: boolean
  spaceOutsideBracket?: boolean
  noSpaceInsideBracket?: boolean

  // space around code
  spaceOutsideCode?: boolean

  // space around mark
  noSpaceInsideMark?: boolean

  // test
  skip?: {
    abbrs?: string[]
    ellipsis?: boolean
  }
}

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

const findHyperMarkSeq = (group: GroupToken, token: Token): Token[] => {
  const seq: Token[] = [token]
  spreadHyperMarkSeq(group, token, seq, false)
  spreadHyperMarkSeq(group, token, seq, true)
  return seq
}

const findSpaceHostInHyperMarkSeq = (
  group: GroupToken,
  hyperMarkSeq: Token[]
): Token | undefined => {
  // Return nothing if the seq is empty
  if (!hyperMarkSeq.length) {
    return
  }

  const tokenBefore = findTokenBefore(group, hyperMarkSeq[0])
  const firstMark = hyperMarkSeq[0]
  const lastMark = hyperMarkSeq[hyperMarkSeq.length - 1]
  const firstMarkSide = firstMark.markSide
  const lastMarkSide = lastMark.markSide

  // Return nothing if any token is not a mark.
  if (!firstMarkSide || !lastMarkSide) {
    return
  }

  // If first and last mark have the same side, then return:
  // - token before first mark if they are the left side
  // - last mark if they are the right side
  if (firstMarkSide === lastMarkSide) {
    if (firstMarkSide === MarkSideType.LEFT) {
      return tokenBefore
    }
    return lastMark
  }

  // If first mark is the left side and last mark is the right side,
  // that usually means multiple marks partially overlapped.
  // This situation is abnormal but technically exists.
  // We'd better do nothing and leave this issue to human.
  if (firstMarkSide === MarkSideType.LEFT) {
    return
  }

  // If first mark is the right side and last mark is the left side,
  // that usually means multiple marks closely near eath other.
  // We'd better find the gap outside the both sides of marks.
  let tempToken: Token = lastMark
  while (tempToken !== lastMark) {
    if (tempToken.markSide === MarkSideType.RIGHT) {
      return tempToken
    }
    tempToken = findTokenBefore(group, tempToken) as Token
  }
  return tokenBefore
}

export const findMarkSeqBetween = (
  group: GroupToken,
  before: Token,
  after: Token
): {
  spaceHost?: Token
  markSeq: Token[]
  tokenSeq: Token[]
} => {
  if (!before || !after) {
    return {
      spaceHost: undefined,
      markSeq: [],
      tokenSeq: []
    }
  }

  const firstMark = findTokenAfter(group, before)
  const firstVisible = findExpectedVisibleTokenAfter(group, before)
  if (!firstMark || firstVisible !== after) {
    return {
      spaceHost: undefined,
      markSeq: [],
      tokenSeq: []
    }
  }
  if (firstMark === after) {
    return {
      spaceHost: before,
      markSeq: [],
      tokenSeq: [before]
    }
  }

  const markSeq = findHyperMarkSeq(group, firstMark)
  const spaceHost = findSpaceHostInHyperMarkSeq(group, markSeq)

  return {
    spaceHost,
    markSeq,
    tokenSeq: [before, ...markSeq]
  }
}

// validations helpers

const createValidation = (
  token: Token,
  target: ValidationTarget,
  message: string,
  name: string
): Validation => {
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
  return validation
}

export const setValidationOnTarget = (
  token: Token,
  target: ValidationTarget,
  message: string,
  name: string,
): void => {
  const validation = createValidation(token, target, message, name)
  removeValidationOnTarget(token, target)
  token.validations.push(validation)
}

export const hasValidationOnTarget = (
  token: Token,
  target: ValidationTarget
): boolean => {
  return token.validations.some((validation) => validation.target === target)
}

export const removeValidationOnTarget = (
  token: Token,
  target: ValidationTarget
): void => {
  token.validations = token.validations.filter(
    (validation) => validation.target !== target
  )
}

// validation checkers

type Checker = (
  token: Token,
  value: string,
  message: string
) => void

const genChecker = (key: keyof Token | keyof GroupToken, target: ValidationTarget): Checker => {
  return (token: Token, value: string, message: string) => {
    if (token[key] !== value) {
      token[key] = value
      setValidationOnTarget(token, target, message, '')
    }
  }
}

export const checkSpaceAfter: Checker = genChecker(
  'modifiedSpaceAfter',
  ValidationTarget.SPACE_AFTER
)

export const checkStartContent: Checker = genChecker(
  'modifiedStartContent',
  ValidationTarget.START_CONTENT
)

export const checkEndContent: Checker = genChecker(
  'modifiedEndContent',
  ValidationTarget.END_CONTENT
)

export const checkInnerSpaceBefore: Checker = genChecker(
  'modifiedInnerSpaceBefore',
  ValidationTarget.INNER_SPACE_BEFORE
)

export const checkContent = (
  token: Token,
  value: string,
  type: TokenType,
  message: string
): void => {
  if (token.modifiedContent === value) {
    return
  }
  token.modifiedContent = value
  token.modifiedType = type
  setValidationOnTarget(token, ValidationTarget.CONTENT, message, '')
}

// legacy validation helpers

export const addValidation = (
  token: Token,
  name: string,
  target: ValidationTarget,
  message: string
): void => {
  const validation = createValidation(token, target, message, name)
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
