/**
 * Travel through a group nestedly
 * @param  {Group}                                         group
 * @param  {function | string | RegExp | { type: stirng }} filter
 * @param  {function(token, index, group, matched, marks)} handler
 * @param  {Array<Mark>}                                   marks
 */
const travel = (group, filter, handler, marks) => {
  // TODO: any
  let normalizedFilter: any = () => false
  if (typeof filter === 'object' && filter.type) {
    normalizedFilter = (token) => token.type === filter.type
  } else if (filter instanceof RegExp || typeof filter === 'string') {
    normalizedFilter = (token) => token.content.match(filter)
  } else if (typeof filter === 'function') {
    normalizedFilter = (token, i, group) => filter(token, i, group)
  }
  for (let i = 0; i < group.length; i++) {
    const token = group[i]
    const matched = normalizedFilter(token, i, group)
    if (matched) {
      handler(token, i, group, matched, marks)
    }
    if (Array.isArray(token)) {
      travel(token, filter, handler, marks)
    }
  }
}

export default travel
