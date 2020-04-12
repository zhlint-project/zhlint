# zhlint

A linting tool for Chinese language.

## How to install

_WIP (not published yet, currenly can use by `npm link` on this repo)_

## Usage

### As CLI

```bash
zhlint <file-pattern>
zhlint <file-pattern> --fix
zhlint <input-file-path> --output=<output-file-path>
zhlint --help
```

### As Node.js package

```js
const { run, report } = require('zhlint')

const value = '自动在中文和English之间加入空格'
const { result, validations } = run(value)

// print '自动在中文和 English 之间加入空格''
console.log(result)

// print validation logs
report([{ file: 'foo.md', value, validations }])
```

## API

_lack documentation here_

`lint(str, rules, hyperParse, ignoredCases)`

- `str`: The text content you want to lint.
- `rules`: customize your own linting rules, could be `undefined` which means just use the default [rules](./src/rules).
- `hyperParse`: customize your own hyper parser, could be `undefined` which means just use default [Markdown parser](./src/parsers/md.js).
- `ignoredCases`: provide exception cases which you would like to skip, which follows format `{ prefix?, textStart, textEnd?, suffix? }` inspired from [W3C Scroll To Text Fragment Proposal](https://github.com/WICG/ScrollToTextFragment).

## Supported cases by default

_lack documentation here_

参考自 [Vue.js 中文官网翻译约定](https://github.com/vuejs/cn.vuejs.org/wiki)

```js
// `自动在中文和 English 之间加入空格`
lint(`自动在中文和English之间加入空格`)
// `自动将半角标点符号统一为全角标点符号，并且去掉空格。`
lint(`自动将半角标点符号统一为全角标点符号, 并且去掉空格.`)
// `为括号特殊统一为半角 (并确保外侧和其它文字之间加入空格)。`
lint(`为括号特殊统一为半角（并确保外侧和其它文字之间加入空格）。`)
// `为‘引号’保留全角/半角状态，半角 '引号' 外侧和其它文字之间加入空格。`
lint(`为‘引号’保留全角/半角状态，半角'引号'外侧和其它文字之间加入空格。`)
// `支持 [Markdown](https://en.wikipedia.org/wiki/Markdown) 语法`
lint(`支持[Markdown](https://en.wikipedia.org/wiki/Markdown)语法`)
// `统一多种引号字符：“你們要記住國父說的‘青年要立志做大事，不要做大官’這句話。”`
lint(`统一多种引号字符：「你們要記住國父說的『青年要立志做大事，不要做大官』這句話。」`)
// `特殊案例之数学公式和日期中的空格：1 + 1 = 2、8 / 4 = 2、1/2、15/02/2020`
lint(`特殊案例之数学公式和日期中的空格：1+1=2、8/4=2、1/2、15/02/2020`)
// `特殊案例之中文单位的日期中的空格：2020年2月15日`
lint(`特殊案例之中文单位的日期中的空格：2020 年 2 月 15 日`)
// `特殊案例之英文时间中的冒号：2020/2/15 12:00`
lint(`特殊案例之英文时间中的冒号：2020/2/15 12:00`)
// `可以忽略某些规则，比如：汉字和English之间需要有空格`
```

## Other features

### Customizing own linting rules

_lack documentation here_

```js
lint(`...`, ['space-full-width-content'])
lint(`...`, [(group, token, index) => {...}])
```

### Customizing own hyper parser

_lack documentation here_

```js
lint(`...`, undefined,
  str => [
    { value, start, end, marks: [...] },
    ...
  ]
)
```

### Customizing ignored cases

_lack documentation here_

```js
lint(`可以忽略某些规则，比如：汉字和English之间需要有空格`,
  undefined, undefined,
  [{ textStart: `和English之间` }]
)
```
