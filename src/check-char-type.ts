export enum CharType {
  EMPTY = 'empty',
  SPACE = 'space',
  CONTENT_HALF = 'content-half',
  CONTENT_FULL = 'content-full',
  CJK = 'cjk', // TODO
  PUNCTUATION_HALF = 'punctuation-half',
  PUNCTUATION_FULL = 'punctuation-full',
  UNKNOWN = 'unknown'
}

/**
 * Check whether the character is full-width or half-width,
 * content or punctuation, or empty, or space, or emoji etc.
 * Refs:
 * - https://jrgraphix.net/research/unicode.php
 * - https://mathiasbynens.be/notes/javascript-unicode
 * - https://stackoverflow.com/a/21113538
 * @param  {string} char
 * @return {string}
 * - 'empty'
 * - 'space'
 * - 'content-half'
 * - 'content-full'
 * - 'cjk'?
 * - 'punctuation-half'
 * - 'punctuation-full'
 * - 'unknown'
 */
const checkCharType = (char: string): CharType => {
  if (char === '') {
    return CharType.EMPTY
  }

  // space
  if (char.match(/\s/) != null) {
    return CharType.SPACE
  }

  // 0-9
  if (char.match(/[0-9]/) != null) {
    return CharType.CONTENT_HALF
  }

  if (',.;:?!~-+*/\\%=&|"\'`()[]{}<>'.indexOf(char) >= 0) {
    return CharType.PUNCTUATION_HALF
  }

  if ('，。、；：？！…—～｜·‘’“”《》【】「」（）'.indexOf(char) >= 0) {
    return CharType.PUNCTUATION_FULL
  }

  // Basic Latin
  if (char.match(/[\u0020-\u007F]/) != null) {
    return CharType.CONTENT_HALF
  }
  // Latin-1 Supplement
  if (char.match(/[\u00A0-\u00FF]/) != null) {
    return CharType.CONTENT_HALF
  }
  // Latin Extended-A
  if (char.match(/[\u0100-\u017F]/) != null) {
    return CharType.CONTENT_HALF
  }
  // Latin Extended-B
  if (char.match(/[\u0180-\u024F]/) != null) {
    return CharType.CONTENT_HALF
  }
  // Greek and Coptic
  if (char.match(/[\u0370-\u03FF]/) != null) {
    return CharType.CONTENT_HALF
  }

  // CJK Unified Ideographs
  if (char.match(/[\u4E00-\u9FFF]/) != null) {
    return CharType.CONTENT_FULL
  }
  // CJK Unified Ideographs Extension A
  if (char.match(/[\u3400-\u4DBF]/) != null) {
    return CharType.CONTENT_FULL
  }
  // CJK Unified Ideographs Extension B
  if (
    char.match(/[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6]/) != null
  ) {
    return CharType.CONTENT_FULL
  }
  // CJK Unified Ideographs Extension C
  if (
    char.match(
      /\ud869[\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34]/
    ) != null
  ) {
    return CharType.CONTENT_FULL
  }
  // CJK Unified Ideographs Extension D
  if (char.match(/\ud86d[\udf40-\udfff]|\ud86e[\udc00-\udc1d]/) != null) {
    return CharType.CONTENT_FULL
  }
  // CJK Compatibility Ideographs
  if (char.match(/[\uF900-\uFAFF]/) != null) {
    return CharType.CONTENT_FULL
  }
  // CJK Compatibility Forms
  if (char.match(/[\uFE30-\uFE4F]/) != null) {
    return CharType.CONTENT_FULL
  }
  // CJK Radicals Supplement
  if (char.match(/[\u2E80-\u2EFF]/) != null) {
    return CharType.CONTENT_FULL
  }
  // Private Use Area (part)
  if (char.match(/[\uE815-\uE864]/) != null) {
    return CharType.CONTENT_FULL
  }
  // CJK Unified Ideographs Extension B
  if (char.match(/[\u{20000}-\u{2A6DF}]/u) != null) {
    return CharType.CJK
  }
  // CJK Compatibility Ideographs Supplement
  if (char.match(/[\u{2F800}-\u{2FA1F}]/u) != null) {
    return CharType.CJK
  }

  // CJK Symbols and Punctuation
  if (char.match(/[\u3000-\u303F]/) != null) {
    return CharType.PUNCTUATION_FULL
  }

  return CharType.UNKNOWN
}

export default checkCharType
