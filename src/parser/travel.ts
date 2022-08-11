import {
  Handler,
  MutableGroupToken,
  GroupToken
} from './types'

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
