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
      let mut_result = result.to_mut();
      println!("{:#?}", result);
      println!("{:#?}", mut_result);
    },
    Err(e) => {
      println!("Unable to read file: {e}");
      exit(1);
    }
  };
}
