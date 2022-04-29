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
 */

import {
  CharType,
  Handler,
  isContentType,
  isPunctuationType,
  MutableGroupToken,
  MutableToken
} from '../parser'
import {
  findExpectedVisibleTokenAfter,
  findExpectedVisibleTokenBefore,
  findMarkSeqBetween,
  Options
} from './util'

const normalPunctuationList = `,.;:?!，。；：？！`.split('')
const isNormalPunctuation = (char: string): boolean =>
  normalPunctuationList.indexOf(char) >= 0

export const generateHandler = (options: Options): Handler => {
  const noBeforePunctuationOption = options?.noSpaceBeforePunctuation
  const oneAfterHalfWidthPunctuationOption =
    options?.spaceAfterHalfWidthPunctuation
  const noAfterFullWidthPunctuationOption =
    options?.noSpaceAfterFullWidthPunctuation

  return (token: MutableToken, index: number, group: MutableGroupToken) => {
    // skip non-punctuation tokens and find normal punctuations
    if (!isPunctuationType(token.type)) {
      return
    }
    if (!isNormalPunctuation(token.content)) {
      return
    }

    // deal with the content token before
    if (noBeforePunctuationOption) {
      const contentTokenBefore = findExpectedVisibleTokenBefore(group, token)
      if (contentTokenBefore && isContentType(contentTokenBefore.type)) {
        const { spaceHost, tokenSeq } = findMarkSeqBetween(
          group,
          contentTokenBefore,
          token
        )

        // no space
        if (spaceHost) {
          spaceHost.modifiedSpaceAfter = ''
        }
        tokenSeq.forEach((target) => {
          if (target !== token) {
            target.modifiedSpaceAfter = ''
          }
        })
      }
    }

    // deal with the content token after
    if (
      (token.type === CharType.PUNCTUATION_FULL &&
        noAfterFullWidthPunctuationOption) ||
      (token.type === CharType.PUNCTUATION_HALF &&
        oneAfterHalfWidthPunctuationOption)
    ) {
      const contentTokenAfter = findExpectedVisibleTokenAfter(group, token)
      if (contentTokenAfter && isContentType(contentTokenAfter.type)) {
        const { spaceHost, tokenSeq } = findMarkSeqBetween(
          group,
          token,
          contentTokenAfter
        )

        // check the space after
        if (spaceHost) {
          spaceHost.modifiedSpaceAfter =
            token.type === CharType.PUNCTUATION_HALF ? ' ' : ''
        }
        tokenSeq.forEach((target) => {
          if (target !== spaceHost && target !== contentTokenAfter) {
            target.modifiedSpaceAfter = ''
          }
        })
      }
    }
  }
}

export default generateHandler({
  noSpaceBeforePunctuation: true,
  spaceAfterHalfWidthPunctuation: true,
  noSpaceAfterFullWidthPunctuation: true
})
