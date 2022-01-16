import { Data } from './types'

// {% x y %}z{% endx %}
// \{\% ([^ ]+?) [^\%]*?\%\}    ([^ ]+?)        [^\%]*?
// (?:\n|\{(?!\%)|[^\{])*?      \n              \{(?!\%)        [^\{]
// \{\% end(?:\1) \%\}
const matcher = /\{% ([^ ]+?) [^%]*?%\}(?:\n|\{(?!%)|[^{])*?\{% end(?:\1) %\}/g

const parser = (data: Data): Data => {
  data.modifiedContent = data.modifiedContent.replace(
    matcher,
    (raw, name, index) => {
      const { length } = raw
      data.ignoredByParsers.push({
        name,
        meta: `hexo-${name}`,
        index,
        length,
        originContent: raw
      })
      return '@'.repeat(length)
    }
  )
  return data
}

export default parser
