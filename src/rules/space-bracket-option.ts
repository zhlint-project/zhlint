/**
 * @fileoverview
 * 
 * This rule is checking spaces besides brackets.
 * 
 * Options
 * - space.oneOutsideBracket: boolean | undefined
 * - space.noInsideBracket: boolean | undefined
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
  findMarkSeqBetween,
  findNonHyperVisibleTokenAfter,
  findNonHyperVisibleTokenBefore,
  findTokenAfter,
  findTokenBefore,
  Options
} from './util'

export const generateHandler = (options: Options): Handler => {
  const oneOutsideBracketOption = options?.space?.oneOutsideBracket
  const noInsideBracketOption = options?.space?.noInsideBracket

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
          token.modifiedSpaceAfter = ''
        }
      } else {
        // no space before
        const tokenBefore = findTokenBefore(group, token)
        if (tokenBefore) {
          tokenBefore.modifiedSpaceAfter = ''
        }
      }
    }

    // spaces outside
    if (oneOutsideBracketOption) {
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
              target.modifiedSpaceAfter = ''
            })
          }
          if (token.modifiedContent === '(') {
            // content or left half punctuation: oneOutsideBracket
            if (isContentType(contentTokenBefore.modifiedType) || contentTokenBefore.type === CharType.PUNCTUATION_HALF) {
              tokenSeq.forEach(target => {
                if (target === spaceHost) {
                  spaceHost.modifiedSpaceAfter = oneOutsideBracketOption
                    ? ' '
                    : ''
                } else {
                  target.modifiedSpaceAfter = ''
                }
              })
            } else {
              tokenSeq.forEach(target => {
                target.modifiedSpaceAfter = ''
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
              target.modifiedSpaceAfter = ''
            })
          }
          if (token.modifiedContent === ')') {
            // content: oneOutsideBracket
            if (
              isContentType(contentTokenAfter.modifiedType)
            ) {
              tokenSeq.forEach((target) => {
                if (target === spaceHost) {
                  spaceHost.modifiedSpaceAfter = oneOutsideBracketOption
                    ? ' '
                    : ''
                } else {
                  target.modifiedSpaceAfter = ''
                }
              })
            } else {
              tokenSeq.forEach((target) => {
                target.modifiedSpaceAfter = ''
              })
            }
          }
        }
      }
    }
  }
}

export default generateHandler({
  space: {
    oneOutsideBracket: true,
    noInsideBracket: true
  }
})
