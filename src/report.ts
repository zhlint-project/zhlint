import chalk from 'chalk'
import {
  CharType,
  checkCharType,
  isFullwidthPunctuationType,
  isHalfwidthPunctuationType
} from './parser/index.js'

export const env: {
  stdout: NodeJS.WritableStream
  stderr: NodeJS.WritableStream
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultLogger: Console
} = {
  stdout: globalThis?.process?.stdout,
  stderr: globalThis?.process?.stderr,
  defaultLogger: console
}

if (globalThis.__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Console: NativeConsole } = require('console')
  env.stdout = fs.createWriteStream('./stdout.log', { encoding: 'utf-8' })
  env.stderr = fs.createWriteStream('./stderr.log', { encoding: 'utf-8' })
  env.defaultLogger = new NativeConsole(env.stdout, env.stderr)
}

type Position = {
  offset: number
  row: number
  column: number
  line: string
}

const getPositionByOffset = (str: string, offset: number): Position => {
  const rows = str.split('\n')
  const rowLengthList = rows.map((substr) => substr.length)
  const position = {
    offset,
    row: 0,
    column: 0,
    line: ''
  }
  while (position.offset >= 0 && rows.length) {
    position.row++
    position.column = position.offset
    position.line = rows.shift() || ''
    position.offset -= (rowLengthList.shift() || 0) + 1
  }
  return position
}

export enum ValidationTarget {
  VALUE = 'value',
  START_VALUE = 'startValue',
  END_VALUE = 'endValue',
  SPACE_AFTER = 'spaceAfter',
  INNER_SPACE_BEFORE = 'innerSpaceBefore'
}

export type Validation = {
  // the type and value of message
  name: string
  message: string

  // position of the token
  index: number
  length: number

  // which part of the token the error comes from
  target: ValidationTarget
}

const adjustedFullwidthPunctuations = `“”‘’`

const generateMarker = (str: string, index: number): string => {
  const prefix = str.substring(0, index)
  let fullwidthCount = 0
  let halfwidthCount = 0
  for (let i = 0; i < prefix.length; i++) {
    const charType = checkCharType(prefix[i])
    if (
      charType === CharType.CJK_CHAR ||
      (isFullwidthPunctuationType(charType) &&
        adjustedFullwidthPunctuations.indexOf(prefix[i]) === -1)
    ) {
      fullwidthCount++
    } else if (
      charType === CharType.WESTERN_LETTER ||
      (isHalfwidthPunctuationType(charType) &&
        adjustedFullwidthPunctuations.indexOf(prefix[i]) !== -1) ||
      charType === CharType.SPACE
    ) {
      halfwidthCount++
    }
  }
  return (
    ' '.repeat(halfwidthCount) +
    '　'.repeat(fullwidthCount) +
    `${chalk.red('^')}`
  )
}

export const reportItem = (
  file: string | undefined = '',
  str: string,
  validations: Validation[],
  logger = env.defaultLogger
) => {
  validations.forEach(({ index, length, target, message }) => {
    // 0. final index and position
    const finalIndex =
      target === 'spaceAfter' || target === 'endValue' ? index + length : index
    const { row, column, line } = getPositionByOffset(str, finalIndex)

    // 1. headline
    const fileDisplay = `${chalk.blue.bgWhite(file)}${file ? ':' : ''}`
    const positionDisplay = `${chalk.yellow(row)}:${chalk.yellow(column)}`
    const headline = `${fileDisplay}${positionDisplay} - ${message}`

    // 2. display fragment
    const displayRange = 20
    const displayStart = column - displayRange < 0 ? 0 : column - displayRange
    const displayEnd =
      column + length + displayRange > line.length - 1
        ? line.length
        : column + length + displayRange
    const displayFragment = line
      .substring(displayStart, displayEnd)
      .replace(/\n/g, '\\n')

    // 3. marker below
    const markerBelow = generateMarker(displayFragment, column - displayStart)

    logger.error(`${headline}\n\n${displayFragment}\n${markerBelow}\n`)
  })
}

export type Result = {
  // the basic info and availability of the file
  file?: string
  disabled: boolean

  // the original content of the file
  origin: string

  // all the error messages
  validations: Validation[]
}

export const report = (resultList: Result[], logger = env.defaultLogger) => {
  let errorCount = 0
  const invalidFiles: string[] = []
  resultList
    .filter(({ file, disabled }) => {
      if (disabled) {
        if (file) {
          logger.log(`${chalk.blue.bgWhite(file)}: disabled`)
        } else {
          logger.log(`disabled`)
        }
        return false
      }
      return true
    })
    .forEach(({ file, origin, validations }: Result) => {
      reportItem(file, origin, validations, logger)
      errorCount += validations.length
      if (file && validations.length) {
        invalidFiles.push(file)
      }
    })
  if (errorCount) {
    const errors: string[] = []
    errors.push('Invalid files:')
    errors.push('- ' + invalidFiles.join('\n- ') + '\n')
    errors.push(`Found ${errorCount} ${errorCount > 1 ? 'errors' : 'error'}.`)
    logger.error(errors.join('\n'))
    return 1
  } else {
    logger.log(`No error found.`)
  }
}
