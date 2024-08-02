use std::{fs, process::exit};

use clap::Parser;

use zhlint::parse;

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
  /// File path
  #[arg(short, long)]
  file: String,
}

fn main() {
  let args = Args::parse();
  match fs::read_to_string(&args.file) {
    Ok(s) => {
      let result = parse(&s);
      println!("{:?}", result);
    },
    Err(e) => {
      println!("Unable to read file: {e}");
      exit(1);
    }
  };
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_parse() {
    let str = "中文，English 中文";
    let result = parse(str);
    println!("{:?}", result);
  }
}
