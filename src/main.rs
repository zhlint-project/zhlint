use std::{fs, process::exit};

use clap::Parser;

use zhlint::run;

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
      let result = run(&s);
      println!("{}", result.output);
    },
    Err(e) => {
      println!("Unable to read file: {e}");
      exit(1);
    }
  };
}
