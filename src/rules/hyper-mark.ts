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
  Options,
  findExpectedVisibleTokenBefore,
  findExpectedVisibleTokenAfter,
  findMarkSeqBetween
} from './util'
import {
  Handler,
  MutableGroupToken,
  MutableToken,
  SingleTokenType
} from '../parser'

export const generateHandler = (options: Options): Handler => {
  const noSpaceInsideMarkOption = options?.noSpaceInsideMark

  return (token: MutableToken, _, group: MutableGroupToken) => {
    if (!noSpaceInsideMarkOption) {
      return
    }

    if (token.type !== SingleTokenType.MARK_HYPER) {
      return
    }

    const tokenBefore = findExpectedVisibleTokenBefore(group, token)
    const tokenAfter = findExpectedVisibleTokenAfter(group, token)
    if (tokenBefore && tokenAfter) {
      const { spaceHost, tokenSeq } = findMarkSeqBetween(
        group,
        tokenBefore,
        tokenAfter
      )
      if (spaceHost) {
        tokenSeq.forEach((target) => {
          if (target !== spaceHost) {
            if (target.modifiedSpaceAfter) {
              spaceHost.modifiedSpaceAfter = ' '
            }
            target.modifiedSpaceAfter = ''
          }
        })
      }
    }
  }
}

export default generateHandler({
  noSpaceInsideMark: true
})
