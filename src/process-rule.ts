const travel = require('./travel')

/**
 * Process a single lint rule
 * @param  {{ tokens, groups, marks }}      data
 * @param  {function | { filter, handler }} rule
 */
const processRule = (data, rule) => {
  if (!rule) {
    return data
  }
  const handler = typeof rule === 'function' ? rule : rule.handler
  const filter = typeof rule === 'function' ? () => true : rule.filter
  if (!handler) {
    return data
  }
  travel(data.tokens, filter, handler, data.marks)
}

module.exports = processRule
