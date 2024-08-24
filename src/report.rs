use crate::{hyper::markdown::context::ParseResult, LintReport};

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