// {% x y %}z{% endx %}
// \{\% ([^ ]+?) [^\%]+?\%\}    ([^ ]+?)        [^\%]*?
// (?:\n|\{(?!\%)|[^\{])*?      \n              \{(?!\%)        [^\{]
// \{\% end(?:\1) \%\}
const matcher = /\{\% ([^ ]+?) [^\%]*?\%\}(?:\n|\{(?!\%)|[^\{])*?\{\% end(?:\1) \%\}/g

module.exports = data => {
  data.content = data.content.replace(matcher, (raw, name, index ) => {
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
