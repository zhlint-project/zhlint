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

export const generateHandlers = (options: Options): Handler[] => {
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
  ]
}
