// utils
const findTokenBefore = (group, token) => {
  const index = group.indexOf(token)
  if (index < 0) {
    return
  }
  return group[index - 1]
}
const findTokenAfter = (group, token) => {
  const index = group.indexOf(token)
  if (index < 0) {
    return
  }
  return group[index + 1]
}
const findContentTokenBefore = (group, token) => {
  const index = group.indexOf(token)
  if (index < 0) {
    return
  }
  const tokenBefore = findTokenBefore(group, token)
  if (!tokenBefore) {
    return
  }
  if (tokenBefore.type.match(/^content\-/)) {
    return tokenBefore
  } else if (tokenBefore.type === 'mark-hyper') {
    return findContentTokenBefore(group, group[index - 1])
  }
  return 
}
const findContentTokenAfter = (group, token) => {
  const index = group.indexOf(token)
  if (index < 0) {
    return
  }
  const tokenAfter = findTokenAfter(group, token)
  if (!tokenAfter) {
    return
  }
  if (tokenAfter.type.match(/^content\-/)) {
    return tokenAfter
  } else if (tokenAfter.type === 'mark-hyper') {
    return findContentTokenBefore(group, group[index + 1])
  }
}
const spreadMarkSeq = (group, token, seq) => {
  const tokenBefore = findTokenBefore(group, token)
  const tokenAfter = findTokenAfter(group, token)
  if (tokenBefore && seq.indexOf(tokenBefore) < 0 && tokenBefore.type === 'mark-hyper') {
    seq.unshift(tokenBefore)
    findMarkSeq(group, tokenBefore, seq)
  }
  if (tokenAfter && seq.indexOf(tokenAfter) < 0 && tokenAfter.type === 'mark-hyper') {
    seq.push(tokenAfter)
    findMarkSeq(group, tokenAfter, seq)
  }
}
const findMarkSeq = (group, token) => {
  const seq = [token]
  spreadMarkSeq(group, token, seq)
  return seq
}

module.exports = {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findContentTokenAfter,
  findMarkSeq
}
