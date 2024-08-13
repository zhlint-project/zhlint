pub mod char_type;
pub mod token_type;
pub mod type_trait;
pub mod parse_util;
pub mod parse_status;

use char_type::{get_char_type, get_unicode_substring, CharType};
use type_trait::TypeTrait;
use parse_util::get_space_length;
use parse_status::{ParseResult, ParseStatus};

pub fn parse(str: &str) -> ParseResult {
  let mut status = ParseStatus::new(str);

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
      status.handle_spaces(spaces);
      if space_len > 1 {
        last_index = i + space_len - 1;
      }
    } else if status.is_shorthand(c, str.chars().nth(i + 1)) {
      status.append_content(c);
    } else if char_type.is_punctuation() {
      status.handle_punctuation(i, c, char_type);
    } else if char_type.is_letter() {
      status.handle_letter(i, c, char_type);
    } else {
      status.handle_letter(i, c, char_type);
    }
  }

  // handle errors!

  return ParseResult {
    root: status.root,
    errors: status.errors,
  };
}

pub fn to_mutalbe_parse_result() {
  // to_mutable_token
  // to_mutable_mark
}
