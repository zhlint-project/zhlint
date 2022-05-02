/**
 * @fileoverview
 * 
 * This rule is checking spaces besides brackets.
 * 
 * Options
 * - spaceOutsideBracket: boolean | undefined
 * - noSpaceInsideBracket: boolean | undefined
 */

import {
  CharType,
  Handler,
  isContentType,
  MarkSideType,
  MutableGroupToken,
  MutableToken,
  SingleTokenType
} from '../parser'
import {
  checkSpaceAfter,
  findMarkSeqBetween,
  findNonHyperVisibleTokenAfter,
  findNonHyperVisibleTokenBefore,
  findTokenAfter,
  findTokenBefore,
  Options
} from './util'

export const generateHandler = (options: Options): Handler => {
  const oneOutsideBracketOption = options?.spaceOutsideBracket
  const noInsideBracketOption = options?.noSpaceInsideBracket

  return (token: MutableToken, _: number, group: MutableGroupToken) => {
    // skip non-bracket tokens
    if (token.type !== SingleTokenType.MARK_BRACKETS) {
      return
    }

    // spaces inside
    if (noInsideBracketOption) {
      if (token.markSide === MarkSideType.LEFT) {
        // no space after
        const tokenAfter = findTokenAfter(group, token)
        if (tokenAfter) {
          checkSpaceAfter(token, '', '..')
        }
      } else {
        // no space before
        const tokenBefore = findTokenBefore(group, token)
        if (tokenBefore) {
          checkSpaceAfter(tokenBefore, '', '..')
        }
      }
    }

    // spaces outside
    if (typeof oneOutsideBracketOption !== 'undefined') {
      if (token.markSide === MarkSideType.LEFT) {
        const contentTokenBefore = findNonHyperVisibleTokenBefore(group, token)
        if (contentTokenBefore) {
          const { tokenSeq, spaceHost } = findMarkSeqBetween(
            group,
            contentTokenBefore,
            token
          )
          if (token.modifiedContent === '（') {
            tokenSeq.forEach(target => {
              checkSpaceAfter(target, '', '..')
            })
          }
          if (token.modifiedContent === '(') {
            // content or left half punctuation: oneOutsideBracket
            if (isContentType(contentTokenBefore.modifiedType) || contentTokenBefore.type === CharType.PUNCTUATION_HALF) {
              tokenSeq.forEach(target => {
                if (target === spaceHost) {
                  checkSpaceAfter(
                    spaceHost,
                    oneOutsideBracketOption ? ' ' : '',
                    '..'
                  )
                } else {
                  checkSpaceAfter(target, '', '..')
                }
              })
            } else {
              tokenSeq.forEach(target => {
                checkSpaceAfter(target, '', '..')
              })
            }
          }
        }
      } else {
        const contentTokenAfter = findNonHyperVisibleTokenAfter(group, token)
        if (contentTokenAfter) {
          const { tokenSeq, spaceHost } = findMarkSeqBetween(
            group,
            token,
            contentTokenAfter
          )
          if (token.modifiedContent === '）') {
            tokenSeq.forEach((target) => {
              checkSpaceAfter(target, '', '..')
            })
          }
          if (token.modifiedContent === ')') {
            // content: oneOutsideBracket
            if (
              isContentType(contentTokenAfter.modifiedType)
            ) {
              tokenSeq.forEach((target) => {
                if (target === spaceHost) {
                  checkSpaceAfter(
                    spaceHost,
                    oneOutsideBracketOption ? ' ' : '',
                    '..'
                  )
                } else {
                  checkSpaceAfter(target, '', '..')
                }
              })
            } else {
              tokenSeq.forEach((target) => {
                checkSpaceAfter(target, '', '..')
              })
            }
          }
        }
      }
    }
  }
}

export default generateHandler({
  spaceOutsideBracket: true,
  noSpaceInsideBracket: true
})
