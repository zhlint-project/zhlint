import { CharType } from './types.js'

/**
 * NOTE:
 * - U+FE41 PRESENTATION FORM FOR VERTICAL LEFT CORNER BRACKET -> U+300C LEFT CORNER BRACKET, etc.
 * - U+2E3A TWO-EM DASH, U+2014 EM DASH x2
 * - U+2026 HORIZONTAL ELLIPSIS, U+22EF MIDLINE HORIZONTAL ELLIPSIS
 * - U+25CF BLACK CIRCLE (emphasis dots), U+2022 BULLET (emphasis dots), U+00B7 MIDDLE DOT (interpuncts),
 *   U+2027 HYPHENATION POINT, U+2022 BULLET, U+30FB KATAKANA MIDDLE DOT
 *
 * Decoration marks:
 * - emphasis dots: U+25CF BLACK CIRCLE, U+2022 BULLET
 * - book title marks: U+FE4F WAVY LOW LINE
 * - proper noun marks: U+FF3F FULLWIDTH LOW LINE
 */
const newCharTypeSet: { [key in CharType]?: string } = {
  [CharType.HALFWIDTH_PAUSE_OR_STOP]: ',.;:?!',
  [CharType.FULLWIDTH_PAUSE_OR_STOP]: [
    // normal punctuation marks
    '，。、；：？！',
    // special punctuation marks
    '⁈⁇‼⁉'
  ].join(''),
  [CharType.HALFWIDTH_QUOTATION]: '\'"',
  [CharType.FULLWIDTH_QUOTATION]: '‘’“”《》〈〉『』「」【】〖〗',
  [CharType.HALFWIDTH_BRACKET]: '()[]{}',
  [CharType.FULLWIDTH_BRACKET]: '（）〔〕［］｛｝',
  [CharType.HALFWIDTH_OTHER_PUNCTUATION]: [
    // on-keyboard symbols
    '~-+*/\\%=&|`<>@#$^',
    // symbol of death
    '†‡'
  ].join(''),
  [CharType.FULLWIDTH_OTHER_PUNCTUATION]: [
    // U+2E3A TWO-EM DASH, U+2014 EM DASH
    '—⸺',
    // U+2026 HORIZONTAL ELLIPSIS, U+22EF MIDLINE HORIZONTAL ELLIPSIS
    '…⋯',
    // U+FF5E FULLWIDTH TILDE
    '～',
    // U+25CF BLACK CIRCLE, U+2022 BULLET, U+00B7 MIDDLE DOT,
    // U+2027 HYPHENATION POINT, U+30FB KATAKANA MIDDLE DOT
    '●•·‧・'
  ].join('')
}

/**
 * Check whether the character is full-width or half-width,
 * content or punctuation, or empty, or space, or emoji etc.
 * Refs:
 * - https://unicode.org/charts/
 * - https://jrgraphix.net/research/unicode.php
 * - https://mathiasbynens.be/notes/javascript-unicode
 * - https://stackoverflow.com/a/21113538
 * - https://www.w3.org/International/clreq/#categories_and_usage_of_punctuation_marks
 */
export const checkCharType = (char: string): CharType => {
  if (char === '') {
    return CharType.EMPTY
  }

  // space
  if (char.match(/\s/) != null) {
    return CharType.SPACE
  }

  // punctuation marks
  for (const [charType, charSet] of Object.entries(newCharTypeSet)) {
    if (charSet?.indexOf(char) >= 0) {
      return charType as CharType
    }
  }

  // 0-9
  if (char.match(/[0-9]/) != null) {
    return CharType.WESTERN_LETTER
  }

  // Basic Latin
  if (char.match(/[\u0020-\u007F]/) != null) {
    return CharType.WESTERN_LETTER
  }
  // Latin-1 Supplement
  if (char.match(/[\u00A0-\u00FF]/) != null) {
    return CharType.WESTERN_LETTER
  }
  // Latin Extended-A
  if (char.match(/[\u0100-\u017F]/) != null) {
    return CharType.WESTERN_LETTER
  }
  // Latin Extended-B
  if (char.match(/[\u0180-\u024F]/) != null) {
    return CharType.WESTERN_LETTER
  }
  // Greek and Coptic
  if (char.match(/[\u0370-\u03FF]/) != null) {
    return CharType.WESTERN_LETTER
  }

  // CJK Unified Ideographs
  if (char.match(/[\u4E00-\u9FFF]/) != null) {
    return CharType.CJK_CHAR
  }
  // CJK Unified Ideographs Extension A
  if (char.match(/[\u3400-\u4DBF]/) != null) {
    return CharType.CJK_CHAR
  }
  // CJK Unified Ideographs Extension B
  if (
    char.match(/[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6]/) != null
  ) {
    return CharType.CJK_CHAR
  }
  // CJK Unified Ideographs Extension C
  if (
    char.match(
      /\ud869[\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34]/
    ) != null
  ) {
    return CharType.CJK_CHAR
  }
  // CJK Unified Ideographs Extension D
  if (char.match(/\ud86d[\udf40-\udfff]|\ud86e[\udc00-\udc1d]/) != null) {
    return CharType.CJK_CHAR
  }
  // CJK Compatibility Ideographs
  if (char.match(/[\uF900-\uFAFF]/) != null) {
    return CharType.CJK_CHAR
  }
  // CJK Compatibility Forms
  if (char.match(/[\uFE30-\uFE4F]/) != null) {
    return CharType.CJK_CHAR
  }
  // CJK Radicals Supplement
  if (char.match(/[\u2E80-\u2EFF]/) != null) {
    return CharType.CJK_CHAR
  }
  // Private Use Area (part)
  if (char.match(/[\uE815-\uE864]/) != null) {
    return CharType.CJK_CHAR
  }
  // CJK Unified Ideographs Extension B
  if (char.match(/[\u{20000}-\u{2A6DF}]/u) != null) {
    return CharType.CJK_CHAR
  }
  // CJK Compatibility Ideographs Supplement
  if (char.match(/[\u{2F800}-\u{2FA1F}]/u) != null) {
    return CharType.CJK_CHAR
  }

  // CJK Symbols and Punctuation
  if (char.match(/[\u3000-\u303F]/) != null) {
    return CharType.FULLWIDTH_OTHER_PUNCTUATION
  }

  return CharType.UNKNOWN
}
