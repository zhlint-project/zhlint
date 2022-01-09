import {
  findTokenBefore,
  findContentTokenBefore,
  findContentTokenAfter
} from './util'

export default (token, index, group, matched, marks) => {
  if (token.type === 'content-hyper') {
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    if (
      token.content.match(/^<(b|i|u|s|strong|em|strike|del|sub|sup)(\s.*)?>$/)
    ) {
      // <...>
      findTokenBefore(group, token).spaceAfter = ' '
    } else if (
      token.content.match(/^<\/(b|i|u|s|strong|em|strike|del|sub|sup)(\s.*)?>$/)
    ) {
      // </...>
      token.spaceAfter = ' '
    }
  }
}
