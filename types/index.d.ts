// TODO: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Console = any

type Options = {
  rules?: string[]
  hyperParse?: string[]
  ignoredCases?: IgnoredCase[]
  logger?: Console
}

type IgnoredCase = {
  prefix?: string
  textStart: string
  textEnd?: string
  suffix?: string
}

type Result = {
  file?: string
  origin: string
  result: string
  validations: Validation[]
}

type Validation = {
  index: number
  length: number
  message: string
}

export function run(str: string, options?: Options): Result

export function report(resultList: Result[], logger?: Console): number | void
