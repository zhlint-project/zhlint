import { IgnoredMark } from './ignore'
import { Validation, ValidationTarget } from './report'
import {
  MutableGroupToken as GroupToken,
  MutableToken as Token
} from './parser'

const isInRange = (start: number, end: number, mark: IgnoredMark) => {
  return start <= mark.end && end >= mark.start
}

type IgnoredFlags = Record<ValidationTarget, boolean>

const isIgnored = (token: Token, marks: IgnoredMark[] = []): IgnoredFlags => {
  const result: IgnoredFlags = {
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
        result[ValidationTarget.SPACE_AFTER] = true
      }
      if (
        isInRange(
          index + (startContent || '').length,
          index + (startContent || '').length + (innerSpaceBefore || '').length,
          mark
        )
      ) {
        result[ValidationTarget.INNER_SPACE_BEFORE] = true
      }
      if (isInRange(endIndex, endIndex + (endContent || '').length, mark)) {
        result[ValidationTarget.END_CONTENT] = true
      }
      if (
        isInRange(
          endIndex + (endContent || '').length,
          endIndex + (endContent || '').length + (spaceAfter || '').length,
          mark
        )
      ) {
        result[ValidationTarget.SPACE_AFTER] = true
      }
    } else {
      const { index, content, spaceAfter } = token
      if (isInRange(index, index + (content || '').length, mark)) {
        result[ValidationTarget.CONTENT] = true
      }
      if (
        isInRange(
          index + (content || '').length,
          index + (content || '').length + (spaceAfter || '').length,
          mark
        )
      ) {
        result[ValidationTarget.SPACE_AFTER] = true
      }
    }
  })
  return result
}

const recordValidations = (
  token: Token,
  offset = 0,
  ignoredFlags: IgnoredFlags,
  validations: Validation[] = []
): void => {
  token.validations.forEach((v) => {
    if (!ignoredFlags[v.target]) {
      validations.push({ ...v, index: v.index + offset })
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
  validations: Validation[] = [],
  isChild?: boolean
): string => {
  const ignoredFlags = isIgnored(tokens, ignoredMarks)
  if (!isChild) {
    recordValidations(tokens, offset, ignoredFlags, validations)
  }
  return [
    ignoredFlags[ValidationTarget.START_CONTENT] ? tokens.startContent : tokens.modifiedStartContent,
    ignoredFlags[ValidationTarget.INNER_SPACE_BEFORE]
      ? tokens.innerSpaceBefore
      : tokens.modifiedInnerSpaceBefore,
    ...tokens.map((token) => {
      const subIgnoredFlags = isIgnored(token, ignoredMarks)
      recordValidations(token, offset, subIgnoredFlags, validations)
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
      return join(token, offset, ignoredMarks, validations, true)
    }),
    ignoredFlags[ValidationTarget.END_CONTENT] ? tokens.endContent : tokens.modifiedEndContent,
    ignoredFlags[ValidationTarget.SPACE_AFTER] ? tokens.spaceAfter : tokens.modifiedSpaceAfter
  ]
    .filter(Boolean)
    .join('')
}

export default join
