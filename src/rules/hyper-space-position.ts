/**
 * @fileoverview
 *
 * This rule is to ensure all the existing spaces should be outside hyper
 * marks like *, _, [, ], etc.
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
  findSpaceHostInHyperMarkSeq
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

  markSeq.forEach((token) => {
    if (token === spaceHost) {
      if (token.modifiedSpaceAfter !== ' ') {
        checkOutsideSpace(token)
      }
    } else {
      if (!token.modifiedSpaceAfter) {
        checkInsideSpace(token)
      }
    }
  })
}

export const generateHandler = (): Handler => handleHyperSpacePosition

export default handleHyperSpacePosition
