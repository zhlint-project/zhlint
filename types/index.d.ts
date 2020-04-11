type Options = {
  rules: string[];
  hyperParse: string[];
  ignoredCases: IgnoredCase[];
}

type IgnoredCase = {
  prefix?: string;
  textStart: string;
  textEnd?: string;
  suffix?: string;
}

type Result = {
  file: string;
  value: string;
  validations: Validation[];
}

type Validation = {
  index: number;
  length: number;
  message: string;
}

export const run = (file: string, str: string, options: Options): string

export const report = (resultList: Result[], logger: Console): number | void
