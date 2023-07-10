import { IgnoredMark } from './ignore'
import { Validation, ValidationTarget } from './report'
import {
  MutableGroupToken as GroupToken,
  MutableToken as Token
} from './parser'

const isInRange = (start: number, end: number, mark: IgnoredMark) => {
  return start <= mark.end && end >= mark.start
}

type IgnoredFlags = Record<ValidationTarget, boolean> & { ignored: boolean }

const isIgnored = (token: Token, marks: IgnoredMark[] = []): IgnoredFlags => {
  const result: IgnoredFlags = {
    ignored: false,
    [ValidationTarget.CONTENT]: false,
    [ValidationTarget.SPACE_AFTER]: false,
    [ValidationTarget.START_CONTENT]: false,
    [ValidationTarget.END_CONTENT]: false,
    [ValidationTarget.INNER_SPACE_BEFORE]: false,
  }

  // - group: startContent, innerSpaceBefore, endContent, spaceAfter
  // - single: raw, spaceAfter
  marks.forEach((mark) => {
    if (Array.isArray(token)) {
      const {
        index,
        startContent,
        innerSpaceBefore,
        endIndex = 0,
        endContent,
        spaceAfter
      } = token
      if (isInRange(index, index + (startContent || '').length, mark)) {
        result[ValidationTarget.SPACE_AFTER] = result.ignored = true
      }
      if (
        isInRange(
          index + (startContent || '').length,
          index + (startContent || '').length + (innerSpaceBefore || '').length,
          mark
        )
      ) {
        result[ValidationTarget.INNER_SPACE_BEFORE] = result.ignored = true
      }
      if (isInRange(endIndex, endIndex + (endContent || '').length, mark)) {
        result[ValidationTarget.END_CONTENT] = result.ignored = true
      }
      if (
        isInRange(
          endIndex + (endContent || '').length,
          endIndex + (endContent || '').length + (spaceAfter || '').length,
          mark
        )
      ) {
        result[ValidationTarget.SPACE_AFTER] = result.ignored = true
      }
    } else {
      const { index, content, spaceAfter } = token
      if (isInRange(index, index + (content || '').length, mark)) {
        result[ValidationTarget.CONTENT] = result.ignored = true
      }
      if (
        isInRange(
          index + (content || '').length,
          index + (content || '').length + (spaceAfter || '').length,
          mark
        )
      ) {
        result[ValidationTarget.SPACE_AFTER] = result.ignored = true
      }
    }
  })
  return result
}

const recordValidations = (
  token: Token,
  offset = 0,
  ignoredFlags: IgnoredFlags,
  validations: Validation[] = [],
  skippedValidations: Validation[] = []
): void => {
  token.validations.forEach((v) => {
    const validationWithOffset = { ...v, index: v.index + offset }
    if (!ignoredFlags[v.target]) {
      validations.push(validationWithOffset)
    } else {
      skippedValidations.push(validationWithOffset)
    }
  })
}

/**
 * Join tokens back into string
 * @param tokens the target group token, the index is relative to the block it belongs to
 * @param offset the index of the block, relative to the file it belongs to
 * @param ignoredMarks the ignored marks, the index is relative to the block it belongs to
 * @param validations the validation list result
 * @param isChild whether the group token is a child token of the block
 */
const join = (
  tokens: GroupToken,
  offset = 0,
  ignoredMarks: IgnoredMark[] = [],
  ignoredTokens: Token[] = [],
  validations: Validation[] = [],
  skippedValidations: Validation[] = [],
  isChild?: boolean
): string => {
  const ignoredFlags = isIgnored(tokens, ignoredMarks)
  if (!isChild && ignoredFlags.ignored) {
    ignoredTokens.push(tokens)
  }
  if (!isChild) {
    recordValidations(tokens, offset, ignoredFlags, validations, skippedValidations)
  }
  return [
    ignoredFlags[ValidationTarget.START_CONTENT] ? tokens.startContent : tokens.modifiedStartContent,
    ignoredFlags[ValidationTarget.INNER_SPACE_BEFORE]
      ? tokens.innerSpaceBefore
      : tokens.modifiedInnerSpaceBefore,
    ...tokens.map((token) => {
      const subIgnoredFlags = isIgnored(token, ignoredMarks)
      if (subIgnoredFlags.ignored) {
        ignoredTokens.push(token)
      }
      recordValidations(token, offset, subIgnoredFlags, validations, skippedValidations)
      if (!Array.isArray(token)) {
        return [
          subIgnoredFlags[ValidationTarget.CONTENT] ? token.content : token.modifiedContent,
          subIgnoredFlags[ValidationTarget.SPACE_AFTER]
            ? token.spaceAfter
            : token.modifiedSpaceAfter
        ]
          .filter(Boolean)
          .join('')
        }
      return join(token, offset, ignoredMarks, ignoredTokens, validations, skippedValidations, true)
    }),
    ignoredFlags[ValidationTarget.END_CONTENT] ? tokens.endContent : tokens.modifiedEndContent,
    ignoredFlags[ValidationTarget.SPACE_AFTER] ? tokens.spaceAfter : tokens.modifiedSpaceAfter
  ]
    .filter(Boolean)
    .join('')
}

export default join
