const matcher = /\{\% ([^ ]+) *.+\%\}(?:\n|\{[^\%]|[^\{])*\{\% end(?:\1) \%\}/g

module.exports = str => {
  const marks = []
  const result = str.replace(matcher, (raw, name, index ) => {
      const { length } = raw
      marks.push({ name, index, length, raw })
      return '@'.repeat(length)
  })
  return { result, raw: str, marks }
}
