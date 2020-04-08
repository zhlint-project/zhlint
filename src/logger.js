const fs = require('fs')
const { Console } = require('console')

const stdout = global.__DEV__
  ? fs.createWriteStream('./stdout.log', { encoding: 'utf-8' })
  : process.stdout

const stderr = global.__DEV__
  ? fs.createWriteStream('./stderr.log', { encoding: 'utf-8' })
  : process.stderr

module.exports = {
  logger: new Console({ stdout, stderr }),
  stdout,
  stderr
}