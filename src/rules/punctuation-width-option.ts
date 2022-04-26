/**
 * @fileoverview
 * 
 * This rule will format each punctuation into the right width options.
 * 
 * Options:
 * - punctuation.halfWidth: string
 * - punctuation.fullWidth: string
 */

import { CharType, GroupTokenType, Handler, isPunctuationType, MutableGroupToken, MutableToken, SingleTokenType } from "../parser"
import { findHyperMarkSeq, findNonHyperVisibleTokenAfter, findNonHyperVisibleTokenBefore, findTokenAfter, findTokenBefore, hasSpaceInHyperMarkSeq, Options } from "./util"

type WidthPairList = Array<[halfWidth: string, fullWidth: string]>
type WidthSidePairList = Array<[halfWidth: string, fullWidthLeftSide: string, fullWidthRightSide: string]>
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

const parseOptions = (options: Options): {
  halfWidthMap: AlterMap
  fullWidthMap: AlterMap
  fullWidthPairMap: AlterPairMap
} => {
  const halfWidthOption = options?.punctuation?.halfWidth || ''
  const fullWidthOption = options?.punctuation?.fullWidth || ''

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
    if (fullWidthOption.indexOf(left) >= 0 || fullWidthOption.indexOf(right) >= 0) {
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
  const nonHyperVisibleTokenAfter = findNonHyperVisibleTokenAfter(
    group,
    token
  )
  const tokenBefore = findTokenBefore(group, token)
  const tokenAfter = findTokenAfter(group, token)

  if (
    token.type === CharType.PUNCTUATION_HALF &&
    nonHyperVisibleTokenBefore &&
    nonHyperVisibleTokenAfter &&
    nonHyperVisibleTokenBefore.type === CharType.CONTENT_HALF &&
    nonHyperVisibleTokenAfter.type === CharType.CONTENT_HALF
  ) {
    let hasSpaceBefore = !!nonHyperVisibleTokenBefore.modifiedSpaceAfter
    let hasSpaceAfter = !!token.modifiedSpaceAfter
    
    if (nonHyperVisibleTokenBefore !== tokenBefore) {
      const hyperMarkSeqBefore = findHyperMarkSeq(group, tokenBefore as MutableToken)
      if (hasSpaceInHyperMarkSeq(group, hyperMarkSeqBefore)) {
        hasSpaceBefore = true
      }
    }

    if (nonHyperVisibleTokenAfter !== tokenAfter) {
      const hyperMarkSeqAfter = findHyperMarkSeq(group, tokenAfter as MutableToken)
      if (hasSpaceInHyperMarkSeq(group, hyperMarkSeqAfter)) {
        hasSpaceAfter = true
      }
    }

    if (!hasSpaceBefore && !hasSpaceAfter) {
      return true
    }
  }
  return false
}

export const generateHandler = (options: Options): Handler => {
  const {
    halfWidthMap,
    fullWidthMap,
    fullWidthPairMap
  } = parseOptions(options)

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
      }
      else if (halfWidthMap[content]) {
        token.modifiedContent = halfWidthMap[content]
      }
      return
    }

    // For brackets in the alter width map.
    if (token.type === SingleTokenType.MARK_BRACKETS) {
      const content = token.modifiedContent
      if (fullWidthMap[content]) {
        token.modifiedContent = fullWidthMap[content]
      }
      else if (halfWidthMap[content]) {
        token.modifiedContent = halfWidthMap[content]
      }
      return
    }

    // For quotes in the alter pair map
    const startContent = (token as MutableGroupToken).modifiedStartContent
    const endContent = (token as MutableGroupToken).modifiedEndContent
    if (fullWidthPairMap[startContent]) {
      (token as MutableGroupToken).modifiedStartContent = fullWidthPairMap[startContent][0]
    }
    else if (halfWidthMap[startContent]) {
      (token as MutableGroupToken).modifiedStartContent = halfWidthMap[startContent][0]
    }
    if (fullWidthPairMap[endContent]) {
      (token as MutableGroupToken).modifiedEndContent = fullWidthPairMap[endContent][1]
    }
    else if (halfWidthMap[endContent]) {
      (token as MutableGroupToken).modifiedEndContent = halfWidthMap[endContent][1]
    }
  }
  return handleHyperSpaceOption
}

export default generateHandler({
  punctuation: {
    halfWidth: defaultHalfWidthOption,
    fullWidth: defaultFullWidthOption
  }
})
