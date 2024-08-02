use crate::{
  char_type::{
    get_char_type,
    CharType
  }, parse_util::*, token_type::TokenExtraType, type_trait::TypeTrait
};

pub fn parse(str: &str) -> ParseResult {
  let mut status = create_status(str);

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
      finalize_last_token(&mut status, i);
      let last_group = status.last_group.as_ref();
      if last_group.is_some() {
        let space_len = get_space_length(str, i);
        let spaces = &str[i..i + space_len];
        match last_group.unwrap().borrow().extra {
          TokenExtraType::Group(ref extra) => {
            if extra.children.len() > 0 {
              let last_token = get_prev_token(&status);
              if last_token.is_some() {
                let last_token_value = last_token.unwrap();
                last_token_value.borrow_mut().base.space_after = String::from(spaces);
              }
            } else {
              let last_group_value = last_group.unwrap();
              match last_group_value.borrow_mut().extra {
                TokenExtraType::Group(ref mut extra) => {
                  extra.inner_space_before = String::from(spaces);
                },
                _ => {}
              }
            }
          },
          _ => {}
        }
        if space_len > 1 {
          last_index = i + space_len - 1;
        }
      }
    } else if is_shorthand(str, &status, i, c) {
      append_value(&status, c);
    } else if char_type.is_punctuation() {
      handle_punctuation(i, c, char_type, &mut status)
    } else if char_type.is_letter() {
      handle_letter(i, c, char_type, &mut status);
    } else {
      handle_letter(i, c, char_type, &mut status);
    }
  }

  finalize_last_token(&mut status, str.len());

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
