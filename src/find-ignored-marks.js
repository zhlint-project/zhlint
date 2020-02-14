/**
 * @param  {string}        str
 * @param  {IgnoredCase[]} ignoredCases string which should be skipped
 * @return {IgnoredMark[]}
 * - IgnoredCase: { prefix?, textStart, textEnd?, suffix? } Ref: https://github.com/WICG/ScrollToTextFragment
 * - IgnoredMark: { start, end }
 */
const findIgnoredMarks = (str, ignoredCases = []) => {
  const marks = []
  ignoredCases.forEach(({
    prefix,
    textStart,
    textEnd,
    suffix
  }) => {
    const start = (prefix || '') + textStart
    const end = (textEnd || '') + (suffix || '')
    const startOffset = prefix ? prefix.length : 0
    const endOffset = suffix ? suffix.length : 0

    const findNextMatch = currentIndex => {
      const startIndex = str.substr(currentIndex).search(start)
      if (startIndex === -1) {
        return
      }
      const possibleStart = currentIndex + startIndex + startOffset
      const nextPossibleCurrentIndex = possibleStart + textStart.length
      if (!end) {
        marks.push({
          start: possibleStart,
          end: nextPossibleCurrentIndex
        })
        findNextMatch(nextPossibleCurrentIndex)
      } else {
        const endIndex = str.substr(nextPossibleCurrentIndex).search(end)
        const possibleEnd = nextPossibleCurrentIndex + endIndex + textEnd.length
        if (endIndex === -1) {
          return
        } else {
          marks.push({
            start: possibleStart,
            end: possibleEnd
          })
          findNextMatch(possibleEnd + endOffset)
        }
      }
    }

    findNextMatch(0)
  })
  return marks.sort((a, b) => a.start - b.start)
}

module.exports = findIgnoredMarks
