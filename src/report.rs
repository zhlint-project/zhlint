use crate::hyper::markdown::context::ParseResult;

#[derive(Debug)]
pub struct LintReport {
  pub input: String,
  pub output: String,
}

pub fn report(
  input: String,
  output: String,
  _hyper_tokens: ParseResult,
) -> LintReport {
  // TODO: errors and warnings

  LintReport {
    input,
    output,
  }
}