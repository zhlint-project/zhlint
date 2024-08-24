use crate::hyper::markdown::context::ParseResult;

#[derive(Debug)]
pub struct LintReport {
  pub input: String,
  pub output: String,
  pub errors: Vec<String>,
  pub warnings: Vec<String>,
}

pub fn report(
  input: String,
  output: String,
  _hyper_tokens: ParseResult,
) -> LintReport {
  // TODO:

  LintReport {
    input,
    output,
    errors: vec![], // TODO: later
    warnings: vec![], // TODO: later
  }
}