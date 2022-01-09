import { addValidation } from './util'

const replaceMap = {
  '「': '“',
  '『': '‘',
  '』': '’',
  '」': '”'
}

const messages = {
  default: ({ origin, result }) =>
    `The traditional punctuation "${origin}" should be converted into "${result}".`
}

const validate = (token, type, args) =>
  addValidation(token, 'case-traditional', type, messages.default(args))

export default (token, index, group, matched, marks) => {
  if (token.startContent && replaceMap[token.startContent]) {
    validate(token, 'startContent', {
      origin: token.startContent,
      result: replaceMap[token.startContent]
    })
    token.startContent = replaceMap[token.startContent]
  }
  if (token.endContent && replaceMap[token.endContent]) {
    validate(token, 'endContent', {
      origin: token.endContent,
      result: replaceMap[token.endContent]
    })
    token.endContent = replaceMap[token.endContent]
  }
}
