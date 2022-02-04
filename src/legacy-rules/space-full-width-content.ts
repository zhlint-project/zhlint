// examples:
// - *a*啊 -> *a*啊 -> *a* 啊
// - *a* 啊 -> *a* 啊
// - *a *啊 -> *a* 啊
// - a*啊* -> a*啊* -> a *啊*
// - a *啊* -> a *啊*
// - a* 啊* -> a *啊*
// - *啊*a -> *啊*a -> *啊* a
// - *啊* a -> *啊* a
// - *啊 *a -> *啊* a
// - 啊*a* -> 啊*a* -> 啊 *a*
// - 啊 *a* -> 啊 *a*
// - 啊* a* -> 啊 *a*

// TODO: revamp

import { ValidationTarget } from '../report'
import {
  CharType,
  Handler,
  isContentType,
  isLegacyHyperContentType,
  MutableGroupToken as GroupToken,
  MutableToken as Token
} from '../parser'
import {
  findTokenBefore,
  findContentTokenBefore,
  findContentTokenAfter,
  findSpaceAfterHost,
  addValidation
} from './util'

const messages: Record<string, string> = {
  noSpace: 'There should be no space between 2 full-width contents.',
  oneSpace:
    'There should be a space between a half-width content and a full-width content.'
}

const validate = (token: Token, type: string, condition: boolean): void => {
  if (condition) {
    addValidation(
      token,
      'space-full-width-content',
      ValidationTarget.SPACE_AFTER,
      messages[type]
    )
  }
}

const spaceFullWidthContentHandler: Handler = (
  token: Token,
  _,
  group: GroupToken
) => {
  // - if next content width different
  //   - if there is a mark
  //     - add a space outside mark
  //   - else
  //     - add a space between
  if (!isContentType(token.type) && !isLegacyHyperContentType(token.type)) {
    return
  }

  const contentTokenAfter = findContentTokenAfter(group, token)
  const tokenBeforeContentTokenAfter = contentTokenAfter
    ? findTokenBefore(group, contentTokenAfter)
    : undefined
  const spaceAfterHost = findSpaceAfterHost(
    group,
    token,
    tokenBeforeContentTokenAfter
  )

  // same width content besides: no space
  if (contentTokenAfter && contentTokenAfter.type === token.type) {
    if (token.type === CharType.CONTENT_FULL) {
      // no space between 2 full-width content
      if (spaceAfterHost) {
        validate(spaceAfterHost, 'noSpace', !!spaceAfterHost.modifiedSpaceAfter)
        spaceAfterHost.modifiedSpaceAfter = ''
      }
    }
    return
  }
  // special case: content-hyper
  // converge before&after cases into one
  if (contentTokenAfter && isLegacyHyperContentType(contentTokenAfter.type)) {
    return
  }
  if (isLegacyHyperContentType(token.type)) {
    const contentTokenBefore = findContentTokenBefore(group, token)
    if (
      token.modifiedContent.match(/^<[^/].+\/\s*>$/) ||
      token.modifiedContent.match(/^<code.*>.*<\/code.*>$/)
    ) {
      // <.../>: nothing
    } else if (token.modifiedContent.match(/^<[^/].+>$/)) {
      // <...>: put space before if type different
      // todo: ensure spaceAfterHost
      if (
        contentTokenBefore &&
        contentTokenAfter &&
        tokenBeforeContentTokenAfter &&
        contentTokenBefore.type !== contentTokenAfter.type
      ) {
        validate(
          contentTokenBefore,
          'oneSpace',
          contentTokenBefore.modifiedSpaceAfter !== ' '
        )
        contentTokenBefore.modifiedSpaceAfter = ' '
      } else {
        if (contentTokenBefore) {
          validate(
            contentTokenBefore,
            'noSpace',
            !!contentTokenBefore.modifiedSpaceAfter
          )
          contentTokenBefore.modifiedSpaceAfter = ''
        }
      }
    } else if (token.modifiedContent.match(/^<\/.+>$/)) {
      // </...>: put space after if type different
      // todo: ensure spaceAfterHost
      if (contentTokenBefore && contentTokenAfter) {
        const spaceAfter =
          contentTokenBefore.type === contentTokenAfter.type ? '' : ' '
        if (
          spaceAfter &&
          tokenBeforeContentTokenAfter &&
          tokenBeforeContentTokenAfter.modifiedSpaceAfter !== spaceAfter
        ) {
          validate(tokenBeforeContentTokenAfter, 'oneSpace', true)
        }
        if (
          !spaceAfter &&
          tokenBeforeContentTokenAfter &&
          tokenBeforeContentTokenAfter.modifiedSpaceAfter
        ) {
          validate(tokenBeforeContentTokenAfter, 'noSpace', true)
        }
        if (tokenBeforeContentTokenAfter) {
          tokenBeforeContentTokenAfter.modifiedSpaceAfter = spaceAfter
        }
      }
    }
    return
  }
  // special case: no content after
  if (!contentTokenAfter) {
    return
  }
  // different content width
  // spaceAfterHost -> ' '
  if (spaceAfterHost) {
    validate(
      spaceAfterHost,
      'oneSpace',
      spaceAfterHost.modifiedSpaceAfter !== ' '
    )
    spaceAfterHost.modifiedSpaceAfter = ' '
  }
}

export default spaceFullWidthContentHandler
