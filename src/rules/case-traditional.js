const replaceMap = {
  '「': '“',
  '『': '‘',
  '』': '’',
  '」': '”',
}

module.exports = (token, index, group, matched, marks) => {
  if (token.startChar && replaceMap[token.startChar]) {
    token.startChar = replaceMap[token.startChar]
  }
  if (token.endChar && replaceMap[token.endChar]) {
    token.endChar = replaceMap[token.endChar]
  }
}
