/**
 * @fileoverview
 *
 * This rule is used to revert changes of spaceAfter between numbers and
 * Chinese units.
 */

import {
  CharType,
  checkCharType,
  Handler,
  MutableGroupToken,
  MutableToken
} from '../parser'
import { ValidationTarget } from '../report'
import {
  findMarkSeqBetween,
  findNonHyperVisibleTokenAfter,
  findNonHyperVisibleTokenBefore,
  Options,
  removeValidationOnTarget
} from './util'

const defaultZhUnits = `年月日天号时分秒`

const generateHandler = (options: Options): Handler => {
  const noSpaceBeforeZhUnits = options?.noSpaceBeforeZhUnits || ''
  const matcherStr = noSpaceBeforeZhUnits
    .split('')
    .filter((x) => checkCharType(x) === CharType.CONTENT_FULL)
    .join('')
  const unitMatcher = new RegExp(`^[${matcherStr}]`)

  return (token: MutableToken, _: number, group: MutableGroupToken) => {
    // make sure the content is a number
    if (token.type === CharType.CONTENT_HALF && token.content.match(/^\d+$/)) {
      // make sure the content after is a Chinese unit
      const tokenAfter = findNonHyperVisibleTokenAfter(group, token)
      if (tokenAfter && tokenAfter.content.match(unitMatcher)) {
        // make sure there is no space between originally
        const { spaceHost: spaceHostAfter, tokenSeq: tokenSeqAfter } =
          findMarkSeqBetween(group, token, tokenAfter)
        const hasSpaceAfterOriginally = tokenSeqAfter.some((x) => x.spaceAfter)
        if (hasSpaceAfterOriginally) {
          return
        }

        // if any token before
        const tokenBefore = findNonHyperVisibleTokenBefore(group, token)
        if (tokenBefore) {
          // make sure there is no space between originally
          const { spaceHost: spaceHostBefore, tokenSeq: tokenSeqBefore } =
            findMarkSeqBetween(group, tokenBefore, token)
          const hasSpaceBeforeOriginally = tokenSeqBefore.some(
            (x) => x.spaceAfter
          )
          if (hasSpaceBeforeOriginally) {
            return
          }

          // revert non-space before
          if (spaceHostBefore) {
            spaceHostBefore.modifiedSpaceAfter = ''
            removeValidationOnTarget(
              spaceHostBefore,
              ValidationTarget.SPACE_AFTER
            )
          }
        }

        // revert non-space after
        if (spaceHostAfter) {
          spaceHostAfter.modifiedSpaceAfter = ''
          removeValidationOnTarget(spaceHostAfter, ValidationTarget.SPACE_AFTER)
        }
      }
    }
  }
}

export const defaultConfig: Options = {
  noSpaceBeforeZhUnits: defaultZhUnits
}

export default generateHandler
