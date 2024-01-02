# ![logo](docs/logo.svg) zhlint

A linting tool for Chinese text content.

## How to install

You could easily install `zhlint` through `npm` or `yarn`:

```bash
# install through npm
npm install zhlint -g

# or through yarn
yarn global add zhlint

# or through pnpm
pnpm add zhlint -g
```

## Usage

### As CLI

```bash
# glob files, lint them, and print validation report,
# and exit with code `1` if there is any error found.
zhlint <file-pattern>

# glob files and fix their all possilbly found errors.
zhlint <file-pattern> --fix

# lint the file and output fixed content into another file
zhlint <input-file-path> --output=<output-file-path>

# print usage info
zhlint --help
```

The validation report might look like this:

![](docs/screenshot-cli.png)

#### Advanced usage

zhlint also supports rc and ignore config files for custom rules:

```bash
# .zhlintrc by default
zhlint --config <filepath>

# .zhlintignore by default
zhlint --ignore <filepath>

# current directory by default
zhlint --dir <path>
```

In the config file, you can write a JSON like:

```json
{
  "preset": "default",
  "rules": {
    "adjustedFullWidthPunctuation": ""
  }
}
```

For more details, see [supported rules](#supported-rules).

In the ignore file, you can write some lines of ignored cases like:

```txt
( , )
```

For more details, see [setup ignored cases](#setup-ignored-cases).

### As Node.js package

```js
const { run, report } = require('zhlint')

const value = '自动在中文和English之间加入空格'
const options = { rules: { preset: 'default' } }
const output = run(value, options)

// print '自动在中文和 English 之间加入空格''
console.log(output.result)

// print validation report
report([output])
```

And the format of validation report is more like this:

```bash
1:6 - 此处中英文内容之间需要一个空格

自动在中文和English之间加入空格
　　　　　　^

1:13 - 此处中英文内容之间需要一个空格

自动在中文和English之间加入空格
       　　　　　　^
Invalid files:
- foo.md

Found 2 errors.
```

#### Advanced usage

zhlint also supports rc and ignore config files for custom rules:

```js
const { readRc, runWithConfig } = require('zhlint')

const value = '自动在中文和English之间加入空格'

const dir = '...' // the target directory path
const configPath = '...' // the config file path
const ignorePath = '...' // the ignore file path

const config = readRc(dir, configPath, ignorePath)
const output = runWithConfig(value, config)

// ... further actions
```

### As a standalone package

You could find a JavaScript file `dist/zhlint.js` as a standalone version. To use it, for example, you can directly add it into your browser as a `<script>` tag. Then there would be a global variable `zhlint` for you.

![](docs/screenshot-browser.png)

## API

-   `run(str: string, options?: Options): Result`: Lint a certain file.
    -   parameters:
        -   `str`: The text content you want to lint.
        -   `options`: Some options to config.
    -   returns:
        -   The result of a single piece of input string. It contains fixed text content as `value` and the infor of all `validations`.
-   `report(results: Result[], logger?: Console): void`: Print out the validation reports for each file.
    -   parameters:
        -   `results`: An array for all linted results.
        -   `logger`: The logger instance, by default it's `console` in Node.js/browser.
-   `readRc: (dir: string, config: string, ignore: string, logger?: Console) => Config`: Read config from rc file(s). For rc (run command).
-   `runWithConfig(str: string, config: Config): Result`: Lint a certain file with rc config. For rc (run command).

### Options

Customize your own linting config and other advanced options.

```ts
type Options = {
  rules?: RuleOptions
  hyperParse?: string[]
  ignoredCases?: IgnoredCase[]
  logger?: Console
}
```

-   `rules`: customize the linting config. It could be `undefined` which means linting nothing. It could be `{ preset: 'default' }` which just uses the default config. For more details of `RuleOptions`, please see [supported rules](#supported-rules)
-   `hyperParse`: customize the hyper parser by their names. It could be `undefined` which means just use default [ignored cases parser](https://github.com/Jinjiang/zhlint/tree/master/src/hypers/ignore.js), [Markdown parser](https://github.com/Jinjiang/zhlint/tree/master/src/hypers/md.js) and the [Hexo tags parser](https://github.com/Jinjiang/zhlint/tree/master/src/hypers/hexo.js).
-   `ignoredCases`: provide exception cases which you would like to skip.
    -   `IgnoredCase`: `{ prefix?, textStart, textEnd?, suffix? }`
        -   Just follows a certain format inspired from [W3C Scroll To Text Fragment Proposal](https://github.com/WICG/ScrollToTextFragment).
-   `logger`: same to the parameter in `report(...)`.

### RC Config

-   `preset`: `string` (optional)
-   `rules`: `RuleOptions` without the `preset` field. (optional)
-   `hyperParsers`: `string[]` (optional)
-   `ignores`: `string[]` and the priority is lower than `.zhlintignore`. (optional)

### Output

```ts
type Result = {
  // the basic info and availability of the file
  file?: string
  disabled: boolean

  // the original content of the file
  origin: string

  // all the error messages
  validations: Validation[]
}

type Validation = {
  message: string
  index: number
  length: number
}
```

-   `Result`
    -   `file`: The file name. It's an optional field which is only used in CLI.
    -   `origin`: the original text content.
    -   `result`: the finally fixed text content.
    -   `validations`: All the validation information.
-   `Validation`
    -   `index`: The index of the target token in the input string.
    -   `length`: The length of the target token in the input string.
    -   `message`: The description of this validation in natural language.

### Advanced usage

## Features

### Markdown syntax support

We support lint your text content in Markdown syntax by default. For example:

```js
run('自动在_中文_和**English**之间加入空格', options)
```

It will analyse the Markdown syntax first and extract the pure text content and do the lint job. After that the fixed pure text content could be replaced back to the raw Markdown string and returned as the output `value` in result.

### Hexo tags syntax support

Specially, we support [Hexo tags syntax](https://hexo.io/docs/tag-plugins) just because when we use Hexo to build Vue.js website, the markdown source files more or less include special tags like that so got the unpredictable result.

As a result, we additionally skip the Hexo-style tags by default. For example:

```js
run(
  '现在过滤器只能用在插入文本中 (`{% raw %}{{ }}{% endraw %}` tags)。',
  options
)
```

### Setup ignored cases

In some real cases we have special text contents not follow the rules by reason. So we could ues `ignoredCases` option to config that. For example we'd like to keep the spaces inside a pair of brackets, which is invalid by default. Then we could write one more line of HTML comment anywhere inside the file:

```md
<!-- the good case -->

text before (text inside) text after

<!-- the bad case -->

vm.$on( event, callback )

<!-- then we could write this down below to make it work -->
<!-- zhlint ignore: ( , ) -->
```

or just pass it through as an option:

```js
run(str, { ignoredCases: { textStart: '( ', textEnd: ' )' } })
```

If you want to ignore the whole file, you can also add this HTML comment:

```md
<!-- zhlint disabled -->
```

## Supported preproccessors (hyper parsers)

-   `ignore`: find all ignored pieces by the HTML comment `<!-- zhlint ignore: ... -->`
-   `hexo`: find all Hexo tags to avoid them being parsed.
-   `markdown`: parse by markdown syntax and find all block-level texts and inline-level marks.

## Supported rules

*Almost the rules come from the past translation experiences in [W3C Requirements for Chinese Text Layout](https://www.w3.org/International/clreq/), [W3C HTML Chinese interest group](https://www.w3.org/html/ig/zh/wiki/Main_Page) and [Vue.js Chinese docsite](https://github.com/vuejs/cn.vuejs.org/wiki).*

*... and this part might be controversial. So if you don't feel well at some point, we definitely would love to know and improve. Opening an [issue](https://github.com/jinjiang/zhlint/issues) is always welcome. Then we could discuss about the possible better option or decision.*

```ts
type RuleOptions = {
  /* PRESET */

  // Custom preset, currently only support:
  // - `'default'`
  preset?: string

  /* PUNCTUATIONS */

  // Convert these punctuations into halfwidth.
  // default preset: `()`
  // e.g. `（文字）` -> `(文字)`
  halfwidthPunctuation?: string

  // Convert these punctuations into fullwidth.
  // default preset: `，。：；？！“”‘’`
  // e.g. `文字,文字.` -> `文字，文字。`
  fullwidthPunctuation?: string

  // Treat these fullwidth punctuations as half-fullWidthPunctuation
  // when processing the spaces issues around them.
  // Since something like quotations in morder Chinese fonts are
  // only rendered in halfwidth.
  // default preset: `“”‘’`
  adjustedFullwidthPunctuation?: string

  // Convert traditional Chinese punctuations into simplified ones or vice versa.
  // default preset: `simplified`
  // e.g. `「文字」` -> `“文字”`
  //
  // besides the above, we also unify some common punctuations below:
  //
  // // U+2047 DOUBLE QUESTION MARK, U+203C DOUBLE EXCLAMATION MARK
  // // U+2048 QUESTION EXCLAMATION MARK, U+2049 EXCLAMATION QUESTION MARK
  // '？？': ['⁇'],
  // '！！': ['‼'],
  // '？！': ['⁈'],
  // '！？': ['⁉'],
  //
  // // U+002F SOLIDUS, U+FF0F FULLWIDTH SOLIDUS
  // '/': ['/', '／'],
  //
  // // U+FF5E FULLWIDTH TILDE
  // '~': ['~', '～'],
  //
  // // U+2026 HORIZONTAL ELLIPSIS, U+22EF MIDLINE HORIZONTAL ELLIPSIS
  // '…': ['…', '⋯'],
  //
  // // U+25CF BLACK CIRCLE, U+2022 BULLET, U+00B7 MIDDLE DOT,
  // // U+2027 HYPHENATION POINT, U+30FB KATAKANA MIDDLE DOT
  // '·': ['●', '•', '·', '‧', '・'],
  //
  // advanced usage: you can also specify a more detailed map like:
  //
  // ```
  // {
  //   default: true, // follow all the default preset
  //   '「': ['“', '【'], // convert `“` or `【` into `「`
  //   '」': ['”', '】'], // convert `”` or `】` into `」`
  //  '…': true, // follow the default preset for this character
  //  '·': false, // not unify any of these characters
  // }
  // ```
  unifiedPunctuation?: 'traditional' | 'simplified' | Record<string, boolean | string[]> & { default: boolean }

  // Special case: skip `fullWidthPunctuation` for abbreviations.
  // default preset:
  // `['Mr.','Mrs.','Dr.','Jr.','Sr.','vs.','etc.','i.e.','e.g.','a.k.a']`
  skipAbbrs?: string[]

  /* SPACES AROUND LETTERS */

  // default preset: `true`
  // - `true`: one space
  // - `undefined`: do nothing
  // e.g. `foo  bar` -> `foo bar`
  spaceBetweenHalfwidthContent?: boolean

  // default preset: `true`
  // - `true`: zero space
  // - `undefined`: do nothing
  // e.g. `文 字` -> `文字`
  noSpaceBetweenFullwidthContent?: boolean

  // default preset: `true`
  // - `true`: one space
  // - `false`: zero space
  // - `undefined`: do nothing
  // e.g. `文字 foo文字` -> `文字 foo 文字` (`true`)
  // e.g. `文字foo 文字` -> `文字foo文字` (`false`)
  spaceBetweenMixedwidthContent?: boolean

  // Special case: skip `spaceBetweenMixedWidthContent`
  // for numbers x Chinese units.
  // default preset: `年月日天号时分秒`
  skipZhUnits?: string

  /* SPACES AROUND PUNCTUATIONS */

  // default preset: `true`
  // - `true`: zero space
  // - `undefined`: do nothing
  // e.g. `文字 ，文字` -> `文字，文字`
  noSpaceBeforePauseOrStop?: boolean

  // default preset: `true`
  // - `true`: one space
  // - `false`: zero space
  // - `undefined`: do nothing
  // e.g. `文字,文字` -> `文字, 文字` (`true`)
  // e.g. `文字, 文字` -> `文字,文字` (`false`)
  spaceAfterHalfwidthPauseOrStop?: boolean

  // default preset: `true`
  // - `true`: zero space
  // - `undefined`: do nothing
  // e.g. `文字， 文字` -> `文字，文字`
  noSpaceAfterFullwidthPauseOrStop?: boolean

  /* SPACES AROUND QUOTES */

  // default preset: `true`
  // - `true`: one space
  // - `false`: zero space
  // - `undefined`: do nothing
  // e.g. `文字 "文字"文字` -> `文字 "文字" 文字` (`true`)
  // e.g. `文字"文字" 文字` -> `文字"文字"文字` (`false`)
  spaceOutsideHalfwidthQuotation?: boolean

  // default preset: `true`
  // - `true`: zero space
  // - `undefined`: do nothing
  // e.g. `文字 “文字” 文字` -> `文字“文字”文字`
  noSpaceOutsideFullwidthQuotation?: boolean

  // default preset: `true`
  // - `true`: zero space
  // - `undefined`: do nothing
  // e.g. `文字“ 文字 ”文字` -> `文字“文字”文字`
  noSpaceInsideQuotation?: boolean

  /* SPACES AROUND BRACKETS */

  // default preset: `true`
  // - `true`: one space
  // - `false`: zero space
  // - `undefined`: do nothing
  spaceOutsideHalfwidthBracket?: boolean

  // default preset: `true`
  // - `true`: zero space
  // - `undefined`: do nothing
  noSpaceOutsideFullwidthBracket?: boolean

  // default preset: `true`
  // - `true`: zero space
  // - `undefined`: do nothing
  noSpaceInsideBracket?: boolean

  /* SPACES AROUND CODE */

  // default preset: `true`
  // - `true`: one space
  // - `false`: zero space
  // - `undefined`: do nothing
  // e.g. '文字 `code`文字' -> '文字 `code` 文字' ('true')
  // e.g. '文字`code` 文字' -> '文字`code`文字' ('false')
  spaceOutsideCode?: boolean

  /* SPACES AROUND MARKDOWN/HTML WRAPPERS */

  // default `true`
  // - `true`: zero space
  // - `undefined`: do nothing
  // e.g. `文字** foo **文字` -> `文字 **foo** 文字`
  noSpaceInsideHyperMark?: boolean

  /* SPACES AT THE BEGINNING/END */

  // default `true`
  // e.g. ` 文字 ` -> `文字`
  trimSpace?: boolean
}
```

## More information

zhlint is now open sourced on [GitHub](https://github.com/zhlint) and [issues](https://github.com/jinjiang/zhlint/issues) welcome.
