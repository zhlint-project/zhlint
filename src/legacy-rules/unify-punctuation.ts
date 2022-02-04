import { ValidationTarget } from '../report'
import {
  CharType,
  MutableGroupToken as GroupToken,
  GroupTokenType,
  Handler,
  MutableToken as Token,
  SingleTokenType
} from '../parser'
import {
  findTokenBefore,
  findContentTokenBefore,
  findContentTokenAfter,
  addValidation
} from './util'

type AlterMap = Record<string, string>

const halfWidthMap: AlterMap = {
  '（': `(`,
  '）': `)`
}

const fullWidthMap: AlterMap = {
  ',': `，`,
  '.': `。`,
  ';': `；`,
  ':': `：`,
  '?': `？`,
  '!': `！`
}

type MessageArgs = { origin: string; result: string }

type MessageGenerator = (args: MessageArgs) => string

const messages: Record<string, MessageGenerator> = {
  full: ({ origin, result }) =>
    `The punctuation \`${origin}\` should be full-width as \`${result}\`.`,
  half: ({ origin, result }) =>
    `The punctuation \`${origin}\` should be half-width as \`${result}\`.`,
  bracketStart: ({ origin, result }) =>
    `The left bracket \`${origin}\` should be full-width as \`${result}\`.`,
  bracketEnd: ({ origin, result }) =>
    `The right bracket \`${origin}\` should be full-width as \`${result}\`.`
}

type TargetMap = Record<string, ValidationTarget>

const targets: TargetMap = {
  full: ValidationTarget.CONTENT,
  half: ValidationTarget.CONTENT,
  bracketStart: ValidationTarget.START_CONTENT,
  bracketEnd: ValidationTarget.END_CONTENT
}

const validate = (
  token: Token,
  type: string,
  args: MessageArgs,
  condition: boolean
): void => {
  if (condition) {
    addValidation(
      token,
      'unify-punctuation',
      targets[type],
      messages[type](args)
    )
  }
}

const unifyPunctuationHandler: Handler = (
  token: Token,
  _,
  group: GroupToken
) => {
  // full-width: comma, full stop, colon, quotes
  // half-width: brackets
  // no change for half-width punctuation between half-width content without space
  if (token.type === CharType.PUNCTUATION_HALF) {
    const contentTokenBefore = findContentTokenBefore(group, token)
    const contentTokenAfter = findContentTokenAfter(group, token)
    const tokenBefore = findTokenBefore(group, token)
    const tokenBeforeContentTokenAfter = findTokenBefore(
      group,
      contentTokenAfter
    )
    if (
      contentTokenBefore &&
      contentTokenBefore.type === CharType.CONTENT_HALF &&
      !contentTokenBefore.modifiedSpaceAfter &&
      contentTokenAfter &&
      contentTokenAfter.type === CharType.CONTENT_HALF &&
      tokenBefore &&
      !tokenBefore.modifiedSpaceAfter &&
      !token.modifiedSpaceAfter &&
      tokenBeforeContentTokenAfter &&
      !tokenBeforeContentTokenAfter.modifiedSpaceAfter
    ) {
      return
    }
    if (fullWidthMap[token.modifiedContent || '']) {
      validate(
        token,
        'full',
        {
          origin: token.modifiedContent || '',
          result: fullWidthMap[token.modifiedContent || '']
        },
        true
      )
      token.modifiedType = CharType.PUNCTUATION_FULL
      token.modifiedContent = fullWidthMap[token.modifiedContent || '']
    }
  } else if (token.type === SingleTokenType.MARK_BRACKETS) {
    if (halfWidthMap[token.modifiedContent || '']) {
      validate(
        token,
        'half',
        {
          origin: token.modifiedContent || '',
          result: halfWidthMap[token.modifiedContent || '']
        },
        true
      )
      token.modifiedContent = halfWidthMap[token.modifiedContent || '']
    }
  } else if (token.type === GroupTokenType.GROUP) {
    if (token.modifiedStartContent === '"') {
      validate(
        token,
        'bracketStart',
        { origin: token.modifiedStartContent, result: '“' },
        true
      )
      token.modifiedStartContent = '“'
    }
    if (token.modifiedStartContent === "'") {
      validate(
        token,
        'bracketStart',
        { origin: token.modifiedStartContent, result: '‘' },
        true
      )
      token.modifiedStartContent = '‘'
    }
    if (token.modifiedEndContent === '"') {
      validate(
        token,
        'bracketEnd',
        { origin: token.modifiedStartContent, result: '”' },
        true
      )
      token.modifiedEndContent = '”'
    }
    if (token.modifiedEndContent === "'") {
      validate(
        token,
        'bracketEnd',
        { origin: token.modifiedStartContent, result: '’' },
        true
      )
      token.modifiedEndContent = '’'
    }
  }
}

export default unifyPunctuationHandler
