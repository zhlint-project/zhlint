pub mod token;
pub mod parse;
pub mod hyper;
pub mod generator;

pub mod traverse;
pub mod lint;
pub mod report;

#[derive(Debug)]
pub struct LintReport {
  pub input: String,
  pub output: String,
  pub errors: Vec<String>,
  pub warnings: Vec<String>,
}

pub fn run(
  str: &str
) -> LintReport {
  // TODO: pass _hyper_tokens into parse::parse
  let _hyper_tokens = hyper::markdown::parse::parse(str);

  let tokens = parse::parse(str);
  let output = generator::generate(&tokens.to_mut());

  // TODO: traverse the tokens and lint

  // TODO: get report
  LintReport {
    input: str.to_string(),
    output,
    errors: vec![],
    warnings: vec![],
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_run() {
    let str = "中文，English 中文";
    let result = run(str);
    println!("{:#?}", result);
  }
}