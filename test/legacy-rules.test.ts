import { describe, test, expect } from 'vitest'

import run, { Options } from '../src/run'

import spacePunctuation from '../src/legacy-rules/space-punctuation'
import spaceBrackets from '../src/legacy-rules/space-brackets'
import spaceQuotes from '../src/legacy-rules/space-quotes'
import spaceFullWidthContent from '../src/legacy-rules/space-full-width-content'
import unifyPunctuation from '../src/legacy-rules/unify-punctuation'
import caseTraditional from '../src/legacy-rules/case-traditional'
import caseDatetime from '../src/legacy-rules/case-datetime'
import caseDatetimeZh from '../src/legacy-rules/case-datetime-zh'

const lint = (...args) => run(...(args as [string, Options])).result

describe.todo('lint by rule', () => {
  test('space between half-width content and full-width content', () => {
    expect(
      lint('汉字和English之间需要有空格比如 half width content。', {
        rules: [spaceFullWidthContent]
      })
    ).toBe('汉字和 English 之间需要有空格比如 half width content。')
  })
  test('space beside brackets', () => {
    const rules = [spaceFullWidthContent, spaceBrackets]
    expect(
      lint('汉字和Eng(lish之间)需要有空格比如 half width content。', { rules })
    ).toBe('汉字和 Eng(lish 之间) 需要有空格比如 half width content。')
    expect(
      lint('汉字和Eng（lish之间）需要有空格比如 half width content。', {
        rules
      })
    ).toBe('汉字和 Eng（lish 之间）需要有空格比如 half width content。')
    expect(
      lint(
        '汉 (字 ) 和Eng（lish之间）需（ 要）有(空格)比如 half w(i)dth content。',
        { rules }
      )
    ).toBe(
      '汉 (字) 和 Eng（lish 之间）需（要）有 (空格) 比如 half w(i)dth content。'
    )
  })
  test('unifies full-width/half-width mixed punctuation usage', () => {
    const rules = [spaceFullWidthContent, unifyPunctuation]
    expect(
      lint('汉字和English之间需要有空格比如 half width content.', { rules })
    ).toBe('汉字和 English 之间需要有空格比如 half width content。')
    expect(
      lint('汉字和"English"之间需要有空格比如 half width content.', { rules })
    ).toBe('汉字和“English”之间需要有空格比如 half width content。')
    expect(
      lint('汉字和English之间需要:有；空格比如 half width content.', { rules })
    ).toBe('汉字和 English 之间需要：有；空格比如 half width content。')
  })
  test('space beside punctuations', () => {
    expect(
      lint(
        '汉字和Engl,is。h之间,需，要有, 空， 格 ，比 , 如 half width content.',
        { rules: [spacePunctuation] }
      )
    ).toBe('汉字和Engl,is。h之间, 需，要有, 空，格，比, 如 half width content.')
  })
  test('space beside quotes', () => {
    expect(
      lint(`汉"字'和'English之间"需“要‘有’空”格比如 h'a'lf "width" content.`, {
        rules: [spaceQuotes]
      })
    ).toBe(
      `汉 "字 '和' English之间" 需“要‘有’空”格比如 h'a'lf "width" content.`
    )
  })
  test('traditional characters', () => {
    expect(
      lint(
        `老師說：「你們要記住國父說的『青年要立志做大事，不要做大官』這句話。」`,
        { rules: [caseTraditional] }
      )
    ).toBe(`老師說：“你們要記住國父說的‘青年要立志做大事，不要做大官’這句話。”`)
    expect(
      lint(
        `孔子曰：「求，周任有言曰：『陳力就列，不能則止。』危而不持，顛而不扶，則將焉用彼相矣？」`,
        { rules: [caseTraditional] }
      )
    ).toBe(
      `孔子曰：“求，周任有言曰：‘陳力就列，不能則止。’危而不持，顛而不扶，則將焉用彼相矣？”`
    )
    expect(
      lint(
        `我們雖不敢希望每個人能有范文正公「先天下之憂而憂，後天下之樂而樂」的大志向，但至少要有陶侃勤懇不懈的精神`,
        { rules: [caseTraditional] }
      )
    ).toBe(
      `我們雖不敢希望每個人能有范文正公“先天下之憂而憂，後天下之樂而樂”的大志向，但至少要有陶侃勤懇不懈的精神`
    )
    expect(
      lint(`所謂忠恕，也就是「盡己之心，推己及人」的意思。`, {
        rules: [caseTraditional]
      })
    ).toBe(`所謂忠恕，也就是“盡己之心，推己及人”的意思。`)
  })
  test('datetime', () => {
    const rules = [
      spaceFullWidthContent,
      spacePunctuation,
      caseDatetime,
      caseDatetimeZh
    ]
    expect(lint('2019年06月26号 2019-06-26 12:00', { rules })).toBe(
      '2019年06月26号 2019-06-26 12:00'
    )
  })
})
