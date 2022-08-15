/**
 * @fileoverview
 *
 * This rule will format each punctuation into the right width options.
 *
 * Options:
 * - halfWidthPunctuation: string = `()`
 * - fullWidthPunctuation: string = `，。：；？！“”‘’`
 * - adjustedFullWidthPunctuation: string = `“”‘’`
 *
 * Details:
 * - skip half-width punctuations between half-width content without space
 * - skip successive multiple half-width punctuations
 */

import {
  CharType,
  GroupTokenType,
  Handler,
  isPunctuationType,
  MutableGroupToken,
  MutableToken,
  HyperTokenType
} from '../parser'
import { PUNCTUATION_FULL_WIDTH, PUNCTUATION_HALF_WIDTH } from './messages'
import {
  checkContent,
  checkEndContent,
  checkStartContent,
  isHalfWidthPunctuationWithoutSpaceAround,
  isSuccessiveHalfWidthPunctuation,
  Options
} from './util'

type WidthPairList = Array<[halfWidth: string, fullWidth: string]>
type WidthSidePairList = Array<
  [halfWidth: string, fullWidthLeftSide: string, fullWidthRightSide: string]
>
type AlterMap = Record<string, string>
type AlterPairMap = Record<string, [leftSide: string, rightSide: string]>

const widthPairList: WidthPairList = [
  [`(`, `（`],
  [`)`, `）`],
  [`,`, `，`],
  [`.`, `。`],
  [`;`, `；`],
  [`:`, `：`],
  [`?`, `？`],
  [`!`, `！`]
]
const widthSidePairList: WidthSidePairList = [
  [`"`, `“`, `”`],
  [`'`, `‘`, `’`]
]

const defaultHalfWidthOption = `()`
const defaultFullWidthOption = `，。：；？！“”‘’`
const defaultAdjustedFullWidthOption = `“”‘’`

const checkAdjusted = (
  token: MutableToken,
  adjusted: string
): void => {
  if (adjusted.indexOf(token.modifiedContent) >= 0) {
    token.modifiedType = CharType.PUNCTUATION_HALF
  }
}

const parseOptions = (
  options: Options
): {
  halfWidthMap: AlterMap
  fullWidthMap: AlterMap
  fullWidthPairMap: AlterPairMap
  adjusted: string
} => {
  const halfWidthOption = options?.halfWidthPunctuation || ''
  const fullWidthOption = options?.fullWidthPunctuation || ''
  const adjustedFullWidthOption = options?.adjustedFullWidthPunctuation || ''

  const halfWidthMap: AlterMap = {}
  const fullWidthMap: AlterMap = {}
  const fullWidthPairMap: AlterPairMap = {}

  widthPairList.forEach(([halfWidth, fullWidth]) => {
    if (halfWidthOption.indexOf(halfWidth) >= 0) {
      halfWidthMap[fullWidth] = halfWidth
    }
    if (fullWidthOption.indexOf(fullWidth) >= 0) {
      fullWidthMap[halfWidth] = fullWidth
    }
  })
  widthSidePairList.forEach(([half, left, right]) => {
    if (halfWidthOption.indexOf(half) >= 0) {
      halfWidthMap[left] = half
      halfWidthMap[right] = half
    }
    if (
      fullWidthOption.indexOf(left) >= 0 ||
      fullWidthOption.indexOf(right) >= 0
    ) {
      fullWidthPairMap[half] = [left, right]
    }
  })
  return {
    halfWidthMap,
    fullWidthMap,
    fullWidthPairMap,
    adjusted: adjustedFullWidthOption
  }
}

const generateHandler = (options: Options): Handler => {
  const { halfWidthMap, fullWidthMap, fullWidthPairMap, adjusted } =
    parseOptions(options)

  const handleHyperSpaceOption: Handler = (
    token: MutableToken,
    _,
    group: MutableGroupToken
  ) => {
    // skip non-punctuation/quote/bracket situations
    if (
      !isPunctuationType(token.type) &&
      token.type !== HyperTokenType.HYPER_WRAPPER_BRACKET &&
      token.type !== GroupTokenType.GROUP
    ) {
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

    // 1. normal punctuations in the alter width map
    // 2. brackets in the alter width map
    if (
      isPunctuationType(token.type) ||
      token.type === HyperTokenType.HYPER_WRAPPER_BRACKET
    ) {
      const content = token.modifiedContent
      if (fullWidthMap[content]) {
        checkContent(
          token,
          fullWidthMap[content],
          CharType.PUNCTUATION_FULL,
          PUNCTUATION_FULL_WIDTH
        )
        checkAdjusted(token, adjusted)
      } else if (halfWidthMap[content]) {
        checkContent(
          token,
          halfWidthMap[content],
          CharType.PUNCTUATION_HALF,
          PUNCTUATION_HALF_WIDTH
        )
      }
      return
    }

    // 3. quotes in the alter pair map
    const startContent = (token as MutableGroupToken).modifiedStartContent
    const endContent = (token as MutableGroupToken).modifiedEndContent
    if (fullWidthPairMap[startContent]) {
      checkStartContent(
        token,
        fullWidthPairMap[startContent][0],
        PUNCTUATION_FULL_WIDTH
      )
    } else if (halfWidthMap[startContent]) {
      checkStartContent(
        token,
        halfWidthMap[startContent][0],
        PUNCTUATION_HALF_WIDTH
      )
    }
    if (fullWidthPairMap[endContent]) {
      checkEndContent(
        token,
        fullWidthPairMap[endContent][1],
        PUNCTUATION_FULL_WIDTH
      )
    } else if (halfWidthMap[endContent]) {
      checkEndContent(
        token,
        halfWidthMap[endContent][1],
        PUNCTUATION_HALF_WIDTH
      )
    }
  }
  return handleHyperSpaceOption
}

export const defaultConfig: Options = {
  halfWidthPunctuation: defaultHalfWidthOption,
  fullWidthPunctuation: defaultFullWidthOption,
  adjustedFullWidthPunctuation: defaultAdjustedFullWidthOption
}

export default generateHandler
