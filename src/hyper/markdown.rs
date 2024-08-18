use markdown_context::{Context, InlineType, ParseResult};
use pulldown_cmark::{Event, Parser, Tag};

pub mod markdown_context;

pub fn parse(str: &str) -> ParseResult {
  let parser = Parser::new(str);
  let iter = parser.into_offset_iter();
  let mut context = Context::new(str);
  for (event, range) in iter {
    println!("cmark event: {:?} {:?}", event, range);

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
          Tag::BlockQuote => {
            // => Paragraph with `> ` in-between
          }
          Tag::Item => {
            // => accept inline content after TaskListMarker and till a sub-block
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
        // if in block => (single or pair, code or non-code)
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
  fn test_parse() {
    let result = parse("Hello, world!");
    println!("result: {:?}", result);

    let result = parse("**Hello**, world!");
    println!("result: {:?}", result);

    let result = parse("**Hello**, `world`!");
    println!("result: {:?}", result);

    let result = parse("**Hello**, ![foo](#foo), [bar bar](#bar-bar) `world`!");
    println!("result: {:?}", result);
  }
}
