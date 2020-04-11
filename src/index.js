const run = require('./run')
const { report } = require('./logger')

// API
// - run(file, str, options): { result, validations, ignoredTokens }
// - report(result[{ file, str, validations, ignoredTokens }], logger?)

module.exports = {
  run,
  report
}
