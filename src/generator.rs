use crate::parse_context::MutParseResult;

pub fn generate(result: &MutParseResult) -> String {
  result.root.to_string()
}

#[cfg(test)]
mod tests {
  use crate::parse;
  use super::*;

  #[test]
  fn test_parse() {
    let str = "中文，English 中文";
    let result = parse(str);
    println!("{:#?}", result);
    let mut_result = result.to_mut();
    println!("{:#?}", mut_result);
    let generated = generate(&mut_result);
    println!("{}", generated);
  }
}
