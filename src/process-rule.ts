import { GroupToken, Mark, Filter, Handler } from './parser/types'
import { travel } from './parser/travel'

type Data = {
  tokens: GroupToken
  groups: GroupToken[]
  marks: Mark[]
}

type Rule = Handler | { filter: Filter; handler: Handler }

/**
 * Process a single lint rule
 */
const processRule = (data: Data, rule: Rule): void => {
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
