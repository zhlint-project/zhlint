import { describe, test, expect } from 'vitest'

import fs from 'fs'
import path from 'path'
import run from '../src/run.js'
import { options } from './prepare.js'

const parsePosition = (str, index) => {
  const rows = str.split('\n')
  const rowLengthList = rows.map((substr) => substr.length)
  let row = 0
  let column = 0
  let line = ''
  while (index >= 0 && rows.length) {
    row++
    column = index
    line = rows.shift()
    index -= rowLengthList.shift() + 1
  }
  return {
    offset: index,
    row,
    column,
    line
  }
}

// const expectedValidationsInfo = {
//   1: [20, 21, 26, 29],
//   3: [22, 25, 27, 34],
//   5: [20, 24, 27, 31, 35, 37, 41, 44, 47, 48, 51, 55, 58],
//   7: [],
//   9: [],
//   11: [20, 22, 25, 29, 34, 35, 39, 42, 45],
//   13: [15, 16, 17, 18, 35, 36],
//   15: [24, 53, 55, 57],
//   17: [26, 30, 37, 39, 43, 45, 48, 50, 57, 59, 66, 72],
//   19: [15, 30, 28],
//   21: [18, 25, 20, 23],
//   23: [36, 41],
//   25: [32, 35, 39, 42, 46, 48, 52, 54],
//   27: []
// }

describe('combo lint', () => {
  test('rule units', () => {
    const input = fs.readFileSync(
      path.resolve(__dirname, './example-units.md'),
      { encoding: 'utf8' }
    )
    const output = fs.readFileSync(
      path.resolve(__dirname, './example-units-fixed.md'),
      { encoding: 'utf8' }
    )
    const { result, validations, disabled } = run(input, options)
    expect(result).toBe(output)
    expect(!disabled).toBeTruthy()
    const validationsByLine = {}
    validations.forEach((v) => {
      const { index, length, target } = v
      const finalIndex =
        target === 'spaceAfter' || target === 'endValue'
          ? index + length
          : index
      const { row, column } = parsePosition(input, finalIndex)
      validationsByLine[row] = validationsByLine[row] || {}
      validationsByLine[row][column] = v
    })
    // Object.keys(expectedValidationsInfo).forEach((row) => {
    //   const info = expectedValidationsInfo[row]
    //   const lineValidations = validationsByLine[row] || {}
    //   expect(Object.keys(lineValidations).length).toBe(info.length)
    //   info.forEach((column) => expect(lineValidations[column]).toBeTruthy())
    // })
  })
  test('ignore HTML comment', () => {
    const input = fs.readFileSync(
      path.resolve(__dirname, './example-ignore.md'),
      { encoding: 'utf8' }
    )
    const { result, validations, disabled } = run(input, options)
    expect(result).toBe(input)
    expect(validations.length).toBe(0)
    expect(!disabled).toBeTruthy()
  })
  test('disabled HTML comment', () => {
    const input = fs.readFileSync(
      path.resolve(__dirname, './example-disabled.md'),
      { encoding: 'utf8' }
    )
    const { result, validations, disabled } = run(input, options)
    expect(result).toBe(input)
    expect(validations.length).toBe(0)
    expect(disabled).toBe(true)
  })
  test('support vuepress-special syntax', () => {
    const input = fs.readFileSync(
      path.resolve(__dirname, './example-vuepress.md'),
      { encoding: 'utf8' }
    )
    const output = fs.readFileSync(
      path.resolve(__dirname, './example-vuepress-fixed.md'),
      { encoding: 'utf8' }
    )
    const { result, validations } = run(input, options)
    expect(result).toBe(output)
    expect(validations.length).toBe(10)
  })
  test('vuejs guide article', () => {
    const input = fs.readFileSync(
      path.resolve(__dirname, './example-article.md'),
      { encoding: 'utf8' }
    )
    expect(run(input, options).result).toBe(input)
  })
})
