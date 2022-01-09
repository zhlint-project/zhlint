import run from './run'
import { report } from './logger'

// API
// - run(str, options): { origin, result, validations, disabled }
// - report(result[{ file, origin, validations, disabled }], logger?)

export { run, report }
