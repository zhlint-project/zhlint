const fs = require('fs')
const { Console } = require('console')

const stdout = global.__DEV__
  ? fs.createWriteStream('./stdout.log', { encoding: 'utf-8' })
  : process.stdout

const stderr = global.__DEV__
  ? fs.createWriteStream('./stderr.log', { encoding: 'utf-8' })
  : process.stderr

const outputValidations = (str, validations, logger) => {
  validations.forEach(v => {
    const { index, length } = v
    const offset = 10
    const start = index - offset < 0 ? 0 : index - offset
    const end = index + length + offset > str.length - 1 ? str.length : index + length + offset
    const fragment = str.substring(start, end)
    logger.error(`${fragment}\n${v.message}`)
  })
}

module.exports = {
  logger: new Console({ stdout, stderr }),
  stdout,
  stderr,
  outputValidations
}