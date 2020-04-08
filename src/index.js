const run = require('./run')
const { logger: defaultLogger, outputValidations } = require('./logger')

const lint = (str, { rules, hyperParse, ignoredCases, logger } = {}) => {
  logger = logger || defaultLogger
  const { result, validations } = run(str, rules, hyperParse, ignoredCases, logger)
  outputValidations(str, validations, logger)
  return result
}

module.exports = lint
