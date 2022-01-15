import { Data } from './types'

// {% x y %}z{% endx %}
// \{\% ([^ ]+?) [^\%]*?\%\}    ([^ ]+?)        [^\%]*?
// (?:\n|\{(?!\%)|[^\{])*?      \n              \{(?!\%)        [^\{]
// \{\% end(?:\1) \%\}
const matcher = /\{% ([^ ]+?) [^%]*?%\}(?:\n|\{(?!%)|[^{])*?\{% end(?:\1) %\}/g

const parser = (data: Data): Data => {
  data.content = data.content.replace(matcher, (raw, name, index) => {
    const { length } = raw
    data.ignoredByParsers.push({
      name,
      index,
      length,
      raw,
      meta: `hexo-${name}`
    })
    return '@'.repeat(length)
  })
  return data
}

export default parser
