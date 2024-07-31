use std::{cell::RefCell, rc::Rc, usize::MAX};

use crate::{
  char_type::{
    get_char_type,
    CharType
  },
  token_type::{
    CommonToken,
    GroupToken,
    Mark,
    MarkType,
    MutGroupToken,
    MutableMark,
    TokenType,
    Pair,
    Token
  },
  type_trait::TypeTrait
};

pub struct ParseStatus {
  pub last_token: Option<Rc<RefCell<Token>>>,
  pub last_group: Option<Rc<RefCell<GroupToken>>>,
  pub last_mark: Option<Rc<RefCell<Mark>>>,

  pub tokens: Rc<RefCell<GroupToken>>,
  pub marks: Vec<Rc<RefCell<Mark>>>,
  pub groups: Vec<Rc<RefCell<GroupToken>>>,

  pub mark_stack: Vec<Rc<RefCell<Mark>>>,
  pub group_stack: Vec<Rc<RefCell<GroupToken>>>,

  pub errors: Vec<Rc<RefCell<String>>>, // TODO: Validation
}

pub struct ParseResult {
  pub tokens: Rc<RefCell<GroupToken>>,
  pub groups: Vec<Rc<RefCell<GroupToken>>>,
  pub marks: Vec<Rc<RefCell<Mark>>>,
  pub errors: Vec<Rc<RefCell<String>>>, // TODO: Validation
}

pub struct MutableParseResult {
  pub tokens: Rc<RefCell<MutGroupToken>>,
  pub groups: Vec<Rc<RefCell<MutGroupToken>>>,
  pub marks: Vec<Rc<RefCell<MutableMark>>>,
  pub errors: Vec<Rc<RefCell<String>>>, // TODO: Validation
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
    token_type: TokenType::Group,
    inner_space_before: String::from(""),
    children: vec![],
  };
  let tokens_rc = Rc::new(RefCell::new(tokens));
  ParseStatus {
    last_token: None,
    last_group: Some(Rc::clone(&tokens_rc)),
    last_mark: None,
  
    tokens: Rc::clone(&tokens_rc),
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
) -> Rc<RefCell<Mark>> {
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
  let mark_rc = Rc::new(RefCell::new(mark));
  status.marks.push(mark_rc.clone());
  status.last_mark = Some(mark_rc.clone());
  return mark_rc;
}

#[allow(dead_code)]
fn add_bracket_token() {}

#[allow(dead_code, unused_variables)]
fn finalize_last_token(
  status: &ParseStatus,
  index: usize
) {}

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

#[allow(dead_code, unused_variables)]
fn is_shorthand(
  str: &str,
  status: &ParseStatus,
  i: usize,
  c: char
) -> bool {
  return false;
}

#[allow(dead_code)]
fn get_hyper_content_type() {}

pub fn parse(str: &str) -> ParseResult {
  let status = create_status(str);
  for (i, c) in str.chars().enumerate() {
    let char_type = get_char_type(c);
    // if char_type is hyper!
    if char_type == CharType::Space {
      //
    } else if is_shorthand(str, &status, i, c) {
      //
    } else if char_type.is_punctuation() {
      //
    } else if char_type.is_letter() {
      //
    } else {
      //
    }
  }

  finalize_last_token(&status, str.len());

  // handle errors!

  return ParseResult {
      tokens: status.tokens,
      groups: status.groups,
      marks: status.marks,
      errors: status.errors,
  };
}

pub fn to_mutalbe_parse_result() {
  // to_mutable_token
  // to_mutable_mark
}
