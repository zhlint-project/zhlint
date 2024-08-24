pub mod util;
pub mod context;

use crate::hyper::markdown::context::InlineMark;
use crate::token::char_type::{get_char_type, get_unicode_substring, CharType};
use crate::token::type_trait::TypeTrait;

use util::get_space_length;
use context::{ParseResult, ParseContext};

pub fn parse(str: &str, offset: usize, hyper_marks: &mut Vec<InlineMark>) -> ParseResult {
  let mut context = ParseContext::new(str, offset, hyper_marks);

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
    if context.is_hyper_mark(i) {
      let hyper_len = context.handle_hyper_mark(i);
      last_index = i + hyper_len - 1;
    } else if char_type == CharType::Space {
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
    offset,
    errors: context.errors,
  };
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_parse() {
    let str = "中文，English 中文";
    let result = parse(str, 0, &mut vec![]);
    println!("{:#?}", result);
    let mut_result = result.to_mut();
    println!("{:#?}", mut_result);
  }
}
