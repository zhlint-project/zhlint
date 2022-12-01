import { Options } from '../options';

import { resolve, } from 'path';
import { existsSync, readFileSync, readJSONSync } from 'fs-extra';

import { env } from '../report'

type PathResult = {
  config: string | undefined
  ignore: string | undefined
}

const resolvePath = (
  dir: string,
  config: string,
  ignore: string,
  logger: Console = env.defaultLogger
): PathResult => {
  const result: PathResult = {
    config: undefined,
    ignore: undefined
  }
  dir = resolve(dir ?? '.')
  if (!existsSync(dir)) {
    logger.log(`"${dir}" does not exist.`)
    return result
  }
  config = resolve(dir, config ?? '.zhlintrc')
  if (existsSync(config)) {
    result.config = config
  } else {
    logger.log(`Config file "${config}" does not exist. Will proceed as default.`)
  }
  ignore = resolve(dir, ignore ?? '.zhlintignore')
  if (existsSync(ignore)) {
    result.ignore = ignore
  } else {
    logger.log(`Global ignored cases file "${ignore}" does not exist. Will proceed as none.`)
  }
  return result
}

export type Config = {
  preset?: string
  rules?: Options['rules']
  hyperParsers?: string[]
  ignores?: string[]
}

const resolveConfig = (
  normalizedConfigPath: string | undefined,
  normalizedIgnorePath: string | undefined,
  logger: Console = env.defaultLogger
): Config => {
  const result: Config = {
    preset: 'deafult'
  }
  if (normalizedConfigPath) {
    try {
      const config: Config = readJSONSync(normalizedConfigPath, { encoding: 'utf8' })
      if (typeof config.preset === 'string') {
        result.preset = config.preset
      }
      if (typeof config.rules === 'object') {
        result.rules = config.rules
      }
      if (Array.isArray(config.hyperParsers)) {
        result.hyperParsers = config.hyperParsers
      }
      if (Array.isArray(config.ignores)) {
        result.ignores = config.ignores
      }
    } catch (error) {
      logger.log(`Failed to read "${normalizedConfigPath}": ${(error as Error).message}`)
    }
  }
  if (normalizedIgnorePath) {
    try {
      const ignores = readFileSync(normalizedIgnorePath, { encoding: 'utf8' })
      ignores.split(/\n/).map(x => x.trim()).forEach(x => {
        if (!x) {
          return
        }
        if (!result.ignores) {
          result.ignores = []
        }
        if (result.ignores.indexOf(x) === -1) {
          result.ignores.push(x)
        } 
      })
    } catch (error) {
      logger.log(`Failed to read "${normalizedIgnorePath}": ${(error as Error).message}`)
    }
  }
  return result
}

export const readRc = (dir: string, config: string, ignore: string, logger: Console = env.defaultLogger): Config => {
  const {
    config: normalizedConfigPath,
    ignore: normalizedIgnorePath
  } = resolvePath(dir, config, ignore, logger)
  return resolveConfig(normalizedConfigPath, normalizedIgnorePath, logger)
}
