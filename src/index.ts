import { run, lint } from './run'
import { report } from './report'
import { readRc } from './rc'

// API
// - run(str, options): { origin, result, validations, disabled }
// - report(result[{ file, origin, validations, disabled }], logger?)

export { run, report, readRc, lint }
