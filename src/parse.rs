use std::{rc::Rc, usize::MAX};

use crate::{
  char_type::get_char_type,
  token_type::{
    CommonToken,
    GroupToken,
    GroupTokenType,
    Mark,
    MarkType,
    MutGroupToken,
    MutableMark,
    Pair,
    Token
  }
};

pub struct ParseStatus {
  pub last_token: Option<Rc<Token>>,
  pub last_group: Option<Rc<GroupToken>>,
  pub last_mark: Option<Rc<Mark>>,

  pub tokens: Rc<GroupToken>,
  pub marks: Vec<Rc<Mark>>,
  pub groups: Vec<Rc<GroupToken>>,

  pub mark_stack: Vec<Rc<Mark>>,
  pub group_stack: Vec<Rc<GroupToken>>,

  pub errors: Vec<String>, // TODO: Validation
}

pub struct ParseResult {
  pub tokens: GroupToken,
  pub groups: Vec<GroupToken>,
  pub marks: Vec<Mark>,
  pub errors: Vec<String>, // TODO: Validation
}

pub struct MutableParseResult {
  pub tokens: MutGroupToken,
  pub groups: Vec<MutGroupToken>,
  pub marks: Vec<MutableMark>,
  pub errors: Vec<String>, // TODO: Validation
}

fn create_status(str: &str) -> ParseStatus {
  let tokens: GroupToken = GroupToken {
    token: CommonToken {
      index: 0,
      length: str.len(),
      value: str.to_string(),
      space_after: String::from(""),
      mark: None,
      mark_side: None,
    },
    pair: Pair {
      start_index: 0,
      start_value: String::from(""),
      end_index: str.len(),
      end_value: String::from(""),
    },
    token_type: GroupTokenType::Group,
    inner_space_before: String::from(""),
    children: vec![],
  };
  let tokens_clone = Rc::new(tokens);
  ParseStatus {
    last_token: None,
    last_group: Some(Rc::clone(&tokens_clone)),
    last_mark: None,
  
    tokens: Rc::clone(&tokens_clone),
    marks: vec![],
    groups: vec![],
  
    mark_stack: vec![],
    group_stack: vec![],
  
    errors: vec![],
  }
}

#[allow(dead_code)]
fn create_mark(
  mut status: ParseStatus,
  index: usize,
  c: char,
  t: MarkType
) -> Rc<Mark> {
  if status.last_mark.is_some() {
    status.mark_stack.push(
      status.last_mark.unwrap()
    );
    status.last_mark = None;
  }
  let mark: Mark = Mark {
    pair: Pair {
      start_index: index,
      start_value: c.to_string(),
      end_index: MAX,
      end_value: String::from(""),
    },
    mark_type: t,
    meta: None,
  };
  let mark_clone = Rc::new(mark);
  status.marks.push(
    Rc::clone(&mark_clone)
  );
  status.last_mark = Some(
    Rc::clone(&mark_clone)
  );
  return mark_clone;
}

#[allow(dead_code)]
fn add_bracket_token() {}

#[allow(dead_code)]
fn finalize_last_token() {}

#[allow(dead_code)]
fn finalize_current_token() {}

#[allow(dead_code)]
fn finalize_current_mark() {}

#[allow(dead_code)]
fn handle_letter() {}

#[allow(dead_code)]
fn handle_punctuation() {}

// TODO:
#[allow(dead_code)]
fn mark_to_token() {}

// TODO:
#[allow(dead_code)]
fn add_hyper_token() {}

// TODO:
#[allow(dead_code)]
fn add_raw_content() {}

#[allow(dead_code)]
fn add_sinple_punctuation_token() {}

#[allow(dead_code)]
fn add_unmatched_token() {}

#[allow(dead_code)]
fn create_group() {}

#[allow(dead_code)]
fn finalize_group() {}

#[allow(dead_code)]
fn create_content() {}

#[allow(dead_code)]
fn append_value() {}

#[allow(dead_code)]
fn get_space_length() {}

#[allow(dead_code)]
fn get_prev_token() {}

#[allow(dead_code)]
fn is_shorthand() {}

#[allow(dead_code)]
fn get_hyper_content_type() {}

pub fn parse(str: &str) {
  let status = create_status(str);
  // for each char
  for c in str.chars() {
    // get_char_type
    let char_type = get_char_type(c);
    // if char_type is hyper!
    // if char_type is space
    // if char_type is shorthand
    // if char_type is punctuation
    // if char_type is letter
    // if char_type is empty
    // else
  }
  // finalize last token
  // handle errors!
  // return
}

pub fn to_mutalbe_parse_result() {
  // to_mutable_token
  // to_mutable_mark
}
