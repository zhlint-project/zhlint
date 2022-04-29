import { Handler } from '../parser'
import { Options } from './util'

import defaultHyperSpaceOption, {
  generateHandler as genHyperSpaceOption
} from './hyper-space-option'
import defaultHyperSpacePosition, {
  generateHandler as genHyperSpacePosition
} from './hyper-space-position'
import defaultPunctuationWidthOption, {
  generateHandler as genPunctuationWidthOption
} from './punctuation-width-option'
import defaultPunctuationUnifiedOption, {
  generateHandler as genPunctuationUnifiedOption
} from './punctuation-unified-option'
import defaultSpaceBetweenContentOption, {
  generateHandler as genSpaceBetweenContentOption
} from './space-content-option'
import defaultSpaceBesidesPunctuationOption, {
  generateHandler as genSpaceBesidesPunctuationOption
} from './space-punctuation-option'
import defaultSpaceBesidesQuoteOption, {
  generateHandler as genSpaceBesidesQuoteOption
} from './space-quote-option'
import defaultSpaceBesidesBracketOption, {
  generateHandler as genSpaceBesidesBracketOption
} from './space-bracket-option'

export const generateHandlers = (options: Options): Handler[] => {
  return [
    genHyperSpaceOption(options),
    genHyperSpacePosition(),
    genPunctuationWidthOption(options),
    genPunctuationUnifiedOption(options),
    genSpaceBetweenContentOption(options),
    genSpaceBesidesPunctuationOption(options),
    genSpaceBesidesQuoteOption(options),
    genSpaceBesidesBracketOption(options)
  ]
}

const defaultHandlers: Handler[] = [
  defaultHyperSpaceOption,
  defaultHyperSpacePosition,
  defaultPunctuationWidthOption,
  defaultPunctuationUnifiedOption,
  defaultSpaceBetweenContentOption,
  defaultSpaceBesidesPunctuationOption,
  defaultSpaceBesidesQuoteOption,
  defaultSpaceBesidesBracketOption
]

export default defaultHandlers
