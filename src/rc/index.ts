import { Options } from '../options.js'

import { resolve } from 'path'
import fs from 'fs'

import { env } from '../report.js'

// to walk around https://github.com/davidmyersdev/vite-plugin-node-polyfills/issues/82
const { existsSync, readFileSync } = fs || {}

type PathResult = {
  config: string | undefined
  fileIgnore: string | undefined
  caseIgnore: string | undefined
}

const DEFAULT_CONFIG_PATH = '.zhlintrc'
const DEFAULT_FILE_IGNORE_PATH = '.zhlintignore'
const DEFAULT_CASE_IGNORE_PATH = '.zhlintcaseignore'

const resolvePath = (
  dir: string,
  config: string,
  fileIgnore: string,
  caseIgnore: string,
  logger: Console = env.defaultLogger
): PathResult => {
  const result: PathResult = {
    config: undefined,
    fileIgnore: undefined,
    caseIgnore: undefined
  }

  dir = resolve(dir ?? '.')
  if (!existsSync(dir)) {
    logger.log(`"${dir}" does not exist.`)
    return result
  }

  config = resolve(dir, config ?? DEFAULT_CONFIG_PATH)
  if (existsSync(config)) {
    result.config = config
  } else {
    logger.log(
      `Config file "${config}" does not exist. Will proceed as default.`
    )
  }

  fileIgnore = resolve(dir, fileIgnore ?? DEFAULT_FILE_IGNORE_PATH)
  if (existsSync(fileIgnore)) {
    result.fileIgnore = fileIgnore
  } else {
    logger.log(
      `Global ignored cases file "${fileIgnore}" does not exist. Will proceed as none.`
    )
  }

  caseIgnore = resolve(dir, caseIgnore ?? DEFAULT_CASE_IGNORE_PATH)
  if (existsSync(caseIgnore)) {
    result.caseIgnore = caseIgnore
  } else {
    logger.log(
      `Global ignored cases file "${caseIgnore}" does not exist. Will proceed as none.`
    )
  }

  return result
}

export type Config = {
  preset?: string
  rules?: Options['rules']
  hyperParsers?: string[]
  fileIgnores?: string[]
  caseIgnores?: string[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readJSONSync = (filepath: string): any => {
  const output = readFileSync(filepath, { encoding: 'utf8' })
  return JSON.parse(output)
}

const resolveConfig = (
  normalizedConfigPath: string | undefined,
  normalizedFileIgnorePath: string | undefined,
  normalizedCaseIgnorePath: string | undefined,
  logger: Console = env.defaultLogger
): Config => {
  const result: Config = {
    preset: 'default'
  }

  if (normalizedConfigPath) {
    try {
      const config = readJSONSync(normalizedConfigPath) as Config
      if (typeof config.preset === 'string') {
        result.preset = config.preset
      }
      if (typeof config.rules === 'object') {
        result.rules = config.rules
      }
      if (Array.isArray(config.hyperParsers)) {
        result.hyperParsers = config.hyperParsers
      }
      if (Array.isArray(config.fileIgnores)) {
        result.fileIgnores = config.fileIgnores
      }
      if (Array.isArray(config.caseIgnores)) {
        result.caseIgnores = config.caseIgnores
      }
    } catch (error) {
      logger.log(
        `Failed to read "${normalizedConfigPath}": ${(error as Error).message}`
      )
    }
  }

  if (normalizedFileIgnorePath) {
    try {
      const fileIgnores = readFileSync(normalizedFileIgnorePath, {
        encoding: 'utf8'
      })
      fileIgnores
        .split(/\n/)
        .map((x) => x.trim())
        .forEach((x) => {
          if (!x) {
            return
          }
          if (!result.fileIgnores) {
            result.fileIgnores = []
          }
          if (result.fileIgnores.indexOf(x) === -1) {
            result.fileIgnores.push(x)
          }
        })
    } catch (error) {
      logger.log(
        `Failed to read "${normalizedFileIgnorePath}": ${(error as Error).message}`
      )
    }
  }

  if (normalizedCaseIgnorePath) {
    try {
      const caseIgnores = readFileSync(normalizedCaseIgnorePath, {
        encoding: 'utf8'
      })
      caseIgnores
        .split(/\n/)
        .map((x) => x.trim())
        .forEach((x) => {
          if (!x) {
            return
          }
          if (!result.caseIgnores) {
            result.caseIgnores = []
          }
          if (result.caseIgnores.indexOf(x) === -1) {
            result.caseIgnores.push(x)
          }
        })
    } catch (error) {
      logger.log(
        `Failed to read "${normalizedCaseIgnorePath}": ${(error as Error).message}`
      )
    }
  }

  return result
}

export const readRc = (
  dir: string,
  config: string,
  fileIgnore: string,
  caseIgnore: string,
  logger: Console = env.defaultLogger
): Config => {
  const {
    config: normalizedConfigPath,
    fileIgnore: normalizedFileIgnorePath,
    caseIgnore: normalizedCaseIgnorePath
  } = resolvePath(dir, config, fileIgnore, caseIgnore, logger)
  return resolveConfig(
    normalizedConfigPath,
    normalizedFileIgnorePath,
    normalizedCaseIgnorePath,
    logger
  )
}
