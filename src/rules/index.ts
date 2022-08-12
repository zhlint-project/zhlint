import { Handler } from '../parser'
import { Options } from './util'

import genSpaceTrimGenerateHandler from './space-trim'

import genPunctuationWidthHandler from './punctuation-width'
import genPunctuationUnificationHandler from './punctuation-unification'

import genAbbrsHandler from './case-abbrs'

import genSpaceOfWrapperHandler from './space-wrapper'
import genSpaceOfCodeHandler from './space-code'
import genSpaceOfLettersHandler from './space-letters'
import genSpaceOfPunctuationHandler from './space-punctuation'
import genSpaceOfQuoteHandler from './space-quote'
import genSpaceOfBracketHandler from './space-bracket'

import genLinebreakHandler from './case-linebreak'
import genZhUnitsHandler from './case-zh-units'
import genHtmlEntityHandler from './case-html-entity'

const generateHandlers = (options: Options): Handler[] => {
  return [
    genSpaceTrimGenerateHandler(options),

    genPunctuationWidthHandler(options),
    genPunctuationUnificationHandler(options),

    genAbbrsHandler(options),

    genSpaceOfWrapperHandler(options),
    genSpaceOfCodeHandler(options),
    genSpaceOfLettersHandler(options),
    genSpaceOfPunctuationHandler(options),
    genSpaceOfQuoteHandler(options),
    genSpaceOfBracketHandler(options),
    genLinebreakHandler(options),

    genZhUnitsHandler(options),
    genHtmlEntityHandler(options)
  ]
}

export const defaultConfig: Options = {
  noSinglePair: true,
  halfWidthPunctuation: `()`,
  fullWidthPunctuation: `，。：；？！“”‘’`,
  unifiedPunctuation: 'simplified',
  spaceBetweenHalfWidthLetters: true,
  noSpaceBetweenFullWidthLetters: true,
  spaceBetweenMixedWidthLetters: true,
  noSpaceBeforePunctuation: true,
  spaceAfterHalfWidthPunctuation: true,
  noSpaceAfterFullWidthPunctuation: true,
  spaceOutsideHalfQuote: true,
  noSpaceOutsideFullQuote: true,
  noSpaceInsideQuote: true,
  spaceOutsideHalfBracket: true,
  noSpaceOutsideFullBracket: true,
  noSpaceInsideBracket: true,
  spaceOutsideCode: true,
  noSpaceInsideWrapper: true,
  trimSpace: true,
  skipZhUnits: `年月日天号时分秒`,
  skipAbbrs: [
    'Mr.',
    'Mrs.',
    'Dr.',
    'Jr.',
    'Sr.',
    'vs.',
    'etc.',
    'i.e.',
    'e.g.',
    'a.k.a.'
  ]
}

export default generateHandlers
