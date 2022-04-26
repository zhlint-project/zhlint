import { Handler } from '../parser'
import { Options } from './util'

import defaultHyperSpaceOption, { generateHandler as genHyperSpaceOption } from './hyper-space-option'
import defaultHyperSpacePosition, { generateHandler as genHyperSpacePosition } from './hyper-space-position'
import defaultPunctuationWidthOption, { generateHandler as genPunctuationWidthOption } from './punctuation-width-option'

export const generateHandlers = (options: Options): Handler[] => {
  return [
    genHyperSpaceOption(options),
    genHyperSpacePosition(),
    genPunctuationWidthOption(options)
  ]
}

const defaultHandlers: Handler[] =  [
  defaultHyperSpaceOption,
  defaultHyperSpacePosition,
  defaultPunctuationWidthOption
]

export default defaultHandlers
