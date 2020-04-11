const run = require('../src/run')

const lint = (...args) => run(...args).result

test.todo = test.skip

describe('lint', () => {
  test('one-line raw', () => {
    expect(lint('`_x_` {% raw %}hello{% endraw %}'))
      .toBe('`_x_` {% raw %}hello{% endraw %}')
  })

  test('multiline raw', () => {
    expect(lint(`{% raw %}\n<script>\n</script>\n{% endraw %}`))
      .toBe(`{% raw %}\n<script>\n</script>\n{% endraw %}`)
  })

  test('codeblock', () => {
    expect(lint(`{% codeblock lang:js %}\nalias： [‘/manage’ ，‘/administer’ ，‘/administrate’ ]\n{% endcodeblock %}`))
      .toBe(`{% codeblock lang:js %}\nalias： [‘/manage’ ，‘/administer’ ，‘/administrate’ ]\n{% endcodeblock %}`)
  })
})
