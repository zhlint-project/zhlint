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
  BRACKET_NOSPACE_INSIDE,
  BRACKET_NOSPACE_OUTSIDE,
  BRACKET_SPACE_OUTSIDE,
  MARKDOWN_NOSPACE_INSIDE
} from './messages'
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
          checkSpaceAfter(token, '', BRACKET_NOSPACE_INSIDE)
        }
      } else {
        // no space before
        const tokenBefore = findTokenBefore(group, token)
        if (tokenBefore) {
          checkSpaceAfter(tokenBefore, '', BRACKET_NOSPACE_INSIDE)
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
            tokenSeq.forEach((target) => {
              checkSpaceAfter(target, '', BRACKET_NOSPACE_OUTSIDE)
            })
          }
          if (token.modifiedContent === '(') {
            // content or left half punctuation: oneOutsideBracket
            if (
              isContentType(contentTokenBefore.modifiedType) ||
              contentTokenBefore.type === CharType.PUNCTUATION_HALF
            ) {
              tokenSeq.forEach((target) => {
                if (target === spaceHost) {
                  checkSpaceAfter(
                    spaceHost,
                    oneOutsideBracketOption ? ' ' : '',
                    oneOutsideBracketOption
                      ? BRACKET_SPACE_OUTSIDE
                      : BRACKET_NOSPACE_OUTSIDE
                  )
                } else {
                  checkSpaceAfter(target, '', MARKDOWN_NOSPACE_INSIDE)
                }
              })
            } else {
              tokenSeq.forEach((target) => {
                checkSpaceAfter(target, '', BRACKET_NOSPACE_OUTSIDE)
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
              checkSpaceAfter(target, '', BRACKET_NOSPACE_OUTSIDE)
            })
          }
          if (token.modifiedContent === ')') {
            // content: oneOutsideBracket
            if (isContentType(contentTokenAfter.modifiedType)) {
              tokenSeq.forEach((target) => {
                if (target === spaceHost) {
                  checkSpaceAfter(
                    spaceHost,
                    oneOutsideBracketOption ? ' ' : '',
                    oneOutsideBracketOption
                      ? BRACKET_SPACE_OUTSIDE
                      : BRACKET_NOSPACE_OUTSIDE
                  )
                } else {
                  checkSpaceAfter(target, '', BRACKET_NOSPACE_OUTSIDE)
                }
              })
            } else {
              tokenSeq.forEach((target) => {
                checkSpaceAfter(target, '', BRACKET_NOSPACE_OUTSIDE)
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
