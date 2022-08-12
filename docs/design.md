# Design

The whole process could be mainly divided into several parts:

1. parse text into tokens
1. apply rules to tokens
1. join tokens as the final string
1. output the string and warnings

## Parsing

The parsing process is aimed to convert a string in natural language (Chinese, sometimes mixed with English) into a certain structure, which is convenient to analysze and tweak.

### Hyper parsers

To support morden text formats like HTML, Markdown, etc., we need to integrate their parsers ahead. Also, we extend some other flags/marks to customize the process a little. These formats/flags/marks are:

- Markdown/HTML tags:
  - Block wrappers like paragraphs, headings, blockquotes, etc.
  - Block content like code blocks.
  - Inline wrappers like bolds, italics, links, etc.
  - Inline content like images, code, etc.
- Config flag as a HTML comment:
  - Ignore all the content: e.g. `<!-- zhlint disabled -->`.
  - Ignore some special cases: e.g. `<!-- zhlint ignore: prefix-,start,end,-suffix -->`.
- Hexo tags: e.g. `{% gist gist_id [filename] %}`.
- markdown-it-container (VuePress custom containers): e.g. `::: warning\n*here be dragons*\n:::`.

After that, an input string would be parsed into a string with several _slots_. For each slot, it can hold a piece of _plain text content_ to process further.

### Tokens

We can parse a piece of _plain text content_ into structured tokens:

- **Groups**: Usually the content wrapped by a pair of quotes. The quotes should always be paired, which means every left quote should technically have a paired right quote accordingly. A piece of _plain text content_ actually composes several nested groups. So the groups determine the whole structure of the _plain text content_.
- **Marks**: Usually a pair of brackets, not the content they wrap. The brackets should always be paired, which means every left bracket should technically have a paired right bracket accordingly. We don't track the nested structure of brackets since in real world the usage of brackets are very flexible, like a hyper format. So we just track their positions without structures.
- **Letters**: Have 2 types: half-width (English) and full-width (Chinese). Concequtive half-width letters or concequtive full-width letters can be considered as one token.
- **Punctuations**: Except quotes and brackets, have 2 types: half-width and full-width.
- **Hyper wrappers**: e.g. inline wrappers like bolds, italics, links, etc. including pairs of HTML tags.
- **Hyper content**: e.g. inline content like images, code, etc. including self-closed HTML tags.
- **Spaces**.

<!-- TODO: an example -->

**Parsing options**

