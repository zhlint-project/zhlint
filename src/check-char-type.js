/**
 * Check whether the character is full-width or half-width,
 * content or punctuation, or empty, or space, or emoji etc.
 * @param  {string} char
 * @return {string}
 * - 'empty'
 * - 'space'
 * - 'content-half'
 * - 'content-full'
 * - 'punctuation-half'
 * - 'punctuation-width'
 * - 'unknown'
 */
const checkCharType = char => {
  // console.log(char.charCodeAt(0).toString(16), char)
  // console.log(char.charCodeAt(1).toString(16), char)

  if (!char) {
    return 'empty'
  }

  // space
  if (char.match(/\s/)) {
    return 'space'
  }

  // 0-9
  if (char.match(/[0-9]/)) {
    return 'content-half'
  }

  if (',.;:?!~-+*/\\%=&|"\'`()[]{}<>'.indexOf(char) >= 0) {
    return 'punctuation-half'
  }

  if ('，。、；：？！…—～｜·‘’“”《》【】「」（）'.indexOf(char) >= 0) {
    return 'punctuation-full'
  }

  // https://jrgraphix.net/research/unicode.php
  // Basic Latin
  if (char.match(/[\u0020-\u007F]/)) {
    return 'content-half'
  }
  // Latin-1 Supplement
  if (char.match(/[\u00A0-\u00FF]/)) {
    return 'content-half'
  }
  // Latin Extended-A
  if (char.match(/[\u0100-\u017F]/)) {
    return 'content-half'
  }
  // Latin Extended-B
  if (char.match(/[\u0180-\u024F]/)) {
    return 'content-half'
  }
  // Greek and Coptic
  if (char.match(/[\u0370-\u03FF]/)) {
    return 'content-half'
  }

  // https://stackoverflow.com/a/21113538
  // CJK Unified Ideographs
  if (char.match(/[\u4E00-\u9FFF]/)) {
    return 'content-full'
  }
  // CJK Unified Ideographs Extension A
  if (char.match(/[\u3400-\u4DBF]/)) {
    return 'content-full'
  }
  // CJK Unified Ideographs Extension B
  if (char.match(/[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6]/)) {
    return 'content-full'
  }
  // CJK Unified Ideographs Extension C
  if (char.match(/\ud869[\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34]/)) {
    return 'content-full'
  }
  // CJK Unified Ideographs Extension D
  if (char.match(/\ud86d[\udf40-\udfff]|\ud86e[\udc00-\udc1d]/)) {
    return 'content-full'
  }
  // CJK Compatibility Ideographs
  if (char.match(/[\uF900-\uFAFF]/)) {
    return 'content-full'
  }
  // CJK Compatibility Forms
  if (char.match(/[\uFE30-\uFE4F]/)) {
    return 'content-full'
  }
  // CJK Radicals Supplement
  if (char.match(/[\u2E80-\u2EFF]/)) {
    return 'content-full'
  }
  // Private Use Area (part)
  if (char.match(/[\uE815-\uE864]/)) {
    return 'content-full'
  }
  // todo: wrong regexp
  // learn: https://mathiasbynens.be/notes/javascript-unicode
  // if (char.match(/[\u20000-\u2A6DF]/)) {
  //   return 'cjk'
  // }
  // // CJK Compatibility Ideographs Supplement
  // if (char.match(/[\u2F800-\u2FA1F]/)) {
  //   return 'cjk'
  // }

  // CJK Symbols and Punctuation
  if (char.match(/[\u3000-\u303F]/)) {
    return 'punctuation-full'
  }

  // emoji
  // todo: wrong regexp
  // learn: https://mathiasbynens.be/notes/javascript-unicode
  // if (char.match(/[\u1F600-\u1F64F]/)) {
  //   return 'emoji'
  // }

  return 'unknown'
}

module.exports = checkCharType
