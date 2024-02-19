/**
 * @fileoverview
 *
 * This rule is used to revert changes of HTML entities.
 *
 * Details:
 * - to match `&<half-width-content>;`
 */

import {
  CharType,
  Handler,
  MutableGroupToken,
  MutableToken
} from '../parser/index.js'
import { ValidationTarget } from '../report.js'
import {
  findWrappersBetween,
  findNonCodeVisibleTokenAfter,
  findTokenAfter,
  Options,
  removeValidationOnTarget
} from './util.js'

const generateHandler = (options: Options): Handler => {
  options

  return (token: MutableToken, _: number, group: MutableGroupToken) => {
    // skip non-& tokens
    if (token.value !== '&') {
      return
    }

    // skip non-half-width-content tokens
    const tokenAfter = findTokenAfter(group, token)
    if (
      !tokenAfter ||
      tokenAfter.type !== CharType.WESTERN_LETTER ||
      token.spaceAfter
    ) {
      return
    }

    // skip non-semicolon tokens
    const thirdToken = findTokenAfter(group, tokenAfter)
    if (!thirdToken || thirdToken.value !== ';' || tokenAfter.spaceAfter) {
      return
    }

    // revert &
    token.modifiedValue = token.value
    token.modifiedType = token.type
    token.modifiedSpaceAfter = token.spaceAfter
    removeValidationOnTarget(token, ValidationTarget.VALUE)
    removeValidationOnTarget(token, ValidationTarget.SPACE_AFTER)

    // revert half-width content
    tokenAfter.modifiedValue = tokenAfter.value
    tokenAfter.modifiedType = tokenAfter.type
    tokenAfter.modifiedSpaceAfter = tokenAfter.spaceAfter
    removeValidationOnTarget(tokenAfter, ValidationTarget.VALUE)
    removeValidationOnTarget(tokenAfter, ValidationTarget.SPACE_AFTER)

    // revert ;
    thirdToken.modifiedValue = thirdToken.value
    thirdToken.modifiedType = thirdToken.type
    removeValidationOnTarget(thirdToken, ValidationTarget.VALUE)
    removeValidationOnTarget(thirdToken, ValidationTarget.SPACE_AFTER)

    const nextToken = findNonCodeVisibleTokenAfter(group, thirdToken)
    if (nextToken) {
      const { spaceHost } = findWrappersBetween(group, thirdToken, nextToken)
      if (spaceHost) {
        spaceHost.modifiedSpaceAfter = spaceHost.spaceAfter
        removeValidationOnTarget(spaceHost, ValidationTarget.SPACE_AFTER)
      }
    }
  }
}

export const defaultConfig: Options = {}

export default generateHandler
