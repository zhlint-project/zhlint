use crate::token::{token_type::{MutToken, MutTokenExtraType, TokenType}, type_trait::TypeTrait};

// TODO: more rules

fn find_next_letter_index(token: &Vec<MutToken>, index: usize) -> Option<usize> {
  let len = token.len();
  for i in index..len {
    let token_type = token[i].base.token_type;
    if token_type == TokenType::HyperMark {
      continue;
    } else if token_type.is_letter() {
      return Some(i);
    } else {
      return None;
    }
  }
  None
}

fn lint_example(token: &mut MutToken) {
  match &mut token.extra {
    MutTokenExtraType::Group(extra, _mut_extra) => {
      let len = extra.children.len();
      // skip the last token
      for index in 0..len-1 {
        // only check the letter token
        let token_type = &extra.children[index].base.token_type;
        if !token_type.is_letter() {
          continue;
        }
        // skip if the next token is not a letter token
        let next_letter_index = find_next_letter_index(&extra.children, index + 1);
        if next_letter_index.is_none() {
          continue;
        }
        // skip if the next letter token is the same as the current letter token
        let next_letter_token_type = &extra.children[next_letter_index.unwrap()].base.token_type;
        if next_letter_token_type == token_type {
          continue;
        }
        // validate the space after the letter token
        if &extra.children[index].base.space_after != " " {
          let child = &mut extra.children[index];
          if let MutTokenExtraType::Single(mut_extra) = &mut child.extra {
            mut_extra.modified_space_after = " ".to_string();
          }
        }
      }
    },
    _ => {},
  }
}

pub fn lint(token: &mut MutToken) {
  let lint_functions: Vec<fn(&mut MutToken)> = vec![
    lint_example
  ];

  lint_functions.iter().for_each(|lint_function| {
    lint_function(token);
  });
}
