type Options = {
  rules?: string[];
  hyperParse?: string[];
  ignoredCases?: IgnoredCase[];
  logger?: Console;
}

type IgnoredCase = {
  prefix?: string;
  textStart: string;
  textEnd?: string;
  suffix?: string;
}

type Result = {
  file?: string;
  origin: string;
  result: string;
  validations: Validation[];
}

type Validation = {
  index: number;
  length: number;
  message: string;
}

export type run = (str: string, options: Options) => Result

export type report = (resultList: Result[], logger: Console) => number | void
