use char_type::get_char_type;

pub mod char_type;
pub mod token_type;
pub mod type_trait;
pub mod parse;

fn main() {
    let a = get_char_type(' ');
    println!("Hello, world! {:?}", a);
}
