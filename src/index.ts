const run = require('./run')
const { report } = require('./logger')

// API
// - run(str, options): { origin, result, validations, disabled }
// - report(result[{ file, origin, validations, disabled }], logger?)

module.exports = {
  run,
  report
}
