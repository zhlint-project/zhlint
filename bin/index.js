#!/usr/bin/env node

const fs = require('fs')
const lint = require('../')
const run = require('../src/run')
const { outputValidations } = require('../src/logger')
const minimist = require('minimist')

const argv = minimist(process.argv.slice(2))

const help = () => console.log(`
This is zhlint!

Usage:
zhlint <filepath>
zhlint <filepath> --validate
zhlint <input filepath> [<output filepath>] --fix
zhlint --help
`.trim())

if (argv.h || argv.help) {
  help()
  return
}

if (argv._ && argv._.length) {
  const [inputFilepath, outputFilepath] = [...argv._]
  console.log(`[start] ${inputFilepath}`)
  try {
    const input = fs.readFileSync(inputFilepath, { encoding: 'utf8' })
    if (argv.validate) {
      const { validations } = run(input)
      if (validations.length) {
        outputValidations(input, validations, console)
        console.error(`[error] ${inputFilepath}`)
        process.exit(1)
      }
      return
    }
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
