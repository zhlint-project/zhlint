const isInRange = (start, end, mark) =>
  start <= mark.end && end >= mark.start

const isIgnored = (token, marks = []) => {
  const result = {}
  const {
    index,
    rawStartContent,
    rawInnerSpaceBefore,
    raw,
    endIndex,
    rawEndContent,
    rawSpaceAfter,
  } = token

  // - group: startContent, innerSpaceBefore, endContent, spaceAfter
  // - single: raw, spaceAfter
  marks.forEach(mark => {
    if (Array.isArray(token)) {
      if (rawStartContent &&
        isInRange(index, index + rawStartContent.length, mark)
      ) {
        result.startContent = true
      }
      if (rawInnerSpaceBefore &&
        isInRange(
          index + (rawStartContent || '').length,
          index + (rawStartContent || '').length + rawInnerSpaceBefore.length,
          mark
        )
      ) {
        result.innerSpaceBefore = true
      }
      if (rawEndContent &&
        isInRange(endIndex, endIndex + rawEndContent.length, mark)
      ) {
        result.endContent = true
      }
      if (rawSpaceAfter &&
        isInRange(
          endIndex + (rawEndContent || '').length,
          endIndex + (rawEndContent || '').length + rawSpaceAfter.length,
          mark
        )
      ) {
        result.spaceAfter = true
      }
    } else {
      if (raw && isInRange(index, index + raw.length, marks)) {
        result.content = true
      }
      if (rawSpaceAfter &&
        isInRange(
          index + (raw || '').length,
          index + (raw || '').length + rawSpaceAfter.length,
          marks
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
const join = (tokens, ignoredMarks = []) => {
  const ignoredPieces = isIgnored(tokens, ignoredMarks)
  return [
    ignoredPieces.startContent ? tokens.rawStartContent : tokens.startContent,
    ignoredPieces.innerSpaceBefore ? tokens.rawInnerSpaceBefore : tokens.innerSpaceBefore,
    ...tokens.map(token => {
      const ignoredPieces = isIgnored(token, ignoredMarks)
      return Array.isArray(token)
        ? join(token, ignoredMarks)
        : [
            ignoredPieces.content ? token.raw : token.content,
            ignoredPieces.spaceAfter ? token.rawSpaceAfter : token.spaceAfter
          ].filter(Boolean).join('')
    }),
    ignoredPieces.endContent ? tokens.rawEndContent : tokens.endContent,
    ignoredPieces.spaceAfter ? tokens.rawSpaceAfter : tokens.spaceAfter
  ].filter(Boolean).join('')
}

module.exports = join
