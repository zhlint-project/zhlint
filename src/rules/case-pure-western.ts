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
  group.forEach((token) => {
    for (const target in ValidationTarget) {
      removeValidationOnTarget(token, target as ValidationTarget)
    }
    token.modifiedSpaceAfter = token.spaceAfter
    token.modifiedType = token.type
    token.modifiedValue = token.value
    if (token.type === GroupTokenType.GROUP) {
      token.modifiedInnerSpaceBefore = token.innerSpaceBefore
      resetValidation(token)
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
