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
} from '../parser'
import { ValidationTarget } from '../report'
import {
  findMarkSeqBetween,
  findNonHyperVisibleTokenAfter,
  findTokenAfter,
  Options,
  removeValidationOnTarget,
} from './util'

const generateHandler = (options: Options): Handler => {
  options

  return (token: MutableToken, _: number, group: MutableGroupToken) => {
    // skip non-& tokens
    if (token.content !== '&') {
      return
    }

    // skip non-half-width-content tokens
    const tokenAfter = findTokenAfter(group, token)
    if (
      !tokenAfter ||
      tokenAfter.type !== CharType.LETTERS_HALF ||
      token.spaceAfter
    ) {
      return
    }

    // skip non-semicolon tokens
    const thirdToken = findTokenAfter(group, tokenAfter)
    if (!thirdToken || thirdToken.content !== ';' || tokenAfter.spaceAfter) {
      return
    }

    // revert &
    token.modifiedContent = token.content
    token.modifiedType = token.type
    token.modifiedSpaceAfter = token.spaceAfter
    removeValidationOnTarget(token, ValidationTarget.CONTENT)
    removeValidationOnTarget(token, ValidationTarget.SPACE_AFTER)

    // revert half-width content
    tokenAfter.modifiedContent = tokenAfter.content
    tokenAfter.modifiedType = tokenAfter.type
    tokenAfter.modifiedSpaceAfter = tokenAfter.spaceAfter
    removeValidationOnTarget(tokenAfter, ValidationTarget.CONTENT)
    removeValidationOnTarget(tokenAfter, ValidationTarget.SPACE_AFTER)

    // revert ;
    thirdToken.modifiedContent = thirdToken.content
    thirdToken.modifiedType = thirdToken.type
    removeValidationOnTarget(thirdToken, ValidationTarget.CONTENT)
    removeValidationOnTarget(thirdToken, ValidationTarget.SPACE_AFTER)

    const nextToken = findNonHyperVisibleTokenAfter(group, thirdToken)
    if (nextToken) {
      const { spaceHost } = findMarkSeqBetween(group, thirdToken, nextToken)
      if (spaceHost) {
        spaceHost.modifiedSpaceAfter = spaceHost.spaceAfter
        removeValidationOnTarget(spaceHost, ValidationTarget.SPACE_AFTER)
      }
    }
  }
}

export const defaultConfig: Options = {
}

export default generateHandler
