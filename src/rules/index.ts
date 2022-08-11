import { Handler } from '../parser'
import { Options } from './util'

import genSpaceTrimGenerateHandler from './space-trim'

import genHyperCodeHandler from './hyper-code'
import genHyperMarkHandler from './hyper-mark'

import genPunctuationWidthHandler from './punctuation-width'
import genPunctuationUnificationHandler from './punctuation-unification'

import genAbbrsHandler from './case-abbrs'

import genSpaceOfContentHandler from './space-content'
import genSpaceOfPunctuationHandler from './space-punctuation'
import genSpaceOfQuoteHandler from './space-quote'
import genSpaceOfBracketHandler from './space-bracket'
import genSpaceOfLinebreakHandler from './space-linebreak'

import genZhUnitsHandler from './case-zh-units'
import genHtmlEntityHandler from './case-html-entity'

const generateHandlers = (options: Options): Handler[] => {
  return [
    genSpaceTrimGenerateHandler(options),

    genHyperMarkHandler(options),
    genHyperCodeHandler(options),

    genPunctuationWidthHandler(options),
    genPunctuationUnificationHandler(options),

    genAbbrsHandler(options),

    genSpaceOfContentHandler(options),
    genSpaceOfPunctuationHandler(options),
    genSpaceOfQuoteHandler(options),
    genSpaceOfBracketHandler(options),
    genSpaceOfLinebreakHandler(options),

    genZhUnitsHandler(options),
    genHtmlEntityHandler(options)
  ]
}

export const defaultConfig: Options = {
  noSinglePair: true,
  halfWidthPunctuation: `()`,
  fullWidthPunctuation: `，。：；？！“”‘’`,
  unifiedPunctuation: 'simplified',
  spaceBetweenHalfWidthContent: true,
  noSpaceBetweenFullWidthContent: true,
  spaceBetweenMixedWidthContent: true,
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
  noSpaceInsideMark: true,
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
