import { ParsedStatus } from './types'

// TODO: ::: tips 提示...
//
// ::: xxx\nyyy\nzzz\n:::\n
// - `(?<=^|\n)` + `(:::.*)`
// - `\n`
// - `(.+)`
// - `\n`
// - `(:::)` + `(?=\n|$)`
let matcher: RegExp

try {
  matcher = new RegExp('(?<=^|\\n)(:::.*)\\n([\\s\\S]+?)\\n(:::)(?=\\n|$)', 'g')
} catch {
  matcher = /(:::.*)\n([\s\S]+?)\n(:::)/g
}

const parser = (data: ParsedStatus): ParsedStatus => {
  data.modifiedContent = data.modifiedContent.replace(
    matcher,
    (
      raw: string,
      start: string,
      content: string,
      end: string,
      index: number
    ) => {
      const { length } = raw
      const name = start.substring(3).trim().split(' ')[0] || 'default'
      data.ignoredByParsers.push({
        name,
        index,
        length: start.length,
        originContent: start,
        meta: `vuepress-${name}-start`
      })
      data.ignoredByParsers.push({
        name,
        index: index + length - 3,
        length: 3,
        originContent: end,
        meta: `vuepress-${name}-end`
      })
      return '@'.repeat(start.length) + '\n' + content + '\n' + '@'.repeat(3)
    }
  )
  return data
}

export default parser
