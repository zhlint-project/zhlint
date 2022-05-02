/**
 * @fileoverview
 *
 * This rule is checking spaces besides quotes.
 * 
 * Options
 * - spaceOutsideQuote: boolean | undefined
 * - noSpaceInsideQuote: boolean | undefined
 */

import {
  CharType,
  GroupTokenType,
  Handler,
  isPunctuationType,
  MutableGroupToken,
  MutableToken
} from '../parser'
import {
  checkInnerSpaceBefore,
  checkSpaceAfter,
  findMarkSeqBetween,
  findNonHyperVisibleTokenAfter,
  findNonHyperVisibleTokenBefore,
  Options
} from './util'

export const generateHandler = (options: Options): Handler => {
  const oneOutsideQuoteOption = options?.spaceOutsideQuote
  const noInsideQuoteOption = options?.noSpaceInsideQuote

  return (token: MutableToken, _: number, group: MutableGroupToken) => {
    if (token.type !== GroupTokenType.GROUP) {
      return
    }

    if (noInsideQuoteOption) {
      const firstInsdieToken = token[0]
      const lastInsideToken = token[token.length - 1]
      if (firstInsdieToken) {
        checkInnerSpaceBefore(token, '', '..')
      }
      if (lastInsideToken) {
        checkSpaceAfter(lastInsideToken, '', '..')
      }
    }

    if (typeof oneOutsideQuoteOption !== 'undefined') {
      // get before token
      // - if exist, check the width of the quote
      //   - skip hyper content
      //   - skip brackets
      //   - if half-width content/punctuation outside: oneOutsideQuoteOption
      //     x “x”
      //     x "x"
      //     x. "x"
      //     x. “x”
      //   - if full-width content/punctuation outside: no space
      //     中文"x"
      //     中文“x”
      //     x。"x"
      //     x。“x”
      const contentTokenBefore = findNonHyperVisibleTokenBefore(group, token)
      if (contentTokenBefore) {
        if (
          contentTokenBefore.modifiedType === CharType.CONTENT_FULL ||
          contentTokenBefore.modifiedType === CharType.PUNCTUATION_FULL
        ) {
          // on space
          const { tokenSeq } = findMarkSeqBetween(
            group,
            contentTokenBefore,
            token
          )
          tokenSeq.forEach((target) => {
            checkSpaceAfter(target, '', '..')
          })
        }
        if (
          contentTokenBefore.modifiedType === CharType.CONTENT_HALF ||
          contentTokenBefore.modifiedType === CharType.PUNCTUATION_HALF
        ) {
          // oneOutsideQuoteOption
          const { tokenSeq, spaceHost } = findMarkSeqBetween(
            group,
            contentTokenBefore,
            token
          )
          tokenSeq.forEach((target) => {
            if (target === spaceHost) {
              checkSpaceAfter(target, oneOutsideQuoteOption ? ' ' : '', '..')
            } else {
              checkSpaceAfter(target, '', '..')
            }
          })
        }
      }

      // get after token
      // - if exist, check the width of the quote
      //   - skip hyper content
      //   - skip brackets
      //   - if half-width content outside, oneOutsideQuoteOption
      //   - if full-width content or punctuation outside, no space
      const contentTokenAfter = findNonHyperVisibleTokenAfter(group, token)
      if (contentTokenAfter) {
        if (
          contentTokenAfter.modifiedType === CharType.CONTENT_FULL ||
          isPunctuationType(contentTokenAfter.modifiedType)
        ) {
          // on space
          const { tokenSeq } = findMarkSeqBetween(
            group,
            token,
            contentTokenAfter
          )
          tokenSeq.forEach((target) => {
            checkSpaceAfter(target, '', '..')
          })
        }
        if (
          contentTokenAfter.modifiedType === CharType.CONTENT_HALF
        ) {
          // oneOutsideQuoteOption
          const { tokenSeq, spaceHost } = findMarkSeqBetween(
            group,
            token,
            contentTokenAfter
          )
          tokenSeq.forEach((target) => {
            if (target === spaceHost) {
              checkSpaceAfter(target, oneOutsideQuoteOption ? ' ' : '', '..')
            } else {
              checkSpaceAfter(target, '', '..')
            }
          })
        }
      }
    }
  }
}

export default generateHandler({
  spaceOutsideQuote: true,
  noSpaceInsideQuote: true
})
