# Design (wip)

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

### Tokens

After that, for each piece of plain text content from the input, we can parse them into structured tokens:

- **Groups**: Usually the content wrapped by a pair of quotes. The quotes should always be paired, which means every left quote should technically have a paired right quote accordingly. A piece of plain text content actually composes several nested groups. So the groups determine the whole structure of the plain text content.
- **Marks**: Usually a pair of brackets, not the content they wrap. The brackets should always be paired, which means every left bracket should technically have a paired right bracket accordingly. We don't track the nested structure of brackets since in real world the usage of brackets are very flexible, like a hyper format. So we just track their positions without structures.
- **Letters**: Have 2 types: half-width (English) and full-width (Chinese). Concequtive half-width letters or concequtive full-width letters can be considered as one token.
- **Punctuations**: Except quotes and brackets, have 2 types: half-width and full-width.
- **Hyper wrappers**: e.g. inline wrappers like bolds, italics, links, etc.
- **Hyper content**: e.g. inline content like images, code, etc.
- **Spaces**.

<!-- TODO: an example -->

To simplify the structure, _we remove spaces from token types_ as a property to other tokens, since the modifications of them are always related to their tokens besides.

- For each group token, we add `innerSpaceBefore` and `spaceAfter` properties. Any of them could be an empty string or spaces.
- For other tokens, we only add `spaceAfter`. It could be an empty string or spaces.

So eventually, token have these types:

- `LETTERS_HALF`* (content-half)
- `LETTERS_FULL`* (content-full)
- `PUNCTUATION_HALF`
- `PUNCTUATION_FULL`
- `HYPER_WRAPPER`* (mark-hyper)
- `HYPER_WRAPPER_BRACKET`* (mark-bracket)
- `HYPER_CONTENT`* (hyper unexpected)
- `HYPER_CONTENT_CODE`* (hyper code)
- `GROUP`
- `UNMATCHED`
- `UNKNOWN`

<!--
token type
- char  content
- char  punctuation
- group quote       “”, ‘’, etc.
- mark  bracket     (), {}
- mark  hyper       [, ], *, _, etc.
- hyper unexpected  hexo/vuepress container
- hyper code        <code>xxx<code>, `xxx`

mark type
- raw -> container, code
  - unexpected
  - code
- bracket -> bracket
- hyper mark -> inline content
-->

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

<!-- TODO: an example -->

The whole structure of a piece of plain text content could be parsed as:

- `tokens`: all the content as a group without quotes
- `groups`: all groups collected
- `marks`: all brackets collected

Additionally, for further better analysis and modifications, we add these into properties:

- `modifiedType`
- `modifiedContent`
- `modifiedSpaceAfter`
- `modifiedStartContent` (groups only)
- `modifiedEndContent` (groups only)
- `modifiedInnerSpaceBeore` (groups only)
- `mark` and `markSide` (brackets only)
- `validations`

and `errors` into the whole structure (during this phrase, we only detect unmatched quotes and brackets).

<!-- TODO: type defs -->

## Applying rules

The main jobs we are supposed to do through these rules are:

- Tweaking full-width/half-width punctuations/brackets/quotes.
- Tweaking spaces.

What we do is separating our jobs into separated rules, and for each rule, we traverse all the tokens one-by-one and run a function:

```ts
export type Handler = (token, index, group) => void
```

At the same time, we provide several options to trigger the rules.

<!-- TODO: cheatsheet -->

### For the whole string

- `trimSpace`
  - Type: `boolean?`
  - Default: `true`
  - This rule is triming spaces of the whole string.

### For hyper tokens

- `spaceOutsideCode`
  - Type: `boolean?`
  - Default: `true`
  - This rule will decide whether to keep a space outside inline code with content.
  - Examples:
    - ``xxx `foo` xxx``
    - `xxx <code>foo</code> xxx`
  - Values:
    - `true`: keep one space outside (default)
    - `false`: no space outside
    - `undefined`: do nothing, just keep the original format
- `noSpaceInsideMark`
  - Type: `boolean?`
  - Default: `true`
  - This rule is to ensure all the existing spaces should be outside hyper marks like `*`, `_`, `[`, `]`, etc.
  - Examples:
    - `x _ ** yyy ** _ z` should be `x _**yyy**_ z`

### For punctuations

- ``halfWidthPunctuation: string? = `()` ``
- ``fullWidthPunctuation: string? = `，。：；？！“”‘’` ``
- `unifiedPunctuation: "simplified" (default) | "traditional" | undefined`

These options can format and determine punctuations to be used.

### For spaces

