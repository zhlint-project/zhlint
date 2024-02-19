import { env } from './report.js'

// Ref: https://github.com/WICG/ScrollToTextFragment
export type IgnoredCase = {
  prefix?: string
  textStart: string
  textEnd?: string
  suffix?: string
}

export type IgnoredMark = {
  start: number
  end: number
}

/**
 * @param  {string}        str
 * @param  {IgnoredCase[]} ignoredCases string which should be skipped
 * @return {IgnoredMark[]}
 */
const findIgnoredMarks = (
  str: string,
  ignoredCases: IgnoredCase[] = [],
  logger: Console = env.defaultLogger
): IgnoredMark[] => {
  const marks: IgnoredMark[] = []
  ignoredCases.forEach(({ prefix, textStart, textEnd, suffix }): void => {
    const start = (prefix || '') + textStart
    const end = (textEnd || '') + (suffix || '')
    const startOffset = prefix ? prefix.length : 0
    const endOffset = suffix ? suffix.length : 0

    const findNextMatch = (currentIndex: number): void => {
      const startIndex = str.substring(currentIndex).indexOf(start)
      if (startIndex === -1) {
        return
      }

      const possibleStart = currentIndex + startIndex + startOffset
      const nextPossibleCurrentIndex = possibleStart + textStart.length

      if (!end) {
        if (globalThis.__DEV__) {
          logger.log(
            `ignore: ${str.substring(possibleStart, nextPossibleCurrentIndex)}`
          )
        }
        marks.push({
          start: possibleStart,
          end: nextPossibleCurrentIndex
        })
        findNextMatch(nextPossibleCurrentIndex)
      } else {
        const endIndex = str.substring(nextPossibleCurrentIndex).indexOf(end)
        const possibleEnd =
          nextPossibleCurrentIndex + endIndex + (textEnd || '').length

        if (endIndex === -1) {
          return
        } else {
          if (globalThis.__DEV__) {
            logger.log(`ignore: ${str.substring(possibleStart, possibleEnd)}`)
          }
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

export default findIgnoredMarks
