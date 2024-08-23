pub mod char_type;
pub mod token_type;
pub mod type_trait;
pub mod parse_util;
pub mod parse_context;
pub mod hyper;

use char_type::{get_char_type, get_unicode_substring, CharType};
use type_trait::TypeTrait;
use parse_util::get_space_length;
use parse_context::{ParseResult, ParseContext};

pub fn parse(str: &str) -> ParseResult {
  let mut context = ParseContext::new(str);

  let mut last_index = 0;
  for (i, c) in str.chars().enumerate() {
    // skip already handled spaces
    if i < last_index {
      continue;
    }
    last_index = i;

    // get char type
    let char_type = get_char_type(c);

    // if char_type is hyper!
    if char_type == CharType::Space {
      let space_len = get_space_length(str, i);
      let spaces = get_unicode_substring(str, i, space_len);
      context.handle_spaces(spaces);
      if space_len > 1 {
        last_index = i + space_len - 1;
      }
    } else if context.is_shorthand(c, str.chars().nth(i + 1)) {
      context.append_content(c);
    } else if char_type.is_punctuation() {
      context.handle_punctuation(i, c, char_type);
    } else if char_type.is_letter() {
      context.handle_letter(i, c, char_type);
    } else {
      context.handle_letter(i, c, char_type);
    }
  }

  // handle errors!

  return ParseResult {
    root: context.root,
    errors: context.errors,
  };
}

pub fn to_mut_parse_result() {
  // to_mut_token
  // to_mut_mark
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_parse() {
    let str = "中文，English 中文";
    let result = parse(str);
    println!("{:#?}", result);
  }
}
