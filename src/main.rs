use parse::parse;

pub mod char_type;
pub mod token_type;
pub mod type_trait;
pub mod parse;
pub mod parse_util;

fn main() {
  let str = "中文，English 中文";
  println!("[Input]\n{:?}", str);
  let result = parse(str);
  println!("[Output]\n{:?}", result);
}
