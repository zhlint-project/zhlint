const isInRange = (start, end, mark) => {
  return start <= mark.end && end >= mark.start
}

const isIgnored = (token, marks = []) => {
  // TODO: any
  const result: any = {}
  const {
    index,
    rawStartContent,
    rawInnerSpaceBefore,
    raw,
    endIndex,
    rawEndContent,
    rawSpaceAfter
  } = token

  // - group: startContent, innerSpaceBefore, endContent, spaceAfter
  // - single: raw, spaceAfter
  marks.forEach((mark) => {
    if (Array.isArray(token)) {
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
 * @param  {Array<Token>} tokens
 * @param  {IngoredMark[]} ignoredMarks string which should be skipped
 * - IngoreMark: { start, end }
 * @return {string}
 */
const join = (tokens, ignoredMarks = [], validations = [], start = 0) => {
  const ignoredPieces = isIgnored(tokens, ignoredMarks)
  // innerSpaceBefore
  return [
    ignoredPieces.startContent ? tokens.rawStartContent : tokens.startContent,
    ignoredPieces.innerSpaceBefore
      ? tokens.rawInnerSpaceBefore
      : tokens.innerSpaceBefore,
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
