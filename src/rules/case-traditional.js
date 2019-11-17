const replaceMap = {
  '「': '“',
  '『': '‘',
  '』': '’',
  '」': '”',
}

module.exports = (token, index, group, matched, marks) => {
  if (replaceMap[token.content]) {
    token.content = replaceMap[token.content]
  }
  if (token.startChar && replaceMap[token.startChar]) {
    token.startChar = replaceMap[token.startChar]
  }
  if (token.endChar && replaceMap[token.endChar]) {
    token.endChar = replaceMap[token.endChar]
  }
}
