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
} from '../parser'
import { ValidationTarget } from '../report'
import {
  Options, removeValidationOnTarget
} from './util'

const findNonWestern = (group: MutableGroupToken): boolean => {
  return group.some(token => {
    if (token.type === GroupTokenType.GROUP) {
      return findNonWestern(token)
    }
    if (isFullwidthType(token.type)) {
      return true
    }
  })
}

const resetValidation = (group: MutableGroupToken): void => {
  group.forEach(token => {
    for (const target in ValidationTarget) {
      removeValidationOnTarget(token, target as ValidationTarget)
    }
    if (token.type === GroupTokenType.GROUP) {
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
