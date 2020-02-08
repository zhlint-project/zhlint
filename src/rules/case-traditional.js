const replaceMap = {
  '「': '“',
  '『': '‘',
  '』': '’',
  '」': '”',
}

module.exports = (token, index, group, matched, marks) => {
  if (token.startContent && replaceMap[token.startContent]) {
    token.startContent = replaceMap[token.startContent]
  }
  if (token.endContent && replaceMap[token.endContent]) {
    token.endContent = replaceMap[token.endContent]
  }
}
