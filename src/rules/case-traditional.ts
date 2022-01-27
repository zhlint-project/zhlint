import { ValidationTarget } from '../logger'
import { GroupTokenType, Handler, MutableToken as Token } from '../parser'
import { addValidation } from './util'

const replaceMap = {
  '「': '“',
  '『': '‘',
  '』': '’',
  '」': '”'
}

type MessageOption = {
  origin: string
  result: string
}

const messages = {
  default: ({ origin, result }: MessageOption): string =>
    `The traditional punctuation "${origin}" should be converted into "${result}".`
}

const validate = (
  token: Token,
  type: ValidationTarget,
  args: MessageOption
): void =>
  addValidation(token, 'case-traditional', type, messages.default(args))

const handler: Handler = (token: Token) => {
  if (token.type === GroupTokenType.GROUP) {
    if (token.modifiedStartContent && replaceMap[token.modifiedStartContent]) {
      validate(token, ValidationTarget.START_CONTENT, {
        origin: token.modifiedStartContent,
        result: replaceMap[token.modifiedStartContent]
      })
      token.modifiedStartContent = replaceMap[token.modifiedStartContent]
    }
    if (token.modifiedEndContent && replaceMap[token.modifiedEndContent]) {
      validate(token, ValidationTarget.END_CONTENT, {
        origin: token.modifiedEndContent,
        result: replaceMap[token.modifiedEndContent]
      })
      token.modifiedEndContent = replaceMap[token.modifiedEndContent]
    }
  }
}

export default handler
