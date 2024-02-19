/**
 * @fileoverview
 *
 * This rule is triming spaces of the whole string.
 *
 * Options
 * - trimSpace: boolean | undefined
 */

import { Handler, MutableGroupToken, MutableToken } from '../parser/index.js'
import { TRIM_SPACE } from './messages.js'
import {
  checkInnerSpaceBefore,
  checkSpaceAfter,
  findVisibleTokenBefore,
  findConnectedWrappers,
  isWrapper,
  Options
} from './util.js'

const generateHandler = (options: Options): Handler => {
  const trimSpaceOption = options?.trimSpace

  return (token: MutableToken, index: number, group: MutableGroupToken) => {
    if (!trimSpaceOption) {
      return
    }

    // make sure it's the whole string
    if (!group.startValue && index === 0) {
      // remove inner space before
      if (group.modifiedInnerSpaceBefore) {
        checkInnerSpaceBefore(group, '', TRIM_SPACE)
      }

      // remove all spaces after beginning marks
      if (isWrapper(token)) {
        findConnectedWrappers(group, token).forEach((x) =>
          checkSpaceAfter(x, '', TRIM_SPACE)
        )
      }

      // get last visible content token -> remove all spaces after
      const lastToken = group[group.length - 1]
      if (lastToken) {
        // 1. last token is a mark -> find last visible content token
        // 2. last token is visible content
        if (isWrapper(lastToken)) {
          const lastContentToken = findVisibleTokenBefore(group, token)
          if (lastContentToken) {
            findConnectedWrappers(group, lastToken).forEach((x) =>
              checkSpaceAfter(x, '', TRIM_SPACE)
            )
            checkSpaceAfter(lastContentToken, '', TRIM_SPACE)
          }
        } else {
          checkSpaceAfter(lastToken, '', TRIM_SPACE)
        }
      }
    }
  }
}

export const defaultConfig: Options = {
  trimSpace: true
}

export default generateHandler
