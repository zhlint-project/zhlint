use std::ops::Range;

#[derive(Debug)]
pub struct InlineMark {
  pub start_offset: usize,
  pub start_content: String,
  pub end_offset: usize,
  pub end_content: String,
  pub meta: Option<String>,
  pub code: Option<String>,
}

#[derive(Debug)]
pub struct BlockMark {
  pub start_offset: usize,
  pub end_offset: usize,
  pub inline_marks: Vec<InlineMark>,
}

#[derive(Debug)]
pub struct Context {
  pub str: String,
  pub blocks: Vec<BlockMark>,
  pub errors: Vec<String>,
  pub last_inline_offset: usize,
}

// TODO: Item, BlockQuote, Html

pub enum InlineType {
  Text,
  MarkPair,
  MarkPairWithCode,
  SingleMark,
}

impl Context {
  pub fn new(str: &str) -> Context {
    Context {
      str: str.to_string(),
      blocks: Vec::new(),
      errors: Vec::new(),
      last_inline_offset: 0,
    }
  }
  pub fn handle_block(&mut self, range: Range<usize>) {
    self.blocks.push(BlockMark {
      start_offset: range.start,
      end_offset: range.end,
      inline_marks: Vec::new(),
    });
    self.last_inline_offset = range.start;
  }
  pub fn handle_inline(&mut self, range: Range<usize>, _inline_type: InlineType) {
    let _last_block = self.blocks.last_mut().unwrap();
    // TODO:
    // 0. => update temp start_content and end_content in the range
    // 1. text: Text
    // 2. mark pair: Start(Emphasis), Start(Strong), Start(Strikethrough), Start(Link)
    //    - add to inline_marks with temp start_content and end_content
    // 3. mark pair with code: Code
    //    - add to inline_marks with full data
    // 4. single mark: Start(Image), FootnoteReference, SoftBreak, HardBreak
    //    - add to inline_marks with full data
    let _inline_mark = InlineMark {
      start_offset: range.start,
      start_content: String::new(),
      end_offset: range.end,
      end_content: String::new(),
      meta: None,
      code: None,
    };
  }
}

#[derive(Debug)]
pub struct ParseResult {
  pub blocks: Vec<BlockMark>,
  pub errors: Vec<String>, // TODO: validation
}
