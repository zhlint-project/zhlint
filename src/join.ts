import { IgnoredMark } from './ignore'
import { Validation } from './logger'
import { MutableGroupToken as GroupToken, MutableToken as Token } from './parser'

const isInRange = (start: number, end: number, mark: IgnoredMark) => {
  return start <= mark.end && end >= mark.start
}

type IgnoredFlags = {
  START: boolean
  INNER_SPACE: boolean
  CONTENT: true
  END: true
  SPACE_AFTER: true
}

const isIgnored = (token: Token, marks: IgnoredMark[] = []): IgnoredFlags => {
  const result = {} as IgnoredFlags

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
        result.START = true
      }
      if (
        isInRange(
          index + (startContent || '').length,
          index +
            (startContent || '').length +
            (innerSpaceBefore || '').length,
          mark
        )
      ) {
        result.INNER_SPACE = true
      }
      if (isInRange(endIndex, endIndex + (endContent || '').length, mark)) {
        result.END = true
      }
      if (
        isInRange(
          endIndex + (endContent || '').length,
          endIndex +
            (endContent || '').length +
            (spaceAfter || '').length,
          mark
        )
      ) {
        result.SPACE_AFTER = true
      }
    } else {
      const { index, content, spaceAfter } = token
      if (isInRange(index, index + (content || '').length, mark)) {
        result.CONTENT = true
      }
      if (
        isInRange(
          index + (content || '').length,
          index + (content || '').length + (spaceAfter || '').length,
          mark
        )
      ) {
        result.SPACE_AFTER = true
      }
    }
  })
  return result
}

/**
 * Join tokens back into string
 */
const join = (
  tokens: GroupToken,
  ignoredMarks: IgnoredMark[] = [],
  validations: Validation[] = [],
  start = 0
): string => {
  const ignoredFlags = isIgnored(tokens, ignoredMarks)
  // innerSpaceBefore
  return [
    ignoredFlags.START,
    ignoredFlags.INNER_SPACE,
    ...tokens.map((token) => {
      const ignoredPieces = isIgnored(token, ignoredMarks)
      // validate content, spaceAfter
      if (Array.isArray(token.validations)) {
        token.validations.forEach((v) =>
          validations.push({ ...v, index: v.index + start })
        )
      }
      return Array.isArray(token)
        ? join(token, ignoredMarks, validations, start)
        : [
            ignoredPieces.CONTENT,
            ignoredPieces.SPACE_AFTER
          ]
            .filter(Boolean)
            .join('')
    }),
    ignoredFlags.END,
    ignoredFlags.SPACE_AFTER
  ]
    .filter(Boolean)
    .join('')
}

export default join
