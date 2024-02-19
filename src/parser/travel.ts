import { MutableGroupToken, GroupToken, MutableToken, Token } from './types.js'

export type Handler = (
  token: MutableToken | Token,
  index: number,
  group: MutableGroupToken | GroupToken
) => void

export const travel = (
  group: MutableGroupToken | GroupToken,
  handler: Handler
): void => {
  for (let i = 0; i < group.length; i++) {
    const token = group[i]
    handler(token, i, group)
    if (Array.isArray(token)) {
      travel(token, handler)
    }
  }
}
