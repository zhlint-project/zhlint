/**
 * @fileoverview
 * 
 * This rule only check whether there always is a space between half-width content.
 * Ideally, the modification logic inside this rule won't be triggered.
 */

import { MutableToken, MutableGroupToken, CharType, Handler } from '../parser'
import { findNonHyperVisibleTokenAfter } from './util'

export const generateHandler = (): Handler => {
  return (token: MutableToken, _: number, group: MutableGroupToken) => {
    if (token.type !== CharType.CONTENT_HALF) {
      return
    }
    const contentAfter = findNonHyperVisibleTokenAfter(group, token)
    if (contentAfter && contentAfter.type === CharType.CONTENT_HALF) {
      if (token.modifiedSpaceAfter !== ' ') {
        token.modifiedSpaceAfter = ' '
      }
    }
  }
}

export default generateHandler()
