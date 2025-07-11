import { describe, test, expect } from 'vitest'
import { generateMarker } from '../src/report.js'
import chalk from 'chalk'

const EMOJI_PLACEHOLDER = String.fromCharCode(0x2B1C) // ⬜
const FULLWIDTH_SPACE = String.fromCharCode(0x3000) // 全角空格

describe('generateMarker', () => {
  test('纯英文', () => {
    expect(generateMarker('hello world', 6)).toBe('      ' + chalk.red('^'))
  })
  test('中英文混排', () => {
    expect(generateMarker('你a好', 2)).toBe(' ' + FULLWIDTH_SPACE + chalk.red('^'))
  })
  test('全角标点', () => {
    expect(generateMarker('你好，世界', 3)).toBe(FULLWIDTH_SPACE + FULLWIDTH_SPACE + FULLWIDTH_SPACE + chalk.red('^'))
  })
  test('半角标点', () => {
    expect(generateMarker('hello, world', 6)).toBe('      ' + chalk.red('^'))
  })
  test('空格', () => {
    expect(generateMarker('a b', 2)).toBe('  ' + chalk.red('^'))
  })
  // test('Tab', () => {
  //   expect(generateMarker('a\tb', 2)).toBe('  ' + chalk.red('^')) // 暂时不需要测试 Tab
  // })
  test('emoji', () => {
    expect(generateMarker('a😀b', 2)).toBe(' ' + EMOJI_PLACEHOLDER + chalk.red('^'))
  })
}) 
