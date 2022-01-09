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

import {
  findTokenBefore,
  findTokenAfter,
  findContentTokenBefore,
  findContentTokenAfter,
  findSpaceAfterHost,
  getMarkSide,
  addValidation
} from './util'

const messages = {
  noSpace: 'There should be no space between 2 full-width contents.',
  oneSpace:
    'There should be a space between a half-width content and a full-width content.'
}

const validate = (token, type, condition) => {
  if (condition) {
    addValidation(
      token,
      'space-full-width-content',
      'spaceAfter',
      messages[type]
    )
  }
}

export default (token, index, group, matched, marks) => {
  // - if next content width different
  //   - if there is a mark
  //     - add a space outside mark
  //   - else
  //     - add a space between
  if (!token.type.match(/^content\-/)) {
    return
  }

  const tokenAfter = findTokenAfter(group, token)
  const contentTokenAfter = findContentTokenAfter(group, token)
  const tokenBeforeContentTokenAfter = contentTokenAfter
    ? findTokenBefore(group, contentTokenAfter)
    : null
  const spaceAfterHost = findSpaceAfterHost(
    group,
    token,
    tokenBeforeContentTokenAfter
  )

  // same width content besides: no space
  if (contentTokenAfter && contentTokenAfter.type === token.type) {
    if (token.type === 'content-full') {
      // no space between 2 full-width content
      if (spaceAfterHost) {
        validate(spaceAfterHost, 'noSpace', spaceAfterHost.spaceAfter)
        spaceAfterHost.spaceAfter = ''
      }
    }
    return
  }
  // special case: content-hyper
  // converge before&after cases into one
  if (contentTokenAfter && contentTokenAfter.type === 'content-hyper') {
    return
  }
  if (token.type === 'content-hyper') {
    const tokenBefore = findTokenBefore(group, token)
    const contentTokenBefore = findContentTokenBefore(group, token)
    if (
      token.content.match(/^<[^\/].+\/\s*>$/) ||
      token.content.match(/^<code.*>.*<\/code.*>$/)
    ) {
      // <.../>: nothing
    } else if (token.content.match(/^<[^\/].+>$/)) {
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
          contentTokenBefore.spaceAfter !== ' '
        )
        contentTokenBefore.spaceAfter = ' '
      } else {
        if (contentTokenBefore) {
          validate(contentTokenBefore, 'noSpace', contentTokenBefore.spaceAfter)
          contentTokenBefore.spaceAfter = ''
        }
      }
    } else if (token.content.match(/^<\/.+>$/)) {
      // </...>: put space after if type different
      // todo: ensure spaceAfterHost
      if (contentTokenBefore && contentTokenAfter) {
        const spaceAfter =
          contentTokenBefore.type === contentTokenAfter.type ? '' : ' '
        if (
          spaceAfter &&
          tokenBeforeContentTokenAfter.spaceAfter !== spaceAfter
        ) {
          validate(tokenBeforeContentTokenAfter, 'oneSpace', true)
        }
        if (!spaceAfter && tokenBeforeContentTokenAfter.spaceAfter) {
          validate(tokenBeforeContentTokenAfter, 'noSpace', true)
        }
        tokenBeforeContentTokenAfter.spaceAfter = spaceAfter
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
    validate(spaceAfterHost, 'oneSpace', spaceAfterHost.spaceAfter !== ' ')
    spaceAfterHost.spaceAfter = ' '
  }
}
