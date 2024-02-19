import { Handler } from '../parser/index.js'
import { Options } from './util.js'

import genSpaceTrimGenerateHandler from './space-trim.js'

import genPunctuationWidthHandler from './punctuation-width.js'
import genPunctuationUnificationHandler from './punctuation-unification.js'

import genAbbrsHandler from './case-abbrs.js'

import genSpaceOfHyperMarkHandler from './space-hyper-mark.js'
import genSpaceOfCodeHandler from './space-code.js'
import genSpaceOfLetterHandler from './space-letter.js'
import genSpaceOfPunctuationHandler from './space-punctuation.js'
import genSpaceOfQuotationHandler from './space-quotation.js'
import genSpaceOfBracketHandler from './space-bracket.js'

import genLinebreakHandler from './case-linebreak.js'
import genZhUnitsHandler from './case-zh-units.js'
import genHtmlEntityHandler from './case-html-entity.js'

import genSkipPureWesternHandler from './case-pure-western.js'

const generateHandlers = (options: Options): Handler[] => {
  return [
    genSpaceTrimGenerateHandler(options),

    genPunctuationWidthHandler(options),
    genPunctuationUnificationHandler(options),

    genAbbrsHandler(options),

    genSpaceOfHyperMarkHandler(options),
    genSpaceOfCodeHandler(options),
    genSpaceOfLetterHandler(options),
    genSpaceOfPunctuationHandler(options),
    genSpaceOfQuotationHandler(options),
    genSpaceOfBracketHandler(options),
    genLinebreakHandler(options),

    genZhUnitsHandler(options),
    genHtmlEntityHandler(options),

    genSkipPureWesternHandler(options)
  ]
}

export const defaultConfig: Options = {
  noSinglePair: true,
  halfwidthPunctuation: `()[]{}`,
  fullwidthPunctuation: `，。：；？！“”‘’`,
  adjustedFullwidthPunctuation: `“”‘’`,
  unifiedPunctuation: 'simplified',
  spaceBetweenHalfwidthContent: true,
  noSpaceBetweenFullwidthContent: true,
  spaceBetweenMixedwidthContent: true,
  noSpaceBeforePauseOrStop: true,
  spaceAfterHalfwidthPauseOrStop: true,
  noSpaceAfterFullwidthPauseOrStop: true,
  spaceOutsideHalfwidthQuotation: true,
  noSpaceOutsideFullwidthQuotation: true,
  noSpaceInsideQuotation: true,
  spaceOutsideHalfwidthBracket: true,
  noSpaceOutsideFullwidthBracket: true,
  noSpaceInsideBracket: true,
  spaceOutsideCode: true,
  noSpaceInsideHyperMark: true,
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
  ],
  skipPureWestern: true
}

export default generateHandlers
