import { Data } from './types'

// ::: xxx\nyyy\nzzz\n:::\n
// - `(?<=^|\n)` + `(\:\:\:.*)`
// - `\n`
// - `(.+)`
// - `\n`
// - `(\:\:\:)` + `(?=\n|$)`
const matcher = /(?<=^|\n)(:::.*)\n(.+)\n(:::)(?=\n|$)/g

const parser = (data: Data): Data => {
  data.content = data.content.replace(
    matcher,
    (raw, start, content, end, index) => {
      const { length } = raw
      const name = start.substring(3).trim()
      data.ignoredByParsers.push({
        name,
        index,
        length: start.length,
        raw: start,
        meta: `vuepress-${name}-start`
      })
      data.ignoredByParsers.push({
        name,
        index: index + length - 3,
        length: 3,
        raw: end,
        meta: `vuepress-${name}-end`
      })
      return '@'.repeat(start.length) + '\n' + content + '\n' + '@'.repeat(3)
    }
  )
  return data
}

export default parser