- `spaceBetweenHalfWidthLetters: boolean? = true`* (`spaceBetweenHalfWidthContent`)
- `noSpaceBetweenFullWidthLetters: boolean? = true`* (`noSpaceBetweenFullWidthContent`)
- `spaceBetweenMixedWidthLetters: boolean? = true`* (`spaceBetweenMixedWidthContent`)

Determine spaces between letters (half-width x half-width, full-width x full-width, half-width x full-width).

- `noSpaceBeforePunctuation: boolean? = true`
- `spaceAfterHalfWidthPunctuation: boolean? = true`
- `noSpaceAfterFullWidthPunctuation: boolean? = true`

Determine spaces between letters and punctuations.

- `noSpaceInsideQuote: boolean? = true`
- `spaceOutsideHalfQuote: boolean? = true`
- `noSpaceOutsideFullQuote: boolean? = true`
- `noSpaceInsideBracket: boolean? = true`
- `spaceOutsideHalfBracket: boolean? = true`
- `nospaceOutsideFullBracket: boolean? = true`

Determine spaces besides quotes and brackets.

### Special rules collection

- `skipZhUnits`
  - Type: `string?`
  - Default: `年月日天号时分秒`
  - This rule is used to skip/revert changes of `spaceAfter` between numbers and Chinese units.
- `skipAbbrs`
  - Type: `string[]?`
  - Default: `['Mr.', 'Mrs.', 'Dr.', 'Jr.', 'Sr.', 'vs.', 'etc.', 'i.e.', 'e.g.', 'a.k.a.']`
  - This rule is used to skip/revert changes of dots as abbreviations.

### The other invisible special cases

- Handle linebreaks as space properties properly.
- Skip HTML entities like `&xxx;`
- Skip successive multiple half-width punctuations.
- Skip half-width punctuations between half-width content without spaces.
- Skip half-content x marks x half-content without spaces.
- Skip right-half-bracket x left-half-bracket without spaces.
- Skip bracket between half-width content without spaces.

<!--
- [x] space-edge
  first token/last token -> trim
- [x] hyper-mark
  left-mark x left-mark -> noSpaceInsideMark ? '' : undefined
  right-mark x right-mark -> noSpaceInsideMark ? '' : undefined
  left-mark x non-mark -> noSpaceInsideMark ? '' : undefined
  non-mark x right-mark -> noSpaceInsideMark ? '' : undefined
- [x] hyper-code
  code x code, content x code, code x content -> spaceOutsideCode ? ' ' : ''
- [x] punctuation-width
- [x] punctuation-unification
- [x] space-content
  half x half -> spaceBetweenHalfWidthContent
  half x full, full x half -> spaceBetweenMixedWidthContent
  full x full -> noSpaceBetweenFullWidthContent
- [x] space-punctuation
  noSpaceBeforePunctuation
    content/right-quote/right-bracket/code x punctuation -> noSpaceBeforePunctuation
  spaceAfterHalfWidthPunctuation
    half x content/left-quote/left-bracket/code -> spaceAfterHalfWidthPunctuation
  noSpaceAfterFullWidthPunctuation
    full x content/left-quote/left-bracket/code -> noSpaceAfterFullWidthPunctuation
- [x] space-quote
  noSpaceInsideQuote
    left-quote x right-quote -> noSpaceInsideQuote
    content/punctuation/right-quote/right-bracket/code/unknown!/container x right-quote -> noSpaceInsideQuote
    left-quote x content/punctuation/left-quote/left-bracket/code/unknown/container -> noSpaceInsdieQuote
  spaceOutsideHalfQuote
    right-quote-half x left-quote-half -> spaceOutsideHalfQuote
    content/code x left-quote-half -> spaceOutsideHalfQuote
    right-quote-half x content/code
  noSpaceOutsideFullQuote
    right-quote-full x left-quote-full -> noSpaceOutsideFullQuote
    content/code x left-quote-full -> noSpaceOutsideFullQuote
    right-quote-full x content/code
- [x] space-bracket
  noSpaceInsideBracket
    left-bracket x right-bracket -> noSpaceInsideBracket
    left-bracket x content/punctuation/quote/left-bracket/code/unknown/container -> noSpaceInsideBracket
    content/punctuation/quote/right-bracket/code/unknown/container x right-bracket -> noSpaceInsideBracket
  spaceOutsideHalfBracket
    right-bracket-half x content/left-quote/left-bracket/code
    content/right-quote/code x left-bracket-half
  noSpaceOutsideFullBracket
    right-bracket-full x content/left-quote/left-bracket/code
    content/right-quote/code x left-bracket-full
-->

## Joining and returning

<!-- TODO: join and return -->

## Reports

<!-- TODO: reports -->

## For dev

- `global.__DEV__`
- `env.stdout`, `env.stderr`, and `env.defaultLogger`
