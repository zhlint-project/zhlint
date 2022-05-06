/**
 * @fileoverview
 *
 * This rule is triming spaces of the whole string
 *
 * Options
 * - trimSpace: boolean | undefined
 */

import {
  Handler,
  MutableGroupToken,
  MutableToken
} from '../parser'
import { TRIM_SPACE } from './messages'
import {
  checkInnerSpaceBefore,
  checkSpaceAfter,
  Options
} from './util'

const generateHandler = (options: Options): Handler => {
  const trimSpaceOption = options?.trimSpace

  return (_: MutableToken, index: number, group: MutableGroupToken) => {
    if (!trimSpaceOption) {
      return
    }

    // make sure it's the whole string
    // - innerSpaceBefore of the group
    // - spaceAfter of the last token
    if (!group.startContent && index === 0) {
      if (group.modifiedInnerSpaceBefore) {
        checkInnerSpaceBefore(group, '', TRIM_SPACE)
      }
      const lastToken = group[group.length - 1]
      if (lastToken) {
        checkSpaceAfter(lastToken, '', TRIM_SPACE)
      }
    }
  }
}

export const defaultConfig: Options = {
  trimSpace: true
}

export default generateHandler

