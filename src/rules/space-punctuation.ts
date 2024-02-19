/**
 * @fileoverview
 *
 * This rule is checking spaces besides normal punctuations.
 * Usually, for full-width punctuations, we don't need any spaces around.
 * For half-width punctuations, we need a space after that.
 *
 * Options
 * - noSpaceBeforePunctuation: boolean | undefined
 *   - `true`: remove spaces before a half-width punctuation (default)
 *   - `false` or `undefined`: do nothing, just keep the original format
 * - spaceAfterHalfWidthPunctuation: boolean | undefined
 *   - `true`: ensure one space after a half-width punctuation (default)
 *   - `false` or `undefined`: do nothing, just keep the original format
 * - noSpaceAfterFullWidthPunctuation: boolean | undefined
 *   - `true`: remove spaces around a full-width punctuation (default)
 *   - `false` or `undefined`: do nothing, just keep the original format
 *
 * Details:
 * - noSpaceBeforePunctuation:
 *   content/right-quotation/right-bracket/code x punctuation
 * - spaceAfterHalfWidthPunctuation:
 *   half x content/left-quotation/left-bracket/code
 * - noSpaceAfterFullWidthPunctuation:
 *   full x content/left-quotation/left-bracket/code
 *
 * - skip half-width punctuations between half-width content without space
 * - skip successive multiple half-width punctuations
 */

import {
  GroupTokenType,
  Handler,
  isLetterType,
  isPauseOrStopType,
  MarkSideType,
  MutableGroupToken,
  MutableToken,
  HyperTokenType,
  isFullwidthPunctuationType,
  isHalfwidthPunctuationType
} from '../parser/index.js'
import {
  checkSpaceAfter,
  findVisibleTokenAfter,
  findVisibleTokenBefore,
  findWrappersBetween,
  isHalfwidthPunctuationWithoutSpaceAround,
  isSuccessiveHalfwidthPunctuation,
  Options
} from './util.js'
import {
  PUNCTUATION_NOSPACE_AFTER,
  PUNCTUATION_NOSPACE_BEFORE,
  PUNCTUATION_SPACE_AFTER
} from './messages.js'

const generateHandler = (options: Options): Handler => {
  const noBeforePunctuationOption = options?.noSpaceBeforePauseOrStop
  const oneAfterHalfWidthPunctuationOption =
    options?.spaceAfterHalfwidthPauseOrStop
  const noAfterFullWidthPunctuationOption =
    options?.noSpaceAfterFullwidthPauseOrStop

  return (token: MutableToken, _: number, group: MutableGroupToken) => {
    // skip non-punctuation tokens and non-normal punctuations
    if (!isPauseOrStopType(token.type)) {
      return
    }

    // skip half-width punctuations between half-width content without space
    if (isHalfwidthPunctuationWithoutSpaceAround(group, token)) {
      return
    }

    // skip successive multiple half-width punctuations
    if (isSuccessiveHalfwidthPunctuation(group, token)) {
      return
    }

    // 1. content/right-quotation/right-bracket/code x punctuation
    if (noBeforePunctuationOption) {
      const contentTokenBefore = findVisibleTokenBefore(group, token)
      if (
        contentTokenBefore &&
        // content
        (isLetterType(contentTokenBefore.type) ||
          // right-quotation
          contentTokenBefore.type === GroupTokenType.GROUP ||
          // right-bracket
          (contentTokenBefore.type === HyperTokenType.BRACKET_MARK &&
            contentTokenBefore.markSide === MarkSideType.RIGHT) ||
          // code
          contentTokenBefore.type === HyperTokenType.CODE_CONTENT)
      ) {
        const { spaceHost } = findWrappersBetween(
          group,
          contentTokenBefore,
          token
        )

        if (spaceHost) {
          checkSpaceAfter(spaceHost, '', PUNCTUATION_NOSPACE_BEFORE)
        }
      }
    }

    // 2. half/full x content/left-quotation/left-bracket/code
    if (
      (isFullwidthPunctuationType(token.modifiedType) &&
        noAfterFullWidthPunctuationOption) ||
      (isHalfwidthPunctuationType(token.modifiedType) &&
        oneAfterHalfWidthPunctuationOption)
    ) {
      const spaceAfter = isHalfwidthPunctuationType(token.modifiedType)
        ? ' '
        : ''
      const message = isHalfwidthPunctuationType(token.modifiedType)
        ? PUNCTUATION_SPACE_AFTER
        : PUNCTUATION_NOSPACE_AFTER

      const contentTokenAfter = findVisibleTokenAfter(group, token)
      if (
        contentTokenAfter &&
        // content
        (isLetterType(contentTokenAfter.type) ||
          // left-quotation
          contentTokenAfter.type === GroupTokenType.GROUP ||
          // left-bracket
          (contentTokenAfter.type === HyperTokenType.BRACKET_MARK &&
            contentTokenAfter.markSide === MarkSideType.LEFT) ||
          // code
          contentTokenAfter.type === HyperTokenType.CODE_CONTENT)
      ) {
        const { spaceHost } = findWrappersBetween(
          group,
          token,
          contentTokenAfter
        )

        if (spaceHost) {
          checkSpaceAfter(spaceHost, spaceAfter, message)
        }
      }
    }
  }
}

export const defaultConfig: Options = {
  noSpaceBeforePunctuation: true,
  spaceAfterHalfWidthPunctuation: true,
  noSpaceAfterFullWidthPunctuation: true
}

export default generateHandler
