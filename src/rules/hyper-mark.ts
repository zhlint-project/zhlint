/**
 * @fileoverview
 *
 * This rule is to ensure all the existing spaces should be outside hyper
 * marks like *, _, [, ], etc.
 * 
 * Options:
 * - noSpaceInsideMark: boolean | undefined
 *
 * For example:
 * - `x ** yyy ** z` should be `x **yyy** z`
 *
 * The challenging points include:
 * - identify the side of a certain hyper mark
 * - cases with multiple hyper marks together
 * - merge existing HYPER_SPACE validations if necessary
 *
 * Note:
 * No judgement if a space should or shouldn't exist.
 */

import {
  addValidation,
  hasSpaceInHyperMarkSeq,
  findHyperMarkSeq,
  findSpaceHostInHyperMarkSeq,
  findTokenBefore,
  Options
} from './util'
import {
  Handler,
  MutableGroupToken,
  MutableToken,
  SingleTokenType
} from '../parser'
import { ValidationTarget } from '../report'
import { hyperSpace as messages, MessageType } from './messages'

const checkOutsideSpace = (token: MutableToken): void => {
  token.modifiedSpaceAfter = ' '
  addValidation(
    token,
    MessageType.HYPER_SPACE,
    ValidationTarget.SPACE_AFTER,
    messages.outside
  )
}

const checkInsideSpace = (token: MutableToken): void => {
  token.modifiedSpaceAfter = ''
  addValidation(
    token,
    MessageType.HYPER_SPACE,
    ValidationTarget.SPACE_AFTER,
    messages.inside
  )
}

const handleHyperSpacePosition: Handler = (
  token: MutableToken,
  _,
  group: MutableGroupToken
) => {
  if (token.type !== SingleTokenType.MARK_HYPER) {
    return
  }

  const markSeq = findHyperMarkSeq(group, token)
  if (token !== markSeq[0]) {
    return
  }
  if (!hasSpaceInHyperMarkSeq(group, markSeq)) {
    return
  }

  const spaceHost = findSpaceHostInHyperMarkSeq(group, markSeq)
  if (!spaceHost) {
    return
  }

  const tokenBefore = findTokenBefore(group, markSeq[0])

  if (spaceHost.modifiedSpaceAfter !== ' ') {
    checkOutsideSpace(spaceHost)
  }

  if (tokenBefore && tokenBefore !== spaceHost) {
    if (tokenBefore.modifiedSpaceAfter) {
      checkInsideSpace(tokenBefore)
    }
  }

  markSeq.forEach((token) => {
    if (token !== spaceHost && token.modifiedSpaceAfter) {
      checkInsideSpace(token)
    }
  })
}

export const generateHandler = (options: Options): Handler => {
  if (!options.noSpaceInsideMark) {
    return () => {
      // Do nothing.
    }
  }
  return handleHyperSpacePosition
}

export default generateHandler({
  noSpaceInsideMark: true
})
