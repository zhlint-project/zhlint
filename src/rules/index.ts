import { Handler } from '../parser'
import { Options } from './util'

import defaultHyperSpaceOption, { generateHandler as genHyperSpaceOption } from './hyper-space-option'
import defaultHyperSpacePosition, { generateHandler as genHyperSpacePosition } from './hyper-space-position'

export const generateHandlers = (options: Options): Handler[] => {
  return [genHyperSpaceOption(options), genHyperSpacePosition()]
}

const defaultHandlers: Handler[] =  [defaultHyperSpaceOption, defaultHyperSpacePosition]

export default defaultHandlers
