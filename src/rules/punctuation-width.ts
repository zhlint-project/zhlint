/**
 * @fileoverview
 *
 * This rule will format each punctuation into the right width options.
 *
 * Options:
 * - halfwidthPunctuation: string = `()`
 * - fullwidthPunctuation: string = `，。：；？！“”‘’`
 * - adjustedFullwidthPunctuation: string = `“”‘’`
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
  isHalfwidthPunctuationWithoutSpaceAround,
  isSuccessiveHalfwidthPunctuation,
  Options
} from './util'

type WidthPairList = Array<[halfwidth: string, fullwidth: string]>
type WidthSidePairList = Array<
  [halfwidth: string, fullwidthLeftSide: string, fullwidthRightSide: string]
>
type AlterMap = Record<string, string>
type AlterPairMap = Record<string, [leftSide: string, rightSide: string]>

const widthPairList: WidthPairList = [
  [`,`, `，`],
  [`.`, `。`],
  [`;`, `；`],
  [`:`, `：`],
  [`?`, `？`],
  [`!`, `！`],
  [`(`, `（`],
  [`)`, `）`],
  [`[`, `［`],
  [`]`, `］`],
  [`{`, `｛`],
  [`}`, `｝`],
]
const widthSidePairList: WidthSidePairList = [
  [`"`, `“`, `”`],
  [`'`, `‘`, `’`]
]

const defaultHalfwidthOption = `()[]{}`
const defaultFullwidthOption = `，。：；？！“”‘’`
const defaultAdjustedFullwidthOption = `“”‘’`

const checkAdjusted = (token: MutableToken, adjusted: string): void => {
  if (adjusted.indexOf(token.modifiedContent) >= 0) {
    token.modifiedType = CharType.PUNCTUATION_HALF
  }
}

const parseOptions = (
  options: Options
): {
  halfwidthMap: AlterMap
  fullwidthMap: AlterMap
  fullwidthPairMap: AlterPairMap
  adjusted: string
} => {
  const halfwidthOption = options?.halfwidthPunctuation || ''
  const fullwidthOption = options?.fullwidthPunctuation || ''
  const adjustedFullwidthOption = options?.adjustedFullwidthPunctuation || ''

  const halfwidthMap: AlterMap = {}
  const fullwidthMap: AlterMap = {}
  const fullwidthPairMap: AlterPairMap = {}

  widthPairList.forEach(([halfwidth, fullwidth]) => {
    if (halfwidthOption.indexOf(halfwidth) >= 0) {
      halfwidthMap[fullwidth] = halfwidth
    }
    if (fullwidthOption.indexOf(fullwidth) >= 0) {
      fullwidthMap[halfwidth] = fullwidth
    }
  })
  widthSidePairList.forEach(([half, left, right]) => {
    if (halfwidthOption.indexOf(half) >= 0) {
      halfwidthMap[left] = half
      halfwidthMap[right] = half
    }
    if (
      fullwidthOption.indexOf(left) >= 0 ||
      fullwidthOption.indexOf(right) >= 0
    ) {
      fullwidthPairMap[half] = [left, right]
    }
  })
  return {
    halfwidthMap,
    fullwidthMap,
    fullwidthPairMap,
    adjusted: adjustedFullwidthOption
  }
}

const generateHandler = (options: Options): Handler => {
  const { halfwidthMap, fullwidthMap, fullwidthPairMap, adjusted } =
    parseOptions(options)

  const handleHyperSpaceOption: Handler = (
    token: MutableToken,
    _,
    group: MutableGroupToken
  ) => {
    // skip non-punctuation/quotation/bracket situations
    if (
      !isPunctuationType(token.type) &&
      token.type !== HyperTokenType.HYPER_WRAPPER_BRACKET &&
      token.type !== GroupTokenType.GROUP
    ) {
      return
    }

    // skip halfwidth punctuations between halfwidth content without space
    if (isHalfwidthPunctuationWithoutSpaceAround(group, token)) {
      return
    }

    // skip successive multiple half-width punctuations
    if (isSuccessiveHalfwidthPunctuation(group, token)) {
      return
    }

    // 1. normal punctuations in the alter width map
    // 2. brackets in the alter width map
    if (
      isPunctuationType(token.type) ||
      token.type === HyperTokenType.HYPER_WRAPPER_BRACKET
    ) {
      const content = token.modifiedContent
      if (fullwidthMap[content]) {
        checkContent(
          token,
          fullwidthMap[content],
          CharType.PUNCTUATION_FULL,
          PUNCTUATION_FULL_WIDTH
        )
        checkAdjusted(token, adjusted)
      } else if (halfwidthMap[content]) {
        checkContent(
          token,
          halfwidthMap[content],
          CharType.PUNCTUATION_HALF,
          PUNCTUATION_HALF_WIDTH
        )
      }
      return
    }

    // 3. quotes in the alter pair map
    const startContent = (token as MutableGroupToken).modifiedStartContent
    const endContent = (token as MutableGroupToken).modifiedEndContent
    if (fullwidthPairMap[startContent]) {
      checkStartContent(
        token,
        fullwidthPairMap[startContent][0],
        PUNCTUATION_FULL_WIDTH
      )
    } else if (halfwidthMap[startContent]) {
      checkStartContent(
        token,
        halfwidthMap[startContent][0],
        PUNCTUATION_HALF_WIDTH
      )
    }
    if (fullwidthPairMap[endContent]) {
      checkEndContent(
        token,
        fullwidthPairMap[endContent][1],
        PUNCTUATION_FULL_WIDTH
      )
    } else if (halfwidthMap[endContent]) {
      checkEndContent(
        token,
        halfwidthMap[endContent][1],
        PUNCTUATION_HALF_WIDTH
      )
    }
  }
  return handleHyperSpaceOption
}

export const defaultConfig: Options = {
  halfwidthPunctuation: defaultHalfwidthOption,
  fullwidthPunctuation: defaultFullwidthOption,
  adjustedFullwidthPunctuation: defaultAdjustedFullwidthOption
}

export default generateHandler
