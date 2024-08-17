use std::{cmp::{max, min}, ops::Range};

#[derive(Debug)]
pub struct Pair {
  pub start_range: Range<usize>,
  pub start_content: String,
  pub end_range: Range<usize>,
  pub end_content: String,
}

#[derive(Debug)]
pub struct InlineMark {
  pub pair: Pair,
  pub meta: Option<String>,
  pub code: Option<String>,
}

#[derive(Debug)]
pub struct BlockMark {
  pub pair: Pair,
  pub inline_marks: Vec<InlineMark>,
}

#[derive(Debug)]
pub struct Context {
  pub str: String,
  pub blocks: Vec<BlockMark>,
  pub errors: Vec<String>,
  pub unresolved_block: Option<BlockMark>,
  pub unresolved_inlines: Vec<InlineMark>,
}

fn update_pair_range(pair: &mut Pair, range: Range<usize>) {
  if range.start >= pair.start_range.start && range.end <= pair.start_range.end {
    pair.start_range.end = min(range.start, pair.start_range.end);
    pair.end_range.start = max(range.end, pair.end_range.start);
  }
}

// TODO: Item, BlockQuote, Html

#[derive(PartialEq)]
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
      unresolved_block: None,
      unresolved_inlines: Vec::new(),
    }
  }
  pub fn handle_block(&mut self, range: Range<usize>) {
    let current_block = BlockMark {
      pair: Pair {
        start_range: range.clone(), // init the right from the max length
        start_content: String::new(), // determine when resolved
        end_range: range.clone(), // init the left from the max length
        end_content: String::new(), // determine when resolved
      },
      inline_marks: Vec::new(),
    };
    if self.unresolved_block.is_some() {
      // TODO: determine the end_range and end_content
      let unresolved_block = self.unresolved_block.take().unwrap();
      self.blocks.push(unresolved_block);
    }
    self.unresolved_block = Some(current_block);
  }
  pub fn update_unsolved_range(&mut self, range: Range<usize>) {
    if let Some(last_block) = &mut self.unresolved_block {
      update_pair_range(&mut last_block.pair, range.clone());
      for inline in &mut self.unresolved_inlines {
        update_pair_range(&mut inline.pair, range.clone());
      }
      // TODO: resolve inlines and determine the `start_content` and `end_content`
      // if `range.start` is beyond `inline.pair.end_range`
    }
  }
  pub fn handle_inline(&mut self, range: Range<usize>, inline_type: InlineType) {
    self.update_unsolved_range(range.clone());
    if let Some(_last_block) = &mut self.unresolved_block {
      // TODO:
      // 0. => update temp start_content and end_content in the range
      // 1. text: Text
      // 2. mark pair: Start(Emphasis), Start(Strong), Start(Strikethrough), Start(Link)
      //    - add to inline_marks with temp start_content and end_content
      // 3. mark pair with code: Code
      //    - add to inline_marks with full data
      // 4. single mark: Start(Image), FootnoteReference, SoftBreak, HardBreak
      //    - add to inline_marks with full data
      match inline_type {
        InlineType::Text => {
          // skip
        }
        InlineType::MarkPair => {
          let inline_mark = InlineMark {
            pair: Pair {
              start_range: range.clone(), // init the right from the max length
              start_content: String::new(), // determine when resolved
              end_range: range.clone(), // init the left from the max length
              end_content: String::new(), // determine when resolved
            },
            meta: None,
            code: None,
          };
          self.unresolved_inlines.push(inline_mark);
        }
        InlineType::MarkPairWithCode => {
          let inline_mark = InlineMark {
            pair: Pair {
              // TODO: double-check
              start_range: range.clone(),
              start_content: String::new(),
              end_range: range.clone(),
              end_content: String::new(),
            },
            meta: None,
            code: Some(String::new()),
          };
          self.unresolved_block.as_mut().unwrap().inline_marks.push(inline_mark);
        }
        InlineType::SingleMark => {
          let inline_mark = InlineMark {
            pair: Pair {
              start_range: range.clone(),
              start_content: self.str[range.clone()].to_string(),
              end_range: Range { start: range.end, end: range.end },
              end_content: String::new(),
            },
            meta: None,
            code: None,
          };
          self.unresolved_block.as_mut().unwrap().inline_marks.push(inline_mark);
        }
      }
    }
  }
}

#[derive(Debug)]
pub struct ParseResult {
  pub blocks: Vec<BlockMark>,
  pub errors: Vec<String>, // TODO: validation
}
