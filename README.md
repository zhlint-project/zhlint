# zhlint

A linting tool for Chinese text content.

## How to install

_WIP (not published yet, currenly can use by `npm link` on this repo)_

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

### As Node.js package

```js
const { run, report } = require('zhlint')

const value = '自动在中文和English之间加入空格'
const { result, validations } = run(value)

// print '自动在中文和 English 之间加入空格''
console.log(result)

// print validation report
report([{ file: 'foo.md', value, validations }])
```

And the format of validation report is more like this:

```
foo.md:1:6 - There should be a space between a half-width content and a full-width content

自动在中文和English之间加入空格
           ^
foo.md:1:13 - There should be a space between a half-width content and a full-width content

自动在中文和English之间加入空格
                  ^
Invalid files:
- foo.md

Found 2 errors.
```

#### API

- `run(str: string, options: Options): { result: string, validations: Validation[] }`: Lint a certain file.
    - `str`: The text content you want to lint.
    - `Options`: `{ rules: string[], hyperParse: string[], ignoredCases: IgnoredCase[], logger: Console }`: Customize your own rules and 
        - `rules`: customize the linting rules by their names, could be `undefined` which means just use the default [rules](./src/rules).
        - `hyperParse`: customize the hyper parser by their names, could be `undefined` which means just use default [Markdown parser](./src/parsers) and the [Hexo variables parser](./src/parsers).
        - `ignoredCases`: provide exception cases which you would like to skip, which follows a certain format inspired from [W3C Scroll To Text Fragment Proposal](https://github.com/WICG/ScrollToTextFragment).
        - `logger`: the `Console` object which would print things out about the validation report, etc. By default it would be the default `console` object.

- `report(results: Result[]): void`: Print out the validation reports for each file.
    - `results`: An array for all linted results.

- other TypeScript defs
    - `IgnoredCase`: `{ prefix?, textStart, textEnd?, suffix? }`
    - `Result`: `{ file: string, value: string, validations: Validation[] }`
    - `Validation`: `{ index: number, length: number, name: string, target: string, message: string }`

## Features

_lack documentation here_

- setup ignored cases
- markdown syntax support
- hexo template syntax support

## Supported linting rules

_lack documentation here_

<!-- ```js
lint(`可以忽略某些规则，比如：汉字和English之间需要有空格`,
  undefined, undefined,
  [{ textStart: `和English之间` }]
)
``` -->

## Reference

[The Wiki page of Vue.js Chinese website](https://github.com/vuejs/cn.vuejs.org/wiki)

## Contribute

Feel free to contribute in any way.
