import { GroupToken, Mark, Token, TokenType } from './parse'

export type FilterFunction = (
  token: Token,
  index: number,
  group: GroupToken
) => boolean | RegExpMatchArray | null

export type Filter = FilterFunction | string | RegExp | { type: TokenType }

export type Handler = (
  token: Token,
  index: number,
  group: GroupToken,
  matched: boolean | RegExpMatchArray | null,
  marks: Mark[]
) => void

/**
 * Travel through a group nestedly
 */
const travel = (
  group: GroupToken,
  filter: Filter,
  handler: Handler,
  marks: Mark[]
): void => {
  let normalizedFilter: FilterFunction = () => null
  if (filter instanceof RegExp || typeof filter === 'string') {
    normalizedFilter = (token) => token.content.match(filter)
  } else if (typeof filter === 'object' && filter.type) {
    normalizedFilter = (token) => token.type === filter.type
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
