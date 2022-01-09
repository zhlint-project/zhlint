import chalk from 'chalk'

export const env: {
  stdout: NodeJS.WritableStream
  stderr: NodeJS.WritableStream
  defaultLogger: any
} = {
  stdout: process.stdout,
  stderr: process.stderr,
  defaultLogger: console
}

if (global.__DEV__) {
  const fs = require('fs')
  const { Console } = require('console')
  env.stdout = fs.createWriteStream('./stdout.log', { encoding: 'utf-8' })
  env.stderr = fs.createWriteStream('./stderr.log', { encoding: 'utf-8' })
  env.defaultLogger = new Console(env.stdout, env.stderr)
}

const parsePosition = (str, index) => {
  const rows = str.split('\n')
  const rowLengthList = rows.map((substr) => substr.length)
  let row = 0
  let column = 0
  let line = ''
  while (index >= 0 && rows.length) {
    row++
    column = index
    line = rows.shift()
    index -= rowLengthList.shift() + 1
  }
  return {
    offset: index,
    row,
    column,
    line
  }
}

export const reportSingleResult = (
  file,
  str,
  validations,
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
    // TODO: any
    const output: any = {
      file: `${chalk.blue.bgWhite(file || '')}${file ? ':' : ''}`,
      position: `${chalk.yellow(row)}:${chalk.yellow(column)}`,
      marker: `${chalk.black.bgBlack(
        fragment.substr(0, column - start)
      )}${chalk.red('^')}`,
      oldPosition: `${chalk.yellow(finalIndex)}`,
      oldMarker: `${' '.repeat(column - start)}${chalk.red('^')}`
    }
    output.headline = `${output.file}${output.position} - ${v.message}`
    logger.error(`${output.headline}\n\n${fragment}\n${output.marker}\n`)
  })
}

export const report = (resultList, logger = env.defaultLogger) => {
  let errorCount = 0
  const invalidFiles = []
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
    .forEach(({ file, origin, validations }) => {
      reportSingleResult(file, origin, validations, logger)
      errorCount += validations.length
      if (validations.length) {
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
