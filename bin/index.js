#!/usr/bin/env node

const fs = require('fs')
const lint = require('../')
const minimist = require('minimist')

const argv = minimist(process.argv.slice(2))

const help = () => console.log(`
This is zhlint!

Usage:
zhlint <filepath>
zhlint --fix <input filepath> [<output filepath>]
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
