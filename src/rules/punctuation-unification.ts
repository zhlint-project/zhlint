/**
 * @fileoverview
 *
 * This rule will unify similar punctuations into the same one.
 * Usually, it's just about Chinese quotations.
 *
 * Options:
 * - unifiedPunctuation: "traditional" | "simplified" | Record<string, boolean | string[]> & { default: boolean }
 */

import { GroupTokenType, Handler, MutableToken } from '../parser/index.js'
import { PUNCTUATION_UNIFICATION } from './messages.js'
import { checkEndValue, checkStartValue, checkValue, Options } from './util.js'

const defaultUnifiedMap: Record<string, string[]> = {
  // U+2047 DOUBLE QUESTION MARK, U+203C DOUBLE EXCLAMATION MARK
  // U+2048 QUESTION EXCLAMATION MARK, U+2049 EXCLAMATION QUESTION MARK
  '？？': ['⁇'],
  '！！': ['‼'],
  '？！': ['⁈'],
  '！？': ['⁉'],

  // U+002F SOLIDUS, U+FF0F FULLWIDTH SOLIDUS
  '/': ['/', '／'],

  // U+FF5E FULLWIDTH TILDE
  '~': ['~', '～'],

  // U+2026 HORIZONTAL ELLIPSIS, U+22EF MIDLINE HORIZONTAL ELLIPSIS
  '…': ['…', '⋯'],

  // U+25CF BLACK CIRCLE, U+2022 BULLET, U+00B7 MIDDLE DOT,
  // U+2027 HYPHENATION POINT, U+30FB KATAKANA MIDDLE DOT
  '·': ['●', '•', '·', '‧', '・']
}

const simplifiedUnifiedMap: Record<string, string[]> = {
  '“': ['「'],
  '”': ['」'],
  '‘': ['『'],
  '’': ['』']
}

const traditionalUnifiedMap: Record<string, string[]> = {
  '「': ['“'],
  '」': ['”'],
  '『': ['‘'],
  '』': ['’']
}

const revertUnifiedMap = (
  unifiedMap: Record<string, string[]>
): Record<string, string> => {
  const result: Record<string, string> = {}
  for (const key in unifiedMap) {
    const value = unifiedMap[key]
    value.forEach((v) => {
      result[v] = key
    })
  }
  return result
}

const getRevertedUnifiedMap = (options: Options): Record<string, string> => {
  const unifiedOption = options?.unifiedPunctuation
  const langType = typeof unifiedOption === 'string' ? unifiedOption : undefined
  const unifiedMap: Record<string, string[]> = {}

  if (langType) {
    Object.assign(unifiedMap, defaultUnifiedMap)
    if (langType === 'simplified') {
      Object.assign(unifiedMap, simplifiedUnifiedMap)
    } else if (langType === 'traditional') {
      Object.assign(unifiedMap, traditionalUnifiedMap)
    }
  } else if (typeof unifiedOption === 'object') {
    if (unifiedOption.default) {
      Object.assign(unifiedMap, defaultUnifiedMap)
    }
    Object.entries(unifiedOption).forEach(([key, value]) => {
      if (value === true) {
        unifiedMap[key] = defaultUnifiedMap[key]
      } else if (value === false) {
        delete unifiedMap[key]
      } else {
        unifiedMap[key] = value
      }
    })
  }

  return revertUnifiedMap(unifiedMap)
}

const generateHandler = (options: Options): Handler => {
  const charMap = getRevertedUnifiedMap(options)

  const handlerPunctuationUnified = (token: MutableToken) => {
    if (token.type === GroupTokenType.GROUP) {
      if (Object.prototype.hasOwnProperty.call(charMap, token.modifiedStartValue)) {
        checkStartValue(
          token,
          charMap[token.modifiedStartValue],
          PUNCTUATION_UNIFICATION
        )
      }
      if (Object.prototype.hasOwnProperty.call(charMap, token.modifiedEndValue)) {
        checkEndValue(
          token,
          charMap[token.modifiedEndValue],
          PUNCTUATION_UNIFICATION
        )
      }
      return
    } else {
      if (Object.prototype.hasOwnProperty.call(charMap, token.modifiedValue)) {
        checkValue(
          token,
          charMap[token.modifiedValue],
          undefined,
          PUNCTUATION_UNIFICATION
        )
      }
    }
  }

  return handlerPunctuationUnified
}

export const defaultConfig: Options = {
  unifiedPunctuation: 'simplified'
}

export default generateHandler
