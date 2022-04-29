/**
 * @fileoverview
 *
 * This rule will format each punctuation into the right width options.
 *
 * Options:
 * - halfWidthPunctuation: string
 * - fullWidthPunctuation: string
 */

import {
  CharType,
  GroupTokenType,
  Handler,
  isPunctuationType,
  MutableGroupToken,
  MutableToken,
  SingleTokenType
} from '../parser'
import {
  findMarkSeqBetween,
  findNonHyperVisibleTokenAfter,
  findNonHyperVisibleTokenBefore,
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

const parseOptions = (
  options: Options
): {
  halfWidthMap: AlterMap
  fullWidthMap: AlterMap
  fullWidthPairMap: AlterPairMap
} => {
  const halfWidthOption = options?.halfWidthPunctuation || ''
  const fullWidthOption = options?.fullWidthPunctuation || ''

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
    fullWidthPairMap
  }
}

const needKeep = (group: MutableGroupToken, token: MutableToken): boolean => {
  const nonHyperVisibleTokenBefore = findNonHyperVisibleTokenBefore(
    group,
    token
  )
  const nonHyperVisibleTokenAfter = findNonHyperVisibleTokenAfter(group, token)

  if (
    token.type === CharType.PUNCTUATION_HALF &&
    nonHyperVisibleTokenBefore &&
    nonHyperVisibleTokenAfter &&
    nonHyperVisibleTokenBefore.type === CharType.CONTENT_HALF &&
    nonHyperVisibleTokenAfter.type === CharType.CONTENT_HALF
  ) {
    const resultBefore = findMarkSeqBetween(
      group,
      nonHyperVisibleTokenBefore,
      token
    )
    const hasSpaceBefore = resultBefore.tokenSeq.some(
      (target) => target.modifiedSpaceAfter
    )

    const resultAfter = findMarkSeqBetween(
      group,
      token,
      nonHyperVisibleTokenAfter
    )
    const hasSpaceAfter = resultAfter.tokenSeq.some(
      (target) => target.modifiedSpaceAfter
    )
    return !hasSpaceBefore && !hasSpaceAfter
  }
  return false
}

export const generateHandler = (options: Options): Handler => {
  const { halfWidthMap, fullWidthMap, fullWidthPairMap } = parseOptions(options)

  const handleHyperSpaceOption: Handler = (
    token: MutableToken,
    _,
    group: MutableGroupToken
  ) => {
    // For punctuation, quote, bracket only.
    if (
      !isPunctuationType(token.type) &&
      token.type !== SingleTokenType.MARK_BRACKETS &&
      token.type !== GroupTokenType.GROUP
    ) {
      return
    }

    // Skip half width punctuation between half width content without space.
    if (needKeep(group, token)) {
      return
    }

    // For punctuation in the alter width map.
    if (isPunctuationType(token.type)) {
      const content = token.modifiedContent
      if (fullWidthMap[content]) {
        token.modifiedContent = fullWidthMap[content]
        token.modifiedType = CharType.PUNCTUATION_FULL
      } else if (halfWidthMap[content]) {
        token.modifiedContent = halfWidthMap[content]
        token.modifiedType = CharType.PUNCTUATION_HALF
      }
      return
    }

    // For brackets in the alter width map.
    if (token.type === SingleTokenType.MARK_BRACKETS) {
      const content = token.modifiedContent
      if (fullWidthMap[content]) {
        token.modifiedContent = fullWidthMap[content]
        token.modifiedType = CharType.PUNCTUATION_FULL
      } else if (halfWidthMap[content]) {
        token.modifiedContent = halfWidthMap[content]
        token.modifiedType = CharType.PUNCTUATION_HALF
      }
      return
    }

    // For quotes in the alter pair map
    const startContent = (token as MutableGroupToken).modifiedStartContent
    const endContent = (token as MutableGroupToken).modifiedEndContent
    if (fullWidthPairMap[startContent]) {
      (token as MutableGroupToken).modifiedStartContent =
        fullWidthPairMap[startContent][0]
    } else if (halfWidthMap[startContent]) {
      (token as MutableGroupToken).modifiedStartContent =
        halfWidthMap[startContent][0]
    }
    if (fullWidthPairMap[endContent]) {
      (token as MutableGroupToken).modifiedEndContent =
        fullWidthPairMap[endContent][1]
    } else if (halfWidthMap[endContent]) {
      (token as MutableGroupToken).modifiedEndContent =
        halfWidthMap[endContent][1]
    }
  }
  return handleHyperSpaceOption
}

export default generateHandler({
  halfWidthPunctuation: defaultHalfWidthOption,
  fullWidthPunctuation: defaultFullWidthOption
})