- `noSinglePair: true | undefined = true`: with this option on, the parser will report if there is any unpaired quotes or brackets.
- Additionally, there is no option for that, however, for a better analysis further, the parser will treat single quotes as a letter when it's between English letters without spaces (_as a shorthand_) e.g. `what's up`.

**Simplified token types**

To simplify the structure, _we remove spaces from token types_ as a property to other tokens, since the modifications of them are always related to their tokens besides.

- For each group token, we add `innerSpaceBefore` and `spaceAfter` properties. Any of them could be an empty string or spaces.
- For other tokens, we only add `spaceAfter`. It could be an empty string or spaces.

So eventually, token have these types:

- `LETTERS_HALF`
- `LETTERS_FULL`
- `PUNCTUATION_HALF`
- `PUNCTUATION_FULL`
- `HYPER_WRAPPER`
- `HYPER_WRAPPER_BRACKET`
- `HYPER_CONTENT`
- `HYPER_CONTENT_CODE`
- `GROUP`
- `UNMATCHED`
- `UNKNOWN`

### Properties and the whole structure

Each token has these properties:

- `index`
- `length`
- `content`
- `spaceAfter`
- For groups only:
  - `startIndex`
  - `startContent`
  - `endIndex`
  - `endContent`
  - `innerSpaceBefore`

<!-- TODO: an example x2 -->

The whole structure of a piece of _plain text content_ could be parsed as:

- `tokens`: all the content as a group without quotes
- `groups`: all groups collected
- `marks`: all brackets and wrappers collected

Additionally, for further better analysis and modifications, we add these into properties:

- `modifiedType`
- `modifiedContent`
- `modifiedSpaceAfter`
- `modifiedStartContent` (groups only)
- `modifiedEndContent` (groups only)
- `modifiedInnerSpaceBeore` (groups only)
- `mark` and `markSide` (brackets and wrappers only)
- `validations`

and `errors` into the whole structure (during this phrase, we only detect unmatched quotes and brackets).

<!-- TODO: type defs -->

## Applying rules

The main jobs we are supposed to do through these rules are:

- Tweaking the width/choices of punctuations/brackets/quotes.
- Tweaking spaces around tokens.

What we do is separating the job into separated rules, and for each rule, we traverse all the tokens one-by-one and run a function:

```ts
export type Handler = (token, index, group) => void
```

At the same time, we provide several options to trigger the rules. So to write a rule, you need to specify a function:

```ts
function (options: Options) => Handler
```

### Options

We are figuring out all the requirements by several options below:

**For the whole string**

- `trimSpace`
  - Type: `true | undefined`
  - Default: `true`
  - This rule is triming spaces of the whole string.

**For hyper wrappers**

- `noSpaceInsideWrapper`
  - Type: `true | undefined`
  - Default: `true`
  - This rule is to ensure all the existing spaces should be outside hyper wrappers like `*`, `_`, `[`, `]`, etc.
  - Examples:
    - `x _ ** yyy ** _ z` should be `x _**yyy**_ z`

**For the width/choices of punctuations/brackets/quotes**

- ``halfWidthPunctuation: string? = `()` ``
- ``fullWidthPunctuation: string? = `，。：；？！“”‘’` ``
- `unifiedPunctuation: "simplified" (default) | "traditional" | undefined`

These options can format and determine punctuations to be used.

**For spaces**

- `spaceOutsideCode`
  - Type: `true | false | undefined`
  - Default: `true`
  - Examples:
    - ``xxx `foo` xxx``
    - `xxx <code>foo</code> xxx`
  - Values:
    - `true`: keep one space outside (default)
    - `false`: no space outside
    - `undefined`: do nothing, just keep the original format

Determine whether to keep a space outside code x content.

- `spaceBetweenHalfWidthLetters: true | undefined = true`
- `noSpaceBetweenFullWidthLetters: true | undefined = true`
- `spaceBetweenMixedWidthLetters: true | false | undefined = true`

Determine spaces between letters (half-width x half-width, full-width x full-width, half-width x full-width).

- `noSpaceBeforePunctuation: true | undefined = true`
- `spaceAfterHalfWidthPunctuation: true | undefined = true`
- `noSpaceAfterFullWidthPunctuation: true | undefined = true`

Determine spaces between letters and punctuations.

- `noSpaceInsideQuote: true | undefined = true`
- `spaceOutsideHalfQuote: true | false | undefined = true`
- `noSpaceOutsideFullQuote: true | undefined = true`
- `noSpaceInsideBracket: true | undefined = true`
- `spaceOutsideHalfBracket: true | false | undefined = true`
- `nospaceOutsideFullBracket: true | undefined = true`

Determine spaces besides quotes and brackets.

**For special cases**

- `skipZhUnits`
  - Type: `string?`
  - Default: `年月日天号时分秒`
  - This rule is used to skip/revert changes of spaces between numbers and Chinese units.
- `skipAbbrs`
  - Type: `string[]?`
  - Default: `['Mr.', 'Mrs.', 'Dr.', 'Jr.', 'Sr.', 'vs.', 'etc.', 'i.e.', 'e.g.', 'a.k.a.']`
  - This rule is used to skip/revert changes of dots as abbreviations.

**Other invisible special cases (potential options in the future)**

- Skip linebreaks as spaces.
- Skip HTML entities like `&xxx;` as punctuation x letters x punctuation.
- Skip half-width punctuations between half-width letters without spaces like `1,000,000`, `what's up`, etc.
- Skip successive multiple half-width punctuations like ellipsis.
- Skip letters x wrappers x letters without spaces like `letter*s*`.
- Skip successive right-half-bracket x left-half-bracket without spaces like `(a)(b)(c)`.
- Skip bracket between half-width letters without spaces like `minute(s)`, `computed()`, etc.

