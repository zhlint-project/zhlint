use std::{cell::RefCell, rc::Rc};

use regex::Regex;

use crate::{
  char_type::{get_char_type, CharType},
  token_type::{
    CommonToken, GroupTokenExtra, HyperTokenType, Mark, MarkSideType, MarkType, MutToken, Token, TokenExtraType, TokenType
  }, type_trait::char_type_to_token_type,
};

pub struct ParseStatus {
  pub last_token: Option<Rc<RefCell<Token>>>,
  pub last_group: Option<Rc<RefCell<Token>>>,
  pub last_mark: Option<Rc<RefCell<Mark>>>,

  pub tokens: Rc<RefCell<Token>>,
  pub marks: Vec<Rc<RefCell<Mark>>>,
  pub groups: Vec<Rc<RefCell<Token>>>,

  pub mark_stack: Vec<Rc<RefCell<Mark>>>,
  pub group_stack: Vec<Rc<RefCell<Token>>>,

  pub errors: Vec<Rc<RefCell<String>>>, // TODO: Validation
}

pub struct ParseResult {
  pub tokens: Rc<RefCell<Token>>,
  pub groups: Vec<Rc<RefCell<Token>>>,
  pub marks: Vec<Rc<RefCell<Mark>>>,
  pub errors: Vec<Rc<RefCell<String>>>, // TODO: Validation
}

pub struct MutableParseResult {
  pub tokens: Rc<RefCell<MutToken>>,
  pub groups: Vec<Rc<RefCell<MutToken>>>,
  pub marks: Vec<Rc<RefCell<Mark>>>,
  pub errors: Vec<Rc<RefCell<String>>>, // TODO: Validation
}

