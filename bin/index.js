#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import minimist from 'minimist'
import * as glob from 'glob'
import gitignore from 'ignore'
import { readRc, runWithConfig, report } from '../lib/index.js'

const helpMessage = `
This is zhlint!

Usage:
  zhlint <file-pattern>[, ...]
  zhlint --fix <file-pattern>[, ...]
  zhlint --fix=<file-pattern>
  zhlint <input-file-path> --output <output-file-path>
  zhlint <input-file-path> --output=<output-file-path>
  zhlint --help
  zhlint --version

Config arguments:

  --config <filepath>
    .zhlintrc by default

  --ignore <filepath>
  --file-ignore <filepath>
    .zhlintignore by default
  
  --case-ignore <filepath>
    .zhlintcaseignore by default

  --dir    <path>
    current directory by default

Examples:
  zhlint foo.md
  zhlint foo.md --fix
  zhlint *.md
  zhlint *.md --fix
  zhlint foo.md bar.md
  zhlint foo.md bar.md --fix
  zhlint --fix foo.md
  zhlint --fix foo.md bar.md
  zhlint --fix *.md
  zhlint --fix *.md *.txt
  zhlint --fix=foo.md
  zhlint foo.md --output dest.md
  zhlint foo.md --output=dest.md
`.trim()

const main = () => {
  const argv = minimist(process.argv.slice(2))

  const help = () => console.log(helpMessage)

  if (argv.v || argv.version) {
    console.log(require('../package.json').version)
    return
  }

  if (argv.h || argv.help) {
    help()
    return
  }

  // To support other CLI conventions like `lint-staged`.
  if (typeof argv.fix === 'string') {
    argv._.push(argv.fix)
    argv.fix = true
  }

  if (argv._ && argv._.length) {
    const filePatterns = [...argv._]
    const configDir = argv.dir || process.cwd()
    const configPath = argv.config
    const fileIgnorePath = argv.ignore || argv['file-ignore']
    const caseIgnorePath = argv['case-ignore']
    const config = readRc(configDir, configPath, fileIgnorePath, caseIgnorePath)
    const fileIgnore = gitignore().add(config.fileIgnores)
    const fileIgnoreFilter = fileIgnore.createFilter()
    try {
      // Process all file patterns
      const allFiles = new Set()
      filePatterns.forEach(pattern => {
        const files = glob.sync(pattern)
        files.forEach(file => allFiles.add(file))
      })
      
      const files = Array.from(allFiles)
      const resultList = files.filter(file => {
        // Convert absolute path to relative path for gitignore filter
        const relativePath = path.relative(configDir, file)
        return fileIgnoreFilter(relativePath)
      }).map((file) => {
        console.log(`[start] ${file}`)
        const origin = fs.readFileSync(file, { encoding: 'utf8' })
        const { result, validations } = runWithConfig(origin, config)
        return {
          file,
          origin,
          result,
          validations
        }
      })
      const exitCode = report(resultList)
      if (argv.o || argv.output) {
        if (files.length === 1) {
          const { file, result } = resultList[0]
          fs.writeFileSync(argv.o || argv.output, result)
          console.log(`[output] ${file} -> ${argv.o || argv.output}`)
        } else {
          console.error(
            `Sorry. If you use argument '--output' or '-o', you could only pass one file as the input.`
          )
        }
      } else if (argv.f || argv.fix) {
        resultList.forEach(({ file, origin, result }) => {
          if (origin !== result) {
            fs.writeFileSync(file, result)
            console.log(`[fixed] ${file}`)
          }
        })
      } else {
        if (exitCode) {
          process.exit(exitCode)
        }
      }
    } catch (e) {
      console.error(e)
    }
    return
  }

  help()
}

main()
