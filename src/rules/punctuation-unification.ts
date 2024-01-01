/**
 * @fileoverview
 *
 * This rule will unify similar punctuations into the same one.
 * Usually, it's just about Chinese quotes.
 *
 * Options:
 * - unifiedPunctuation: "simplified" (default) | "traditional" | undefined
 */

import { GroupTokenType, Handler, MutableToken } from '../parser'
import {
  PUNCTUATION_UNIFICATION_SIMPLIFIED,
  PUNCTUATION_UNIFICATION_TRADITIONAL
} from './messages'
import { checkEndValue, checkStartValue, Options } from './util'

type UnifiedOptions = 'traditional' | 'simplified'

enum QuotationType {
  LEFT,
  LEFT_EMBEDDED,
  RIGHT_EMBEDDED,
  RIGHT
}

const replaceMap: Record<UnifiedOptions, Record<QuotationType, string>> = {
  simplified: {
    [QuotationType.LEFT]: `“`,
    [QuotationType.LEFT_EMBEDDED]: `‘`,
    [QuotationType.RIGHT_EMBEDDED]: `’`,
    [QuotationType.RIGHT]: `”`
  },
  traditional: {
    [QuotationType.LEFT]: `「`,
    [QuotationType.LEFT_EMBEDDED]: `『`,
    [QuotationType.RIGHT_EMBEDDED]: `』`,
    [QuotationType.RIGHT]: `」`
  }
}

const valueToKey = (
  obj: Record<QuotationType, string>
): Record<string, QuotationType> => {
  const result: Record<string, QuotationType> = {}
  for (const key in obj) {
    const value: string = obj[key]
    result[value] = key as unknown as QuotationType
  }
  return result
}

const checkChar = (
  value: string,
  objectMap: Record<string, QuotationType>,
  unifiedMap: Record<QuotationType, string>
): string => {
  const key = objectMap[value]
  if (key) {
    return unifiedMap[key]
  }
  return value
}

const generateHandler = (options: Options): Handler => {
  const unifiedOption = options?.unifiedPunctuation

  if (!unifiedOption) {
    return () => {
      // do nothing
    }
  }

  const message =
    unifiedOption === 'simplified'
      ? PUNCTUATION_UNIFICATION_SIMPLIFIED
      : PUNCTUATION_UNIFICATION_TRADITIONAL
  const unifiedMap = replaceMap[unifiedOption]
  const objectMap = valueToKey(
    unifiedOption === 'simplified'
      ? replaceMap.traditional
      : replaceMap.simplified
  )

  const handlerPunctuationUnified = (token: MutableToken) => {
    if (token.type !== GroupTokenType.GROUP) {
      return
    }
    const modifiedStartValue = checkChar(
      token.modifiedStartValue,
      objectMap,
      unifiedMap
    )
    const modifiedEndValue = checkChar(
      token.modifiedEndValue,
      objectMap,
      unifiedMap
    )
    checkStartValue(token, modifiedStartValue, message)
    checkEndValue(token, modifiedEndValue, message)
  }

  return handlerPunctuationUnified
}

export const defaultConfig: Options = {
  unifiedPunctuation: 'simplified'
}

export default generateHandler
