const fs = require('fs')
const { Console } = require('console')
const chalk = require('chalk')

const stdout = global.__DEV__
  ? fs.createWriteStream('./stdout.log', { encoding: 'utf-8' })
  : process.stdout

const stderr = global.__DEV__
  ? fs.createWriteStream('./stderr.log', { encoding: 'utf-8' })
  : process.stderr

const defaultLogger = global.__DEV__ ? new Console({ stdout, stderr }) : console

const parsePosition = (str, index) => {
  const rows = str.split('\n')
  const rowLengthList = rows.map(substr => substr.length)
  let row = 0
  let column = 0
  let line = ''
  while (index >= 0 && rows.length) {
    row++
    column = index
    line = rows.shift()
    index -= rowLengthList.shift()
  }
  return {
    offset: index,
    row,
    column,
    line
  }
}

const reportSingleResult = (file, str, validations, logger = defaultLogger) => {
  validations.forEach(v => {
    const { index, length } = v
    const { row, column, line } = parsePosition(str, index)
    const offset = 20
    const start = column - offset < 0 ? 0 : column - offset
    const end = column + length + offset > line.length - 1 ? line.length : column + length + offset
    const fragment = line.substring(start, end).replace(/\n/g, '\\n')
    logger.error(`${chalk.blue.bgWhite(file)}${file ? ':' : ''}${chalk.yellow(index)}:${chalk.yellow(row)}:${chalk.yellow(column)} - ${v.message}\n\n${fragment}\n${' '.repeat(column - start)}${chalk.red('^')}\n\n`)
  })
}

const report = (resultList, logger = defaultLogger) => {
  let errorCount = 0
  const invalidFiles = resultList.map(({ file, value, validations }) => {
    reportSingleResult(file, value, validations, logger)
    errorCount += validations.length
    return validations.length ? file : ''
  }).filter(Boolean)
  if (errorCount) {
    logger.error('Invalid files:')
    logger.error('- ' + invalidFiles.join('\n- ') + '\n')
    logger.error(`Found ${errorCount} ${errorCount > 1 ? 'errors' : 'error'}.`)
    return 1
  } else {
    logger.log(`No error found.`)
  }
}

module.exports = {
  defaultLogger,
  stdout,
  stderr,
  reportSingleResult,
  report
}