#!/usr/bin/env node

// CLI
// - validate (by default), fix, output, help

const fs = require('fs')
const minimist = require('minimist')
const glob = require('glob')
const { run, report } = require('../')

const argv = minimist(process.argv.slice(2))

const help = () => console.log(`
This is zhlint!

Usage:
zhlint <file-pattern>
zhlint <file-pattern> --fix
zhlint <input-file-path> --output=<output-file-path>
zhlint --help
`.trim())

if (argv.h || argv.help) {
  help()
  return
}

if (argv._ && argv._.length) {
  const [filePattern] = [...argv._]
  try {
    const files = glob.sync(filePattern)
    const resultList = files.map(file => {
      console.log(`[start] ${file}`)
      const origin = fs.readFileSync(file, { encoding: 'utf8' })
      const { result, validations } = run(origin)
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
        console.error(`Sorry. If you use argument '--output' or '-o', you could only pass one file as the input.`)
      }
    }
    else if (argv.f || argv.fix) {
      resultList.forEach(({ file, value, result }) => {
        if (value !== result) {
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
