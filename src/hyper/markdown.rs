use markdown_context::ParseResult;
use pulldown_cmark::{Event, Parser, Tag};

pub mod markdown_context;

pub fn parse(str: &str) -> ParseResult {
  let parser = Parser::new(str);
  let iter = parser.into_offset_iter();
  for (event, range) in iter {
    println!("event: {:?} {:?}", event, range);

    match event {
      Event::Start(tag) => {
        // block
        match tag {
          Tag::Paragraph => {
            // new block
          }
          Tag::Heading(_, _, _) => {
            // new block
          }
          Tag::TableCell => {
            // new block
          }
          Tag::BlockQuote => {
            // => Paragraph with `> ` in-between
          }
          Tag::Item => {
            // => accept inline content after TaskListMarker and till a sub-block
          }

          Tag::Emphasis => {
            // new inline (mark pair)
          }
          Tag::Strong => {
            // new inline (mark pair)
          }
          Tag::Strikethrough => {
            // new inline (mark pair)
          }
          Tag::Link(_, _, _) => {
            // new inline (mark pair)
          }
          Tag::Image(_, _, _) => {
            // new inline (mark pair: non-code)
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
        // new inline
      }
      Event::Code(_code) => {
        // new inline (single mark: code)
      }
      // `[^xxx]` -> FootnoteDefinition
      Event::FootnoteReference(_reference) => {
        // new inline (single mark)
      }
      // `\n`
      Event::SoftBreak => {
        // new inline (single mark)
      }
      // `  \n`
      Event::HardBreak => {
        // new inline (single mark)
      }

      Event::Html(_html) => {
        // if in block => (single or pair, code or non-code)
      }

      Event::Rule => {} // skip
      Event::TaskListMarker(_checked) => {} // skip
    }
  }
  ParseResult {
    blocks: vec![],
    errors: vec![],
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_parse() {
    let result = parse("Hello, world!");
    println!("result: {:?}", result);
  }
}
