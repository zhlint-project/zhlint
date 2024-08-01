use char_type::get_char_type;
use learn_borrow::foo;

pub mod char_type;
pub mod token_type;
pub mod type_trait;
pub mod parse;
pub mod parse_util;
pub mod learn_borrow;

fn main() {
    let a = get_char_type(' ');
    println!("Hello, world! {:?}", a);
    foo();
}
