# Terms

## Overview

This document is to define the terms used in this project.

## Term List

There are 2 types of terms: technical terms and natural terms. e.g. quotation or book title is a natural term not a technical term while group token is a technical term.

### Basic

- char: any character in a string
- semantic structure: the structure of a string in a semantic way, it could be nested

### Tokens

- token: unit of a string to analyze
  - single token: for minimized thing to analyze

    e.g. letter, pause or stop, other punctuation, etc.

  - group token: for nested thing in semantic structures, a group token is a token that contains other tokens

    e.g. quotation, book title, etc.

#### Space

- space: usually not a token, but a property of another token before (a group) or after (any) it

  e.g. tab, space, linebreak, etc.

#### Letter

- letter: western letter (including number), CJK character, etc.

#### Punctuation

- punctuation: pause or stop | quotation or book title | bracket | other punctuation

- single punctuation: pause or stop | other punctuation

  - pause or stop: main punctuation

    e.g. comma, period, colon, semicolon, question _mark_, exclamation _mark_, etc.

  - quotation or book title: taken as strictly paired, in a nested thing, usually a group token

  - bracket: as a side note, very flexible to use, as a mark out of the semantic structure

  - other punctuation: no strict rule to use

    e.g. dashes, ellipsis, connector _marks_, interpuncts, proper noun _marks_, solidi, etc.

### Content

- normal content: letter | single punctuation
- raw content: hyper content | code content
  - hyper content: markdown thing without slots or non-code html, not to analyze further
  - code content: html code or markdown code, in a pair but not to analyze further

### Hyper Token

- hyper token: bracket mark | raw mark | raw content
- non-code visible token: letter | punctuation (or normal content | bracket mark | group)
- visible token: letter | punctuation | code content (or non-code visible token | code content)
- visibility-unknown token: hyper content

### Width

- fullwidth: western letter | halfwidth punctuation
- halfwidth: CJK character | fullwidth punctuation
- mixedwidth letter: consecutive letters with fullwidth and halfwidth mixed together

### Pairs and Marks

- pair: 2 tokens, a start and an end
- mark: a pair out of the semantic structure to analyze (bracket mark | raw mark | hyper mark)
  - bracket mark: a pir of bracket
  - hyper mark: markdown pair which has normal content in between
  - raw mark: markdown pair which has code content or hyper content in between

## Structure

general terms:

```
general type
  token type
    hyper token
      hyper content
      code content
      hyper mark
      bracket mark
      # indeterminated (addHyperToken(), technically never)
      # unmatched (bracket exception)
    group
    letter
      western
      cjk
    single punctuation
      pause or stop
      other punctuation
  non-token type
    bracket
    quotation
    space
    empty
    unknown
```

natrual terms:

```
letter
  western letter (including number)
  CJK character

punctuation
  single punctuation
    pause or stop
    other punctuation
  quotation (including book title)
  bracket
```

technical terms:

```
token
  single token
    normal content
      letter
      single punctuation
        pause or stop
        other punctuation
    hyper token
      bracket mark
      hyper mark
      hyper content
      code content
  group token

visible token
  non-code visible token
    normal content
    bracket mark
    group token
  code content
visibility-unknown token
  hyper content
invisible token?
  hyper mark

pair
  mark
  group

mark
  bracket
  hyper mark
  raw mark
```

## Examples

<!-- TODO: -->

- bracket + normal content
- hyper mark + normal content
- raw mark + raw content (hyper content | code content)
