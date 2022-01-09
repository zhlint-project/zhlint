import { describe, test, expect } from 'vitest'

import run from '../src/run'

const lint = (...args: [any]) => run(...args).result

describe('lint', () => {
  test('one-line raw', () => {
    expect(lint('`_x_` {% raw %}hello{% endraw %}')).toBe(
      '`_x_` {% raw %}hello{% endraw %}'
    )
  })

  test('multiline raw', () => {
    expect(lint(`{% raw %}\n<script>\n</script>\n{% endraw %}`)).toBe(
      `{% raw %}\n<script>\n</script>\n{% endraw %}`
    )
  })

  test('codeblock', () => {
    expect(
      lint(
        `{% codeblock lang:js %}\nalias： [‘/manage’ ，‘/administer’ ，‘/administrate’ ]\n{% endcodeblock %}`
      )
    ).toBe(
      `{% codeblock lang:js %}\nalias： [‘/manage’ ，‘/administer’ ，‘/administrate’ ]\n{% endcodeblock %}`
    )
  })
})
