import run, { Options } from '../src/run'
import { ValidationTarget } from '../src/report'
import { defaultConfig } from '../src/rules'

type Warning = {
  index: number
  target: ValidationTarget
  message: string
}

export const options: Options = {
  rules: defaultConfig
}

export const getOutput = (...args: [string, Options?]) => run(...args).result

export const lint = (
  ...args: [string, Options?]
): {
  output: string
  warnings: Warning[]
} => {
  const output = run(...args)
  return {
    output: output.result,
    warnings: output.validations.map((validation) => {
      const { index, length, target, message } = validation
      return { index: index + length, target, message }
    })
  }
}
