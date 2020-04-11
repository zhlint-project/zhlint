#!/usr/bin/env node

const fs = require('fs')
const minimist = require('minimist')
const glob = require('glob')
const lint = require('../')
const run = require('../src/run')
const { outputValidations } = require('../src/logger')

const argv = minimist(process.argv.slice(2))

const help = () => console.log(`
This is zhlint!

Usage:
zhlint <file-path>
zhlint <file-pattern> --validate
zhlint <input-file-path> [<output-file-path>] --fix
zhlint --help
`.trim())

if (argv.h || argv.help) {
  help()
  return
}

if (argv._ && argv._.length) {
  const [inputFilepath, outputFilepath] = [...argv._]
  try {
    if (argv.validate) {
      const files = glob.sync(inputFilepath)
      const invalidFiles = []
      let errorCount = 0
      files.forEach(file => {
        console.log(`[validate] ${file}`)
        const input = fs.readFileSync(file, { encoding: 'utf8' })
        const { validations } = run(input)
        if (validations.length) {
          errorCount += validations.length
          invalidFiles.push(file)
          outputValidations(file, input, validations, console)
        }
      })
      if (invalidFiles.length) {
        console.error('Invalid files:')
        console.error('- ' + invalidFiles.join('\n- ') + '\n')
        console.error(`Found ${errorCount} ${errorCount > 1 ? 'errors' : 'error'}.`)
        process.exit(1)
      } else {
        console.log(`No error found.`)
      }
      return
    }
    console.log(`[start] ${inputFilepath}`)
    const input = fs.readFileSync(inputFilepath, { encoding: 'utf8' })
    const output = lint(input)
    if (argv.f || argv.fix) {
      fs.writeFileSync(outputFilepath || inputFilepath, output)
      console.log(`[fixed] ${outputFilepath || inputFilepath}`)
    }
    console.log(`[done] ${inputFilepath}`)
  } catch (e) {
    console.error(e)
  }
  return
}

help()
