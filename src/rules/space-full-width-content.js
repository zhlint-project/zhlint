// todo:
// - nextToken -> nextNonHyperMarkToken
// - if content width different
//   - if there is a mark
//     - add a space outside mark
//   - else
//     - add a space between
// examples:
// - *a*啊 -> *a*啊 -> *a* 啊
// - *a* 啊 -> *a* 啊
// - *a *啊 -> *a* 啊
// - a*啊* -> a*啊* -> a *啊*
// - a *啊* -> a *啊*
// - a* 啊* -> a *啊*
// - *啊*a -> *啊*a -> *啊* a
// - *啊* a -> *啊* a
// - *啊 *a -> *啊* a
// - 啊*a* -> 啊*a* -> 啊 *a*
// - 啊 *a* -> 啊 *a*
// - 啊* a* -> 啊 *a*

module.exports = (token, index, group, matched, marks) => {
  // token is content
  // next token exists and is content too
  // one is half-width another is full-width
  // !token.spaceAfter or token.spaceAfter.length > 1
  if (!token.type.match(/^content\-/)) {
    return
  }
  const nextToken = group[index + 1]
  if (!nextToken) {
    return
  }
  if (!nextToken.type.match(/^content\-/)) {
    return
  }
  if (nextToken.type === token.type) {
    return
  }
  token.spaceAfter = ' '
}
