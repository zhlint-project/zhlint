import { describe, test, expect } from 'vitest'

import run from '../src/run.js'
import { options } from './prepare.js'

const getOutput = (str: string) => run(str, options).result

describe('hexo lint', () => {
  test('[hexo] one-line raw', () => {
    expect(getOutput('`_x_` {% raw %}hello{% endraw %}')).toBe(
      '`_x_` {% raw %}hello{% endraw %}'
    )
  })

  test('[hexo] multiline raw', () => {
    expect(getOutput(`{% raw %}\n<script>\n</script>\n{% endraw %}`)).toBe(
      `{% raw %}\n<script>\n</script>\n{% endraw %}`
    )
  })

  test('[hexo] codeblock', () => {
    expect(
      getOutput(
        `{% codeblock lang:js %}\nalias： [‘/manage’ ，‘/administer’ ，‘/administrate’ ]\n{% endcodeblock %}`
      )
    ).toBe(
      `{% codeblock lang:js %}\nalias： [‘/manage’ ，‘/administer’ ，‘/administrate’ ]\n{% endcodeblock %}`
    )
  })
})
