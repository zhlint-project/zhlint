use regex::Regex;

use crate::{
  char_type::{get_char_type, CharType},
  token_type::HyperTokenType,
};

// TODO:
pub fn mark_to_token() {}

// TODO:
pub fn add_hyper_token() {}

// TODO:
pub fn add_raw_content() {}

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
