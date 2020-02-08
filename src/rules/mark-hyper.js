// space besides hyper mark:
// add 1 space outside the most outside mark if there is any space besides mark or mark group

const {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findContentTokenAfter
} = require('./util')

const findMarkSeq = (group, token, seq) => {
  const tokenBefore = findTokenBefore(group, token)
  const tokenAfter = findTokenAfter(group, token)
  if (seq.indexOf(tokenBefore) < 0 && tokenBefore.type === 'mark-hyper') {
    seq.unshift(tokenBefore)
    findMarkSeq(group, tokenBefore, seq)
  }
  if (seq.indexOf(tokenAfter) < 0 && tokenAfter.type === 'mark-hyper') {
    seq.push(tokenAfter)
    findMarkSeq(group, tokenAfter, seq)
  }
}

module.exports = (token, index, group, matched, marks) => {
  if (token.type === 'mark-hyper') {
    const markSeq = [token]
    findMarkSeq(group, token, markSeq)

    const hasSpace = markSeq.some(markToken => markToken.spaceAfter) || (findTokenBefore(group, markSeq[0]) || {}).spaceAfter

    const tokenBefore = findTokenBefore(group, token)
    const tokenAfter = findTokenAfter(group, token)
    if (token.markSide === 'left') {
      if (tokenBefore) {
        tokenBefore.spaceAfter = (hasSpace && token === markSeq[0]) ? ' ' : ''
      }
      if (tokenAfter) {
        token.spaceAfter = ''
      }
    }
    else if (token.markSide === 'right') {
      if (tokenBefore) {
        tokenBefore.spaceAfter = ''
      }
      if (tokenAfter) {
        token.spaceAfter = (hasSpace && token === markSeq[markSeq.length - 1]) ? ' ' : ''
      }
    }
  }
}
