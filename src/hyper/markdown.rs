use markdown_context::{Context, InlineType, ParseResult};
use pulldown_cmark::{Event, Parser, Tag};

pub mod markdown_context;

pub fn parse(str: &str) -> ParseResult {
  let mut options = pulldown_cmark::Options::empty();
  options.insert(pulldown_cmark::Options::ENABLE_TABLES);
  options.insert(pulldown_cmark::Options::ENABLE_FOOTNOTES);
  options.insert(pulldown_cmark::Options::ENABLE_STRIKETHROUGH);
  options.insert(pulldown_cmark::Options::ENABLE_TASKLISTS);
  options.insert(pulldown_cmark::Options::ENABLE_SMART_PUNCTUATION);
  options.insert(pulldown_cmark::Options::ENABLE_HEADING_ATTRIBUTES);
  let parser = Parser::new_ext(str, options);
  let iter = parser.into_offset_iter();
  let mut context = Context::new(str);
  for (event, range) in iter {
    // println!("cmark event: {:?} {:?}", event, range);

    match event {
      Event::Start(tag) => {
        // block
        match tag {
          Tag::Paragraph => {
            context.handle_block(range.clone())
          }
          Tag::Heading(_, _, _) => {
            context.handle_block(range.clone())
          }
          Tag::TableCell => {
            context.handle_block(range.clone())
          }
          Tag::Item => {
            // TODO:
            // => accept inline content after TaskListMarker and till a sub-block
            // => create a temp block for each line
          }

          Tag::Emphasis => {
            context.handle_inline(range.clone(), InlineType::MarkPair)
          }
          Tag::Strong => {
            context.handle_inline(range.clone(), InlineType::MarkPair)
          }
          Tag::Strikethrough => {
            context.handle_inline(range.clone(), InlineType::MarkPair)
          }
          Tag::Link(_, _, _) => {
            context.handle_inline(range.clone(), InlineType::MarkPair)
          }
          Tag::Image(_, _, _) => {
            context.handle_inline(range.clone(), InlineType::SingleMark)
          }

          Tag::BlockQuote => {} // => Paragraph
          Tag::List(_) => {} // => Item
          Tag::Table(_) => {} // => TableCell
          Tag::TableHead => {} // => TableCell
          Tag::TableRow => {} // => TableCell

          Tag::CodeBlock(_) => {} // code => skip
          Tag::FootnoteDefinition(_) => {} // no display => skip
        }
      }
      Event::End(_tag) => {} // skip

      Event::Text(_text) => {
        context.handle_inline(range.clone(), InlineType::Text)
      }
      Event::Code(_code) => {
        context.handle_inline(range.clone(), InlineType::MarkPairWithCode)
      }
      // `[^xxx]` -> FootnoteDefinition
      Event::FootnoteReference(_reference) => {
        context.handle_inline(range.clone(), InlineType::SingleMark)
      }
      // `\n`
      Event::SoftBreak => {
        context.handle_inline(range.clone(), InlineType::SingleMark)
      }
      // `  \n`
      Event::HardBreak => {
        context.handle_inline(range.clone(), InlineType::SingleMark)
      }

      Event::Html(_html) => {
        // if in block => single mark
        context.handle_inline(range.clone(), InlineType::SingleMark)
      }

      Event::Rule => {} // skip
      Event::TaskListMarker(_checked) => {} // skip
    }
  }
  context.finalize();
  ParseResult {
    blocks: context.blocks,
    errors: context.errors,
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_parse_basic() {
    let result = parse("Hello, world!");
    println!("result: {:#?}", result);

    let result = parse("**Hello**, world!");
    println!("result: {:#?}", result);

    let result = parse("**Hello**, `world`!");
    println!("result: {:#?}", result);

    let result = parse("**Hello**, ![foo](#foo), [bar bar](#bar-bar) `world`!");
    println!("result: {:#?}", result);
  }

  #[test]
  fn test_parse_html() {
    let result = parse(r#"
### foo

hello world<s>!</s>

<em>foo</em> bar <img /> baz <img> x

<div>foo</div>

<div>foo</div> bar

baz <div>foo</div>

foo <xxx>bar</xxx> baz

<hr>

yyy
"#);
    println!("result: {:#?}", result);
  }

  #[test]
  fn test_parse_blockquote() {
    let result = parse(r#"
> hello world
> foo bar
>
> baz
"#);
    println!("result: {:#?}", result);
  }

  #[test]
  fn test_parse_list() {
      let result = parse(r#"
x

 y

- [x] foo  
  fooo
- [ ] bar
- [x] baz  
  bazzz
  - [ ] qux

  ```rust
  fn main() {
    println!("Hello, world!");
  }
  ```

  foo
"#);
    println!("result: {:#?}", result);
  }

  #[test]
  fn test_parse_list_x_html() {
    let result = parse(r#"
- foo
- <s>bar</s> bar bar
- <div>bar</div> bazz
- baz

<s>bar</s> bar bar

<div>baz</div> *bazz* bazzz
"#);
    println!("result: {:#?}", result);
  }

  #[test]
  fn test_inline_prefix() {
    let result = parse(r#"
> hello world  
> foo bar
>
> baz
"#);
    println!("result: {:#?}", result);
  }
}