### Implementation

First of all, there are several types of rules:

1. punctuation width/choices
2. space tweakings
3. special cases

**For punctuation width/choices**

We achieve this via 2 rules:

- `punctuation-width` for options `halfWidthPunctuation` and `fullWidthPunctuation`
- `punctuation-unification` for option `unifiedPunctuation`

**For space tweakings**

First of all, there are some independent rules we can do ahead.

- `space-trim` for option `trimSpace`
- `space-wrapper` for option `noSpaceInsideWrapper`

For the else part, we can draw a table of token combinations to rules to guide the implementation:

| Target | L    | P    | Qo   | Qi   | Bo   | Bi   | D    | U    |
| ------ | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| L      | 1    | 2    | (4)  | (3)  | (6)  | (5)  | 7    | -    |
| P      | 2    | 2    | 2    | (3)  | 2    | (5)  | 2    | -    |
| Qo     | 4    | 2    | 4    | (3)  | (6)  | (5)  | 4    | -    |
| Qi     | 3    | 3    | 3    | 3    | 3    | 3    | 3    | 3    |
| Bo     | 6    | 2    | 6    | (3)  | 6    | (5)  | 6    | -    |
| Bi     | 5    | 5    | 5    | 5    | 5    | 5    | 5    | 5    |
| D      | 7    | 2    | (4)  | (3)  | (6)  | (5)  | 7    | -    |
| U      | -    | -    | -    | (3)  | -    | (5)  | -    | -    |

Abbreviations for tokens

- L = letters
- P = punctuations
- Qo = quotes (outer)
- Qi = quotes (inner)
- Bo = brackets (outer)
- Bi = brackets (inner)
- D = code
- U = unknown

<!-- TODO: an example -->

Abbreviations for token properties

- w = wrappers
- -w = wrappers (right side)
- w- = wrappers (left side)
- -w- = wrappers (both sides)
- s = spaces

<!-- TODO: an example -->

Abbreviations for rules

1. `space-letters`
2. `space-punctuations`
3. `space-quotes-inner`
4. `space-quotes-outer`
5. `space-brackets-inner`
6. `space-brackets-outer`
7. `space-code`

**For special cases**

Then for special cases, we put them into:

- abbrs
  - `case-abbrs` (new)
- Chinese units
  - `case-zh-unit` (new)
- linebreaks
  - `case-linebreak` (new)
- entities
  - `case-html-entity` (new)
- `what's up`
  - both `punctuations-width` and `space-punctuations`
- `ellipsis...`
  - both `punctuations-width` and `space-punctuations`
- `letter*s*`
  - `space-letters`
- `(a)(b)(c)`
  - `space-brackets-*`
- `minute(s)`
  - `space-brackets-*`

<!-- TODO: - `“)xxx(”`: `space-quotes-*` -->

## Joining and returning

After processing all the rules, it's time to join all the tokens back together as the result of a string.

1. For each piece of _plain text content_, join the tokens together as a string.
    - During this process, we read all the `modified` content and spaces instead of their original ones, except the token is under ignored scope.
2. Embed those strings back into the _slots_ and generate the final output as a string.
    - Besides the generated string, it also returns the original string and all the validation results for further usage.

## Reports

After getting the validation results, we can print them out for reports.

The type def of the validation result:

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
  // the type and content of message
  name: string
  message: string

  // position of the token
  index: number
  length: number

  // which part of the token the error comes from
  target: ValidationTarget
}

enum ValidationTarget {
  // the main content
  CONTENT
  // the space after the content
  SPACE_AFTER

  // for quotes, the left/right quote
  START_CONTENT
  END_CONTENT
  // for quotes, space after the left quote
  INNER_SPACE_BEFORE
}
```

The exported `report` function will analysze the results and print them out in terminal properly, including:

- calculate the line and column of the token
- point the error position out with a caret marker below
- count the total number of errors
- using colored output in terminal if possible

## For dev

In the source code, there is a `globalThis.__DEV__` variable which can be used to detect whether it's in the dev/debug mode. In this mode, the default output will go to:

- `./stdout.log`
- `./stderr.log`
