import { describe, test, expect } from 'vitest'

import run from '../src/run'
import { defaultConfig } from './rules.test'

const getOutput = (str: string) => run(str, defaultConfig).result

describe('lint', () => {
  test('one-line raw', () => {
    expect(getOutput('`_x_` {% raw %}hello{% endraw %}')).toBe(
      '`_x_` {% raw %}hello{% endraw %}'
    )
  })

  test('multiline raw', () => {
    expect(getOutput(`{% raw %}\n<script>\n</script>\n{% endraw %}`)).toBe(
      `{% raw %}\n<script>\n</script>\n{% endraw %}`
    )
  })

  test('codeblock', () => {
    expect(
      getOutput(
        `{% codeblock lang:js %}\nalias： [‘/manage’ ，‘/administer’ ，‘/administrate’ ]\n{% endcodeblock %}`
      )
    ).toBe(
      `{% codeblock lang:js %}\nalias： [‘/manage’ ，‘/administer’ ，‘/administrate’ ]\n{% endcodeblock %}`
    )
  })
})