pub fn create_status(str: &str) -> ParseStatus {
  let tokens = Token {
    base: CommonToken {
      token_type: TokenType::Group,
      index: 0,
      length: str.len(),
      value: str.to_string(),
      space_after: String::from(""),
      mark: None,
      mark_side: None,
    },
    extra: TokenExtraType::Group(GroupTokenExtra {
      start_index: 0,
      start_value: String::from(""),
      end_index: str.len(),
      end_value: String::from(""),
      inner_space_before: String::from(""),
      children: vec![],
    }),
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

pub fn init_mark(
  mut status: ParseStatus,
  t: MarkType
) {
  if status.last_mark.is_some() {
    status.mark_stack.push(
      status.last_mark.unwrap()
    );
    status.last_mark = None;
  }
  let mark: Mark = Mark {
    mark_type: t,
    meta: None,
  };
  let mark_rc = Rc::new(RefCell::new(mark));
  status.marks.push(mark_rc.clone());
  status.last_mark = Some(mark_rc.clone());
}

pub fn add_bracket_token(
  status: &mut ParseStatus,
  index: usize,
  c: char,
  mark_side: MarkSideType
) {
  let token = Token {
    base: CommonToken {
      token_type: TokenType::BracketMark,
      index,
      length: 1,
      value: c.to_string(),
      space_after: String::from(""),
      mark: status.last_mark.clone(),
      mark_side: Some(mark_side),
    },
    extra: TokenExtraType::Single,
  };
  let token_rc = Rc::new(RefCell::new(token));
  finalize_current_token(status, token_rc);
}

pub fn finalize_last_token(
  status: &mut ParseStatus,
  index: usize
) {
  let last_token = status.last_token.as_ref();
  if last_token.is_some() {
    let last_token_value = last_token.unwrap();
    {
      let mut last_token_value_borrowed = last_token_value.borrow_mut();
      last_token_value_borrowed.base.length = index - last_token_value_borrowed.base.index;
    }
    let appended_token = last_token_value.clone();
    finalize_current_token(status, appended_token);
  }
}

pub fn finalize_current_token(
  status: &mut ParseStatus,
  token: Rc<RefCell<Token>>
) {
  let last_group = status.last_group.as_ref();
  if last_group.is_some() {
    let last_group_value = last_group.unwrap();
    match last_group_value.borrow_mut().extra {
      TokenExtraType::Group(ref mut extra) => {
        extra.children.push(token);
      },
      _ => {}
    }
  }
  status.last_token = None;
}

pub fn finalize_current_mark(
  status: &mut ParseStatus,
  // index: usize,
  // c: char
) {
  let last_mark = status.last_mark.as_ref();
  if last_mark.is_some() {
    // let mut last_mark_value = last_mark.unwrap().borrow_mut();
    // last_mark_value.end_index = index;
    // last_mark_value.end_value = c.to_string();
    if status.mark_stack.len() > 0 {
      status.last_mark = Some(status.mark_stack.pop().unwrap());
    } else {
      status.last_mark = None;
    }
  }
}

pub fn handle_letter(
  index: usize,
  c: char,
  char_type: CharType,
  status: &mut ParseStatus
) {
  if let Some(token_type) = char_type_to_token_type(char_type) {
    let last_token = status.last_token.as_ref();
    if last_token.is_some() {
      if last_token.unwrap().borrow().base.token_type == token_type {
        append_value(status, c);
      } else {
        finalize_last_token(status, index);
        init_content(status, index, c, token_type);
      }
    } else {
      init_content(status, index, c, token_type);
    }
  }
}

#[allow(unused_variables)]
pub fn handle_punctuation(
  index: usize,
  c: char,
  char_type: CharType,
  status: &mut ParseStatus
) {}

// TODO:
pub fn mark_to_token() {}

// TODO:
pub fn add_hyper_token() {}

// TODO:
pub fn add_raw_content() {}

pub fn add_sinple_punctuation_token(
  status: &mut ParseStatus,
  index: usize,
  c: char,
  token_type: TokenType
) {
  let token = Token {
    base: CommonToken {
      token_type,
      index,
      length: 1,
      value: c.to_string(),
      space_after: String::from(""),
      mark: None,
      mark_side: None,
    },
    extra: TokenExtraType::Single,
  };
  let token_rc = Rc::new(RefCell::new(token));
  finalize_current_token(status, token_rc);
}

pub fn add_unmatched_token(
  status: &mut ParseStatus,
  index: usize,
  c: char
) {
  let token = Token {
    base: CommonToken {
      token_type: TokenType::UnmatchedMark,
      index,
      length: 1,
      value: c.to_string(),
      space_after: String::from(""),
      mark: None,
      mark_side: None,
    },
    extra: TokenExtraType::Single,
  };
  let token_rc = Rc::new(RefCell::new(token));
  finalize_current_token(status, token_rc);
}

pub fn init_group(
  status: &mut ParseStatus,
  index: usize,
  c: char,
) {
  if status.last_group.is_some() {
    let prev_group = status.last_group.clone().unwrap();
    status.group_stack.push(prev_group);
  }

  let new_group = Token {
    base: CommonToken {
      token_type: TokenType::Group,
      index,
      length: 1,
      value: c.to_string(),
      space_after: String::from(""),
      mark: None,
      mark_side: None,
    },
    extra: TokenExtraType::Group(GroupTokenExtra {
      start_index: index,
      start_value: c.to_string(),
      end_index: 0,
      end_value: String::from(""),
      inner_space_before: String::from(""),
      children: vec![],
    }),
  };
  let new_group_rc = Rc::new(RefCell::new(new_group));

  let mut prev_group = status.group_stack.last().unwrap().borrow_mut();
  if let TokenExtraType::Group(ref mut group_extra) = prev_group.extra {
    group_extra.children.push(new_group_rc.clone());
  }

  status.last_group = Some(Rc::clone(&new_group_rc));
  status.groups.push(new_group_rc);
}

pub fn finalize_group(
  status: &mut ParseStatus,
  index: usize,
  c: char
) {
  let last_group = status.last_group.as_ref();
  if last_group.is_some() {
    let last_group_value = last_group.unwrap();
    {
      let mut last_group_value_borrowed = last_group_value.borrow_mut();
      match last_group_value_borrowed.extra {
        TokenExtraType::Group(ref mut extra) => {
          extra.end_index = index;
          extra.end_value = c.to_string();
        },
        _ => {}
      }
    }
  }
  if status.group_stack.len() > 0 {
    let prev_group = status.group_stack.pop().unwrap();
    status.last_group = Some(prev_group);
  } else {
    status.last_group = None;
  }
}

pub fn init_content(
  status: &mut ParseStatus,
  index: usize,
  c: char,
  token_type: TokenType
) {
  let token = Token {
    base: CommonToken {
      token_type,
      index,
      length: 1,
      value: c.to_string(),
      space_after: String::from(""),
      mark: None,
      mark_side: None,
    },
    extra: TokenExtraType::Single,
  };
  let token_rc = Rc::new(RefCell::new(token));
  status.last_token = Some(Rc::clone(&token_rc));
}

pub fn append_value(
  status: &ParseStatus,
  c: char
) {
  let last_token = status.last_token.as_ref();
  if last_token.is_some() {
    let last_token_value = last_token.unwrap();
    let mut last_token_value_borrowed = last_token_value.borrow_mut();
    last_token_value_borrowed.base.value.push(c);
    last_token_value_borrowed.base.length += 1;
  }
}

pub fn get_space_length(
  str: &str,
  i: usize
) -> usize {
  let mut space_length = 0;
  let mut j = i;
  while j < str.len() {
    let c = str.chars().nth(j).unwrap();
    if get_char_type(c) == CharType::Space {
      space_length += 1;
    } else {
      break;
    }
    j += 1;
  }
  space_length
}

pub fn get_prev_token(
  status: &ParseStatus
) -> Option<Rc<RefCell<Token>>> {
  // https://users.rust-lang.org/t/fail-to-return-something-with-an-enum-in-rc-refcell-due-to-cannot-return-value-referencing-local-variable/115389
  if let Some(items) = &status.last_group {
    let items = items.borrow();
    if let TokenExtraType::Group(extra) = &items.extra {
      if let Some(last_child) = extra.children.last() {
        return Some(last_child.clone());
      }
    }
  }
  return None;
}

#[allow(unused_variables)]
pub fn is_shorthand(
  str: &str,
  status: &ParseStatus,
  i: usize,
  c: char
) -> bool {
  return false;
}

pub fn get_hyper_content_type(
  str: &str
) -> HyperTokenType {
  if Regex::new("\n").unwrap().is_match(str) {
    return HyperTokenType::HyperContent;
  }
  if Regex::new("^<code.*>.*<\\/code.*>$").unwrap().is_match(str) {
    return HyperTokenType::CodeContent;
  }
  if Regex::new("^<.+>$").unwrap().is_match(str) {
    return HyperTokenType::HyperContent;
  }
  return HyperTokenType::CodeContent;
}
