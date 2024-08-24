use crate::parse::context::MutParseResult;

pub fn generate(result: &MutParseResult) -> String {
  result.root.to_string()
}

#[cfg(test)]
mod tests {
  use crate::{parse::parse, token::token_type::MutTokenExtraType};
  use super::*;

  fn modify_result(result: &mut MutParseResult) {
    if let MutTokenExtraType::Group(
      e,
      ee
    ) = &mut result.root.extra {
      if let Some(second) = e.children.get_mut(1) {
        if let MutTokenExtraType::Single(second_extra) = &mut second.extra {
          second_extra.modified_value = String::from(",");
          second_extra.modified_space_after = String::from(" ");
        }
      }
      ee.modified_start_value = String::from("!!");
      ee.modified_end_value = String::from("!!");
    }
  }

  #[test]
  fn test_parse() {
    let str = "中文，English 中文";
    let result = parse(str, 0, &mut vec![]);
    println!("{:#?}", result);
    let mut mut_result = result.to_mut();
    println!("{:#?}", mut_result);
    modify_result(&mut mut_result);
    let generated = generate(&mut_result);
    println!("{}", generated);
  }
}
