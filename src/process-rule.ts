import { Filter, Handler, travel, MutableParseResult } from './parser'

type Rule = Handler | { filter: Filter; handler: Handler }

/**
 * Process a single lint rule
 */
const processRule = (data: MutableParseResult, rule: Rule): void => {
  if (!rule) {
    return
  }
  const handler = typeof rule === 'function' ? rule : rule.handler
  const filter = typeof rule === 'function' ? () => true : rule.filter
  if (!handler) {
    return
  }
  travel(data.tokens, filter, handler, data.marks)
}

export default processRule
