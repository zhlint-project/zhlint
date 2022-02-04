import { describe, test, expect } from 'vitest'

import run, { Options } from '../src/run'

const lint = (...args) => run(...(args as [string, Options])).result

describe('lint special/edge cases', () => {
  test('abbr', () => {
    expect(lint('运行时 + 编译器 vs. 只包含运行时')).toBe(
      '运行时 + 编译器 vs. 只包含运行时'
    )
  })
  test('URL', () => {
    expect(lint('Vue.js 是什么')).toBe('Vue.js 是什么')
    expect(lint('www.vuejs.org')).toBe('www.vuejs.org')
    expect(lint('https://vuejs.org')).toBe('https://vuejs.org')
  })
  test('slash character', () => {
    expect(lint('想知道 Vue 与其它库/框架有哪些区别')).toBe(
      '想知道 Vue 与其它库/框架有哪些区别'
    )
  })
  test('special characters', () => {
    expect(lint('Vue (读音 /vjuː/，类似于)')).toBe('Vue (读音 /vjuː/，类似于)')
  })
  test('plural brackets', () => {
    expect(lint('3 minite(s) left')).toBe('3 minite(s) left')
  })
  test('single quote for shorthand', () => {
    expect(lint(`how many user's here`)).toBe(`how many user's here`)
    expect(lint(`how many users' items here`)).toBe(
      `how many users' items here`
    )
    expect(lint(`what's going on`)).toBe(`what's going on`)
  })
  test('math exp', () => {
    expect(lint('1+1=2')).toBe('1 + 1 = 2')
    expect(lint('a|b')).toBe('a|b')
    expect(lint('a| b')).toBe('a | b')
    expect(lint('a |b')).toBe('a | b')
    expect(lint('a | b')).toBe('a | b')
    expect(lint('a||b')).toBe('a||b')
    expect(lint('a|| b')).toBe('a || b')
    expect(lint('a ||b')).toBe('a || b')
    expect(lint('a || b')).toBe('a || b')
  })
  test('arrow chars', () => {
    expect(lint('Chrome 顶部导航 > 窗口 > 任务管理')).toBe(
      'Chrome 顶部导航 > 窗口 > 任务管理'
    )
  })
  test('curly brackets', () => {
    expect(lint('# 简介 {#introduction}')).toBe('# 简介 {#introduction}')
    expect(lint('# 简介{#introduction}')).toBe('# 简介 {#introduction}')
    expect(lint('### 托管模式 {#takeover-mode}')).toBe(
      '### 托管模式 {#takeover-mode}'
    )
  })
})

describe('lint with different arguments', () => {
  test('stirng[] argument for rules', () => {
    expect(
      lint('汉字和English之间需要有空格比如 half width content。', {
        rules: ['space-full-width-content']
      })
    ).toBe('汉字和 English 之间需要有空格比如 half width content。')
  })
  test('ignored cases', () => {
    expect(
      lint('汉字和English之间需要有空格比如 half width content。', {
        ignoredCases: [{ textStart: '和English之间' }]
      })
    ).toBe('汉字和English之间需要有空格比如 half width content。')
  })
})
