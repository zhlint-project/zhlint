// use char_type::get_char_type;
// use learn_borrow::foo;
use parse::parse;

pub mod char_type;
pub mod token_type;
pub mod type_trait;
pub mod parse;
pub mod parse_util;
pub mod learn_borrow;

fn main() {
  // let a = get_char_type(' ');
  // println!("Hello, world! {:?}", a);
  // foo();
  let str = "中文，English 中文";
  println!("[Input]\n{:?}", str);
  let result = parse(str);
  println!("[Output]\n{:?}", result);
}
