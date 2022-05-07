/**
 * @fileoverview
 * 
 * This rule will unify similar punctuations into the same one.
 * Usually, it's just about Chinese quotes.
 * 
 * Options:
 * - unifiedPunctuation: "simplified" (default) | "traditional" | undefined
 */

import { GroupTokenType, Handler, MutableToken } from "../parser"
import { PUNCTUATION_UNIFICATION_SIMPLIFIED, PUNCTUATION_UNIFICATION_TRADITIONAL } from "./messages"
import { checkEndContent, checkStartContent, Options } from "./util"

type UnifiedOptions = "traditional" | "simplified"

enum QuoteType {
  LEFT,
  LEFT_EMBEDDED,
  RIGHT_EMBEDDED,
  RIGHT,
}

const replaceMap: Record<UnifiedOptions, Record<QuoteType, string>> = {
  simplified: {
    [QuoteType.LEFT]: `“`,
    [QuoteType.LEFT_EMBEDDED]: `‘`,
    [QuoteType.RIGHT_EMBEDDED]: `’`,
    [QuoteType.RIGHT]: `”`,
  },
  traditional: {
    [QuoteType.LEFT]: `「`,
    [QuoteType.LEFT_EMBEDDED]: `『`,
    [QuoteType.RIGHT_EMBEDDED]: `』`,
    [QuoteType.RIGHT]: `」`,
  },
}

const valueToKey = (obj: Record<QuoteType, string>): Record<string, QuoteType> => {
  const result: Record<string, QuoteType> = {}
  for (const key in obj) {
    const value: string = obj[key]
    result[value] = key as unknown as QuoteType
  }
  return result
}

const checkChar = (content: string, objectMap: Record<string, QuoteType>, unifiedMap: Record<QuoteType, string>): string => {
  const key = objectMap[content]
  if (key) {
    return unifiedMap[key]
  }
  return content
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
  const objectMap = valueToKey(unifiedOption === 'simplified' ? replaceMap.traditional : replaceMap.simplified)

  const handlerPunctuationUnified = (token: MutableToken) => {
    if (token.type !== GroupTokenType.GROUP) {
      return
    }
    const modifiedStartContent = checkChar(token.modifiedStartContent, objectMap, unifiedMap)
    const modifiedEndContent = checkChar(token.modifiedEndContent, objectMap, unifiedMap)
    checkStartContent(token, modifiedStartContent, message)
    checkEndContent(token, modifiedEndContent, message)
  }

  return handlerPunctuationUnified
}

export const defaultConfig: Options = {
  unifiedPunctuation: 'simplified'
}

export default generateHandler
