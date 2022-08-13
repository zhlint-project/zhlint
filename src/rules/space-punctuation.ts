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
 *   content/right-quote/right-bracket/code x punctuation
 * - spaceAfterHalfWidthPunctuation:
 *   half x content/left-quote/left-bracket/code
 * - noSpaceAfterFullWidthPunctuation:
 *   full x content/left-quote/left-bracket/code
 *
 * - skip half-width punctuations between half-width content without space
 * - skip successive multiple half-width punctuations
 */

import {
  CharType,
  GroupTokenType,
  Handler,
  isLettersType,
  isPunctuationType,
  MarkSideType,
  MutableGroupToken,
  MutableToken,
  HyperTokenType
} from '../parser'
import {
  checkSpaceAfter,
  findVisibleTokenAfter,
  findVisibleTokenBefore,
  findWrappersBetween,
  isHalfWidthPunctuationWithoutSpaceAround,
  isSuccessiveHalfWidthPunctuation,
  Options
} from './util'
import {
  PUNCTUATION_NOSPACE_AFTER,
  PUNCTUATION_NOSPACE_BEFORE,
  PUNCTUATION_SPACE_AFTER
} from './messages'

const normalPunctuationList = `,.;:?!，、。；：？！`.split('')
const isNormalPunctuation = (char: string): boolean =>
  normalPunctuationList.indexOf(char) >= 0

const generateHandler = (options: Options): Handler => {
  const noBeforePunctuationOption = options?.noSpaceBeforePunctuation
  const oneAfterHalfWidthPunctuationOption =
    options?.spaceAfterHalfWidthPunctuation
  const noAfterFullWidthPunctuationOption =
    options?.noSpaceAfterFullWidthPunctuation

  return (token: MutableToken, _: number, group: MutableGroupToken) => {
    // skip non-punctuation tokens and non-normal punctuations
    if (!isPunctuationType(token.type)) {
      return
    }
    if (!isNormalPunctuation(token.content)) {
      return
    }

    // skip half-width punctuations between half-width content without space
    if (isHalfWidthPunctuationWithoutSpaceAround(group, token)) {
      return
    }

    // skip successive multiple half-width punctuations
    if (isSuccessiveHalfWidthPunctuation(group, token)) {
      return
    }

    // 1. content/right-quote/right-bracket/code x punctuation
    if (noBeforePunctuationOption) {
      const contentTokenBefore = findVisibleTokenBefore(group, token)
      if (
        contentTokenBefore &&
        // content
        (isLettersType(contentTokenBefore.type) ||
          // right-quote
          contentTokenBefore.type === GroupTokenType.GROUP ||
          // right-bracket
          (contentTokenBefore.type === HyperTokenType.HYPER_WRAPPER_BRACKET &&
            contentTokenBefore.markSide === MarkSideType.RIGHT) ||
          // code
          contentTokenBefore.type === HyperTokenType.HYPER_CONTENT_CODE)
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

    // 2. half/full x content/left-quote/left-bracket/code
    if (
      (token.modifiedType === CharType.PUNCTUATION_FULL &&
        noAfterFullWidthPunctuationOption) ||
      (token.modifiedType === CharType.PUNCTUATION_HALF &&
        oneAfterHalfWidthPunctuationOption)
    ) {
      const spaceAfter =
        token.modifiedType === CharType.PUNCTUATION_HALF ? ' ' : ''
      const message =
        token.modifiedType === CharType.PUNCTUATION_HALF
          ? PUNCTUATION_SPACE_AFTER
          : PUNCTUATION_NOSPACE_AFTER

      const contentTokenAfter = findVisibleTokenAfter(group, token)
      if (
        contentTokenAfter &&
        // content
        (isLettersType(contentTokenAfter.type) ||
          // left-quote
          contentTokenAfter.type === GroupTokenType.GROUP ||
          // left-bracket
          (contentTokenAfter.type === HyperTokenType.HYPER_WRAPPER_BRACKET &&
            contentTokenAfter.markSide === MarkSideType.LEFT) ||
          // code
          contentTokenAfter.type === HyperTokenType.HYPER_CONTENT_CODE)
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
