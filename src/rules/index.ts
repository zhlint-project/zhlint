import { Handler } from '../parser'
import { Options } from './util'

import defaultHyperCodeHandler, {
  generateHandler as genHyperCodeHandler
} from './hyper-code'
import defaultHyperMarkHandler, {
  generateHandler as genHyperMarkHandler
} from './hyper-mark'
import defaultPunctuationWidthHandler, {
  generateHandler as genPunctuationWidthHandler
} from './punctuation-width'
import defaultPunctuationUnificationHandler, {
  generateHandler as genPunctuationUnificationHandler
} from './punctuation-unification'
import defaultSpaceOfContentHandler, {
  generateHandler as genSpaceOfContentHandler
} from './space-content'
import defaultSpaceOfPunctuationHandler, {
  generateHandler as genSpaceOfPunctuationHandler
} from './space-punctuation'
import defaultSpaceOfQuoteHandler, {
  generateHandler as genSpaceOfQuoteHandler
} from './space-quote'
import defaultSpaceOfBracketHandler, {
  generateHandler as genSpaceOfBracketHandler
} from './space-bracket'

export const generateHandlers = (options: Options): Handler[] => {
  return [
    genHyperCodeHandler(options),
    genHyperMarkHandler(options),
    genPunctuationWidthHandler(options),
    genPunctuationUnificationHandler(options),
    genSpaceOfContentHandler(options),
    genSpaceOfPunctuationHandler(options),
    genSpaceOfQuoteHandler(options),
    genSpaceOfBracketHandler(options)
  ]
}

const defaultHandlers: Handler[] = [
  defaultHyperCodeHandler,
  defaultHyperMarkHandler,
  defaultPunctuationWidthHandler,
  defaultPunctuationUnificationHandler,
  defaultSpaceOfContentHandler,
  defaultSpaceOfPunctuationHandler,
  defaultSpaceOfQuoteHandler,
  defaultSpaceOfBracketHandler
]

export default defaultHandlers
