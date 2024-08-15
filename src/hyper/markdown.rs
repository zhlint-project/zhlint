use pulldown_cmark::{Parser, Event};

pub struct InlineMark {
  pub start_offset: usize,
  pub start_content: String,
  pub end_offset: usize,
  pub end_content: String,
  pub meta: Option<String>,
  pub code: Option<String>,
}

pub struct BlockMark {
  pub start_offset: usize,
  pub end_offset: usize,
  pub inline_marks: Vec<InlineMark>,
}

pub struct ParseResult {
  pub blocks: Vec<BlockMark>,
  pub errors: Vec<String>, // TODO: validation
}

pub fn parse(str: &str) -> ParseResult {
  let parser = Parser::new(str);
  let iter = parser.into_offset_iter();
  for (event, range) in iter {
    println!("event: {:?} {:?}", event, range);
    match event {
      Event::Start(_tag) => {
        // block
        // inline
      }
      Event::End(_tag) => {
        // block
        // inline
      }
      Event::Text(_text) => {
        // skip
      }
      Event::Code(_code) => {
        // in block: hyper with code
        // out block: none
      }
      Event::Html(_html) => {
        // in block: hyper with non-code
        // out block: none
      }
      // `[^xxx]` -> FootnoteDefinition
      Event::FootnoteReference(_reference) => {
        // hyper without content
      }
      // `\n`
      Event::SoftBreak => {
        // hyper without content
      }
      // `  \n`
      Event::HardBreak => {
        // hyper without content
      }
      Event::Rule => {
        // skip
      }
      Event::TaskListMarker(_checked) => {
        // TODO
      }
    }
  }
  ParseResult {
    blocks: vec![],
    errors: vec![],
  }
}
