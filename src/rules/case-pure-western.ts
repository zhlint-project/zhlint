/**
 * @fileoverview
 *
 * This rule is resetting all the validations in sentences which are full of
 * western letters and punctuations.
 *
 * Options
 * - skipPureWestern: boolean | undefined
 */

import {
  Handler,
  MutableGroupToken,
  MutableToken,
  GroupTokenType,
  isFullwidthType
} from '../parser/index.js'
import { ValidationTarget } from '../report.js'
import { Options, removeValidationOnTarget } from './util.js'

const findNonWestern = (group: MutableGroupToken): boolean => {
  return group.some((token) => {
    if (token.type === GroupTokenType.GROUP) {
      return findNonWestern(token)
    }
    if (isFullwidthType(token.type)) {
      if (token.value.match(/[‘’“”]/)) {
        return false
      }
      return true
    }
  })
}

const resetValidation = (group: MutableGroupToken): void => {
  group.modifiedSpaceAfter = group.spaceAfter
  group.modifiedInnerSpaceBefore = group.innerSpaceBefore
  group.modifiedStartValue = group.startValue
  group.modifiedEndValue = group.endValue
  group.validations.length = 0
  group.forEach((token) => {
    token.validations.length = 0
    token.modifiedSpaceAfter = token.spaceAfter
    if (token.type === GroupTokenType.GROUP) {
      resetValidation(token)
    } else {
      token.modifiedType = token.type
      token.modifiedValue = token.value
    }
  })
}

const generateHandler = (options: Options): Handler => {
  const skipPureWestern = options?.skipPureWestern

  return (_: MutableToken, index: number, group: MutableGroupToken) => {
    if (!skipPureWestern) {
      return
    }

    if (!group.startValue && index === 0) {
      const hasNonWestern = findNonWestern(group)
      if (!hasNonWestern) {
        resetValidation(group)
      }
    }
  }
}

export const defaultConfig: Options = {
  skipPureWestern: true
}

export default generateHandler
