module.exports = (token, index, group, matched, marks) => {
  if (token.rawSpaceAfter && token.rawSpaceAfter.match(/\n/)) {
    token.spaceAfter = token.rawSpaceAfter
  }
}
