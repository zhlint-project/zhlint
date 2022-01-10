import chalk from 'chalk'

export const env: {
  stdout: NodeJS.WritableStream
  stderr: NodeJS.WritableStream
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultLogger: Console
} = {
  stdout: process.stdout,
  stderr: process.stderr,
  defaultLogger: console
}

if (global.__DEV__ != null) {
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

const parsePosition = (str: string, offset: number): Position => {
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
  SPACE_AFTER = 'spaceAfter',
  END_CONTENT = 'endContent'
  // TODO: more
}

export type Validation = {
  index: number
  length: number
  target: ValidationTarget
  message: string
}

type NormalizedValidation = {
  file: string
  position: string
  marker: string
  oldPosition: string
  oldMarker: string
  headline: string
}

export const reportItem = (
  file: string | null,
  str: string,
  validations: Validation[],
  logger = env.defaultLogger
) => {
  validations.forEach((v) => {
    const { index, length, target } = v
    const finalIndex =
      target === 'spaceAfter' || target === 'endContent'
        ? index + length
        : index
    const { row, column, line } = parsePosition(str, finalIndex)

    const offset = 20
    const start = column - offset < 0 ? 0 : column - offset
    const end =
      column + length + offset > line.length - 1
        ? line.length
        : column + length + offset
    const fragment = line.substring(start, end).replace(/\n/g, '\\n')

    const normalized: NormalizedValidation = {
      file: `${chalk.blue.bgWhite(file || '')}${file ? ':' : ''}`,
      position: `${chalk.yellow(row)}:${chalk.yellow(column)}`,
      marker: `${chalk.black.bgBlack(
        fragment.substring(0, column - start)
      )}${chalk.red('^')}`,
      oldPosition: `${chalk.yellow(finalIndex)}`,
      oldMarker: `${' '.repeat(column - start)}${chalk.red('^')}`,
      headline: ''
    }
    normalized.headline = `${normalized.file}${normalized.position} - ${v.message}`

    logger.error(
      `${normalized.headline}\n\n${fragment}\n${normalized.marker}\n`
    )
  })
}

export type Result = {
  file: string | null
  disabled: boolean
  origin: string
  validations: Validation[]
}

export const report = (resultList: Result[], logger = env.defaultLogger) => {
  let errorCount = 0
  const invalidFiles: string[] = []
  resultList
    .filter(({ file, disabled }) => {
      if (disabled) {
        logger.log(
          `${chalk.blue.bgWhite(file || '')}${file ? ':' : ''} disabled`
        )
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
    logger.error('Invalid files:')
    logger.error('- ' + invalidFiles.join('\n- ') + '\n')
    logger.error(`Found ${errorCount} ${errorCount > 1 ? 'errors' : 'error'}.`)
    return 1
  } else {
    logger.log(`No error found.`)
  }
}
