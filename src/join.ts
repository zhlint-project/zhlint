import { IgnoredMark } from './ignore'
import { Validation } from './logger'
import { GroupToken, Token } from './parser/types'

type ValidatedToken = Token & {
  validations: Validation[]
}

const isInRange = (start: number, end: number, mark: IgnoredMark) => {
  return start <= mark.end && end >= mark.start
}

type IgnoredPiece = {
  startContent: boolean
  innerSpaceBefore: boolean
  content: true
  endContent: true
  spaceAfter: true
}

const isIgnored = (token: Token, marks: IgnoredMark[] = []) => {
  const result = {} as IgnoredPiece

  // - group: startContent, innerSpaceBefore, endContent, spaceAfter
  // - single: raw, spaceAfter
  marks.forEach((mark) => {
    if (Array.isArray(token)) {
      const {
        index,
        rawStartContent,
        rawInnerSpaceBefore,
        endIndex = 0,
        rawEndContent,
        rawSpaceAfter
      } = token
      if (isInRange(index, index + (rawStartContent || '').length, mark)) {
        result.startContent = true
      }
      if (
        isInRange(
          index + (rawStartContent || '').length,
          index +
            (rawStartContent || '').length +
            (rawInnerSpaceBefore || '').length,
          mark
        )
      ) {
        result.innerSpaceBefore = true
      }
      if (isInRange(endIndex, endIndex + (rawEndContent || '').length, mark)) {
        result.endContent = true
      }
      if (
        isInRange(
          endIndex + (rawEndContent || '').length,
          endIndex +
            (rawEndContent || '').length +
            (rawSpaceAfter || '').length,
          mark
        )
      ) {
        result.spaceAfter = true
      }
    } else {
      const { index, raw, rawSpaceAfter } = token
      if (isInRange(index, index + (raw || '').length, mark)) {
        result.content = true
      }
      if (
        isInRange(
          index + (raw || '').length,
          index + (raw || '').length + (rawSpaceAfter || '').length,
          mark
        )
      ) {
        result.spaceAfter = true
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
  const ignoredPieces = isIgnored(tokens, ignoredMarks)
  // innerSpaceBefore
  return [
    ignoredPieces.startContent ? tokens.rawStartContent : tokens.startContent,
    ignoredPieces.innerSpaceBefore
      ? tokens.rawInnerSpaceBefore
      : tokens.innerSpaceBefore,
    ...tokens.map((token: ValidatedToken) => {
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
            ignoredPieces.content ? token.raw : token.content,
            ignoredPieces.spaceAfter ? token.rawSpaceAfter : token.spaceAfter
          ]
            .filter(Boolean)
            .join('')
    }),
    ignoredPieces.endContent ? tokens.rawEndContent : tokens.endContent,
    ignoredPieces.spaceAfter ? tokens.rawSpaceAfter : tokens.spaceAfter
  ]
    .filter(Boolean)
    .join('')
}

export default join
