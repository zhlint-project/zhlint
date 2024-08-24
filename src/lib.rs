pub mod token;
pub mod parse;
pub mod hyper;
pub mod generator;
pub mod traverse;
pub mod lint;
pub mod report;

use std::ops::Range;

use parse::parse;
use traverse::traverse;
use generator::generate;
use lint::lint;
use report::{report, LintReport};

pub fn run(
  str: &str
) -> LintReport {
  let mut hyper_tokens = hyper::markdown::parse::parse(str);
  let mut output = String::new();
  let mut last_index = 0;

  hyper_tokens.blocks.iter_mut().for_each(|block| {
    let range = Range {
      start: block.pair.start_range.end,
      end: block.pair.end_range.start,
    };

    let tokens = parse(&str[range.clone()], range.start, &mut block.inline_marks);
    let mut mut_tokens = tokens.to_mut();

    traverse(&mut mut_tokens, lint);

    output.push_str(&str[last_index..block.pair.start_range.start]);
    last_index = block.pair.end_range.end;

    let block_output = generate(&mut_tokens);
    output.push_str(&block_output);
  });

  output.push_str(&str[last_index..]);

  report(str.to_string(), output, hyper_tokens)
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