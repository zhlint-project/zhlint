use std::{cmp::{max, min}, ops::Range};

#[derive(Debug)]
pub struct Pair {
  pub start_range: Range<usize>,
  pub start_content: String,
  pub end_range: Range<usize>,
  pub end_content: String,
}

#[derive(Debug, PartialEq)]
pub enum InlineType {
  Text,
  MarkPair,
  MarkPairWithCode,
  SingleMark,
}

#[derive(Debug)]
pub struct InlineMark {
  pub pair: Pair,
  pub meta: InlineType,
}

#[derive(Debug)]
pub struct BlockMark {
  pub pair: Pair,
  pub inline_marks: Vec<InlineMark>,
}

#[derive(Debug)]
pub struct Context<'a> {
  pub str: &'a str,
  pub blocks: Vec<BlockMark>,
  pub errors: Vec<String>,
  pub unresolved_block: Option<BlockMark>,
  pub cur_index: usize,
}

#[derive(PartialEq)]
enum RangeVsPair {
  Ahead,
  Inside,
  Behind,
  None,
}

fn update_pair_range(pair: &mut Pair, range: Range<usize>) -> RangeVsPair {
  if range.start >= pair.start_range.start && range.end <= pair.end_range.end {
    pair.start_range.end = min(range.start, pair.start_range.end);
    pair.end_range.start = max(range.end, pair.end_range.start);
    RangeVsPair::Inside
  } else if range.start < pair.start_range.start {
    RangeVsPair::Ahead
  } else if range.end > pair.end_range.end {
    RangeVsPair::Behind
  } else {
    RangeVsPair::None
  }
}

fn determine_pair_content(str: &str, pair: &mut Pair) {
  pair.start_content = str[pair.start_range.clone()].to_string();
  pair.end_content = str[pair.end_range.clone()].to_string();
}

// TODO: Item, BlockQuote, Html

impl<'a> Context<'a> {
  pub fn new(str: &str) -> Context {
    Context {
      str,
      blocks: Vec::new(),
      errors: Vec::new(),
      unresolved_block: None,
      cur_index: 0,
    }
  }
  pub fn get_unresolved_inlines(&mut self) -> Vec<&mut InlineMark> {
    self.unresolved_block.as_mut().map(|block| {
      block.inline_marks.iter_mut().filter(|inline|
        inline.pair.end_range.end >= self.cur_index
      ).collect()
    }).unwrap_or_default()
  }
  pub fn handle_block(&mut self, range: Range<usize>) {
    // println!("handle block {:?} {:?}", range, &self.str[range.clone()]);
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
      let mut unresolved_block = self.unresolved_block.take().unwrap();
      determine_pair_content(self.str, &mut unresolved_block.pair);
      self.blocks.push(unresolved_block);
    }
    self.unresolved_block = Some(current_block);
    // println!("context {:?}", self);
  }
  pub fn update_unresolved_range(&mut self, range: Range<usize>) {
    if let Some(last_block) = &mut self.unresolved_block {
      update_pair_range(&mut last_block.pair, range.clone());
      let str = self.str;
      let mut new_cur_index = range.end;
      for inline in self.get_unresolved_inlines() {
        if inline.meta == InlineType::MarkPair && update_pair_range(&mut inline.pair, range.clone()) == RangeVsPair::Behind {
          determine_pair_content(str, &mut inline.pair);
          new_cur_index = inline.pair.end_range.end;
        }
      }
      self.cur_index = new_cur_index;
    }
  }
  pub fn handle_inline(&mut self, range: Range<usize>, inline_type: InlineType) {
    // println!("handle inline {:?} {:?} {:?}", range, inline_type, &self.str[range.clone()]);
    // 0. => update temp start_content and end_content in the range
    // 1. text: Text
    // 2. mark pair: Start(Emphasis), Start(Strong), Start(Strikethrough), Start(Link)
    //    - add to inline_marks with temp start_content and end_content
    // 3. mark pair with code: Code
    //    - add to inline_marks with full data
    // 4. single mark: Start(Image), FootnoteReference, SoftBreak, HardBreak
    //    - add to inline_marks with full data
    self.update_unresolved_range(range.clone());
    if let Some(last_block) = &mut self.unresolved_block {
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
            meta: inline_type,
          };
          last_block.inline_marks.push(inline_mark);
        }
        InlineType::MarkPairWithCode => {
          let inline_mark = InlineMark {
            pair: Pair {
              start_range: range.clone(),
              start_content: self.str[range.clone()].to_string(),
              end_range: Range { start: range.end, end: range.end },
              end_content: String::new(),
            },
            meta: inline_type,
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
            meta: inline_type,
          };
          self.unresolved_block.as_mut().unwrap().inline_marks.push(inline_mark);
        }
      }
    }
    // println!("context {:?}", self);
  }
  pub fn finalize(&mut self) {
    if let Some(mut last_block) = self.unresolved_block.take() {
      determine_pair_content(self.str, &mut last_block.pair);
      self.blocks.push(last_block);
    }
  }
}

#[derive(Debug)]
pub struct ParseResult {
  pub blocks: Vec<BlockMark>,
  pub errors: Vec<String>, // TODO: validation
}
