import { ParsedStatus } from './types.js'

// {% x y %}z{% endx %}
// \{\% ([^ ]+?) [^\%]*?\%\}    ([^ ]+?)        [^\%]*?
// (?:\n|\{(?!\%)|[^\{])*?      \n              \{(?!\%)        [^\{]
// \{\% end(?:\1) \%\}
const matcher = /\{% ([^ ]+?) [^%]*?%\}(?:\n|\{(?!%)|[^{])*?\{% end(?:\1) %\}/g

const parser = (data: ParsedStatus): ParsedStatus => {
  data.modifiedValue = data.modifiedValue.replace(
    matcher,
    (raw, name, index) => {
      const { length } = raw
      data.ignoredByParsers.push({
        name,
        meta: `hexo-${name}`,
        index,
        length,
        originValue: raw
      })
      return '@'.repeat(length)
    }
  )
  return data
}

export default parser
