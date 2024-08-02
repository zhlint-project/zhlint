// object fields as refs
// array
// object with multiple refs

// Rc/Box/mut/&

use std::rc::Rc;
use std::cell::RefCell;

pub fn foo() {
  /* primary values */

  // basic usage of &str and String
  let s = "Hello";
  println!("s: {}", s);
  println!("----------------");

  let ss = s;
  println!("s: {}", s);
  println!("ss: {}", ss);
  println!("----------------");

  let mut sss = String::from("Hello");
  sss.push(' ');
  sss.push_str("World");
  println!("sss: {}", sss);
  println!("----------------");

  // clone is acceptable
  let ssss = sss.clone();
  println!("sss: {}", sss);
  println!("ssss: {}", ssss);
  println!("----------------");

  // ownership is moved
  let sssss = sss;
  // println!("sss: {}", sss);
  println!("sssss: {}", sssss);
  println!("----------------");

  // ownership is copied
  let x = 1;
  let y = x;
  println!("x: {}", x);
  println!("y: {}", y);
  println!("----------------");

  /* functions */

  fn bar(s: String) -> String {
    s
  }
  
  fn baz(x: i32) -> i32 {
    x
  }
  
  fn qux(x: &String) -> String {
    x.clone()
  }

  // ownership is moved by function
  let ssssss = bar(sssss);
  // println!("sssss: {}", sssss);
  println!("ssssss: {}", ssssss);
  println!("----------------");

  // ownership is copied by function
  let z = baz(y);
  println!("y: {}", y);
  println!("z: {}", z);
  println!("----------------");

  // ref is borrowed
  let sssssss = &ssssss;
  println!("ssssss: {}", ssssss);
  println!("sssssss: {}", *sssssss);
  println!("----------------");

  // ref is borrowed by function
  let ssssssss = qux(&ssssss);
  println!("ssssss: {}", ssssss);
  println!("ssssssss: {}", ssssssss);
  println!("----------------");

  // you can bororw mut ref only once
  // and then you can't access other imut refs

  // you can't return ref of local variable in function

  /* vec */

  // works for copyables
  let v1 = Vec::<i32>::new();
  // v1.push(1);
  let mut v2 = vec![1, 2, 3];
  v2.push(4);
  println!("v1: {:?}", v1);
  println!("v2: {:?}", v2);
  let value1 = v2.get(0); // Option<&i32>
  let value2 = &v2[3];
  let value3 = v2[3];
  let value4 = v2[3];
  println!("value1: {:?}", value1);
  println!("value2: {:?}", value2);
  println!("value3: {:?}", value3);
  println!("value4: {:?}", value4);
  println!("----------------");

  // only ref access is allowed if not copiable
  let v3 = vec![String::from("a"), String::from("b"), String::from("c"), String::from("d")];
  let value1 = v3.get(0);
  let value2 = &v3[3];
  // let value3 = v3[3];
  // let value4 = v3[3];
  println!("value1: {:?}", value1);
  println!("value2: {:?}", value2);
  // println!("value3: {:?}", value3);
  // println!("value4: {:?}", value4);
  println!("----------------");

  // you can't access imut v4 items vars after mut the items
  let mut v4 = vec![String::from("a"), String::from("b"), String::from("c"), String::from("d")];
  let mut value1 = &v4[0];
  let mut value2 = &v4[0];
  println!("value1: {:?}", value1);
  println!("value2: {:?}", value2);
  v4.push(String::from("e"));
  v4[0] = String::from("A");
  value1 = &v4[1];
  value2 = &v4[2];
  println!("value1: {:?}", value1);
  println!("value2: {:?}", value2);
  println!("----------------");

  /* structs */

  // can't reuse the field
  #[derive(Debug)]
  struct SFoo {
    a: i32,
    b: String,
  }
  let s_a_b = String::from("a");
  let s_a: SFoo = SFoo { a: 1, b: s_a_b };
  // let s_b: SFoo = SFoo { a: 2, b: s_a_b };
  println!("s_a: {:?}", s_a.a);
  println!("s_a: {:?}", s_a.b);
  println!("s_a: {:?}", s_a);
  // println!("s_b: {:?}", s_b.a);
  // println!("s_b: {:?}", s_b.b);
  // println!("s_b: {:?}", s_b);
  println!("----------------");

  // set lifetime span for the ref in struct
  #[allow(dead_code)]
  struct SBar<'a> {
    a: i32,
    b: &'a String,
  }
  // let s_b_b = &String::from("a");
  // let s_b_1: SFoo = SFoo { a: 1, b: s_b_b };
  // let s_b_2: SFoo = SFoo { a: 2, b: s_b_b };

  #[derive(Debug)]
  struct SBaz {
    a: Vec<String>,
    b: Vec<String>,
  }
  let s_baz_a = vec![String::from("a"), String::from("b"), String::from("c")];
  let s_baz_1: SBaz = SBaz {
    // a: s_baz_a,
    a: s_baz_a.clone(),
    // b: s_baz_a,
    b: s_baz_a,
  };
  println!("s_baz_1: {:?}", s_baz_1.a);
  println!("s_baz_1: {:?}", s_baz_1.b);
  println!("s_baz_1: {:?}", s_baz_1);
  println!("----------------");

  #[derive(Debug)]
  struct SQux {
    a: Rc<RefCell<Vec<String>>>,
    b: Rc<RefCell<Vec<String>>>,
  }
  let s_qux_a_vec = vec![String::from("a"), String::from("b"), String::from("c")];
  let s_qux_a = Rc::new(RefCell::new(s_qux_a_vec));
  let s_qux_1: SQux = SQux {
    a: s_qux_a.clone(),
    b: s_qux_a.clone(),
  };
  println!("s_qux_1: {:?}", s_qux_1.a);
  println!("s_qux_1: {:?}", s_qux_1.b);
  println!("s_qux_1: {:?}", s_qux_1);
  s_qux_a.borrow_mut().push(String::from("d"));
  println!("s_qux_1: {:?}", s_qux_1.a);
  println!("s_qux_1: {:?}", s_qux_1.b);
  println!("s_qux_1: {:?}", s_qux_1);
  println!("----------------");

  // Box<T> for recursive struct
  // Rc<T> for shared ownership
  // RefCell<T> for mutable borrow of immutable ref
  // Rc<RefCell<T>> for shared mutable borrow of immutable ref

  #[derive(Debug)]
  struct SFnFoo {
    a: Vec<Rc<RefCell<String>>>,
    b: Vec<Rc<RefCell<String>>>,
  }
  fn fn_foo() -> SFnFoo {
    let x = Rc::new(RefCell::new(String::from("a")));
    let y = Rc::new(RefCell::new(String::from("b")));
    let z = Rc::new(RefCell::new(String::from("c")));
    let a = vec![x.clone(), y.clone(), z.clone()];
    let b = vec![x.clone(), z.clone()];
    SFnFoo {
      a,
      b,
    }
  }
  let mut s_fn_foo = fn_foo();
  println!("s_fn_foo: {:?}", s_fn_foo.a);
  println!("s_fn_foo: {:?}", s_fn_foo.b);
  println!("s_fn_foo: {:?}", s_fn_foo);
  s_fn_foo.a.push(Rc::new(RefCell::new(String::from("d"))));
  println!("s_fn_foo: {:?}", s_fn_foo.a);
  s_fn_foo.a[0].borrow_mut().push_str("e");
  println!("s_fn_foo: {:?}", s_fn_foo.a);
  println!("s_fn_foo: {:?}", s_fn_foo.b);
  println!("s_fn_foo: {:?}", s_fn_foo);
  println!("----------------");

  /* generic types and traits */

  struct TFoo<T, U> {
    x: i32,
    y: T,
    z: U,
  }
  struct TGroup {
    a: i32,
    b: i32,
  }
  let mut t_foo = TFoo { x: 1, y: TGroup { a: 2, b: 3 }, z: 4 };
  let mut t_foo_2 = TFoo { x: 1, y: (), z: () };
  fn t_mut_foo<T, U>(t: &mut TFoo<T, U>) {
    t.x = 4;
  }
  fn t_mut_foo_2<T>(t: &mut TFoo<TGroup, T>) {
    t.x = 4;
    t.y = TGroup { a: 5, b: 6 };
  }
  t_mut_foo(&mut t_foo);
  t_mut_foo(&mut t_foo_2);
  t_mut_foo_2(&mut t_foo);
  println!("t_foo: {:?}", t_foo.x);
  println!("t_foo: {:?}", t_foo.y.a);
  println!("t_foo: {:?}", t_foo.y.b);
  println!("t_foo: {:?}", t_foo.z);
  println!("----------------");

  /* complex example 1 */

  let mut a = 1;
  let b = &mut a;
  *b = 2;
  println!("a: {}", a);

  /* complex example 2 */

  #[allow(dead_code)]
  #[derive(Debug)]
  enum Node {
    Branch { name: String },
    Leaf { name: String },
  }
  fn test_match(node: &Rc<RefCell<Node>>) {
    let mut borror_mut_node = RefCell::borrow_mut(node);
    match *borror_mut_node {
      Node::Branch { ref mut name } => name.push_str("b"),
      Node::Leaf { ref mut name } => name.push_str("l"),
    }
  }
  fn test_match2(node: &Rc<RefCell<Node>>) {
    match &mut *node.borrow_mut() {
      Node::Branch { ref mut name } => name.push_str("b"),
      Node::Leaf { ref mut name } => name.push_str("l"),
    }
  }
  fn test_match3(node: &Rc<RefCell<Node>>) {
    match &mut *node.borrow_mut() {
      Node::Branch { name } => name.push_str("b"),
      Node::Leaf { name } => name.push_str("l"),
    }
  }
  let node = Node::Branch { name: String::from("test-") };
  let node = Rc::new(RefCell::new(node));
  test_match(&node);
  test_match2(&node);
  test_match3(&node);
  println!("node: {:?}", node);

  #[allow(dead_code)]
  #[derive(Debug)]
  struct Example3Foo {
    a: i32,
    b: i32,
  }
  #[allow(dead_code)]
  #[derive(Debug)]
  struct Example3Bar {
    a: i32,
    b: i32,
    c: i32,
  }
  #[allow(dead_code)]
  #[derive(Debug)]
  enum Example3X {
    Foo(Example3Foo),
    Bar(Example3Bar),
  }
  let example3_x = Example3X::Foo(Example3Foo { a: 1, b: 2 });
  let example3_x = Rc::new(RefCell::new(example3_x));
  fn test_example3_x(example3_x: &Rc<RefCell<Example3X>>) {
    match &mut *example3_x.borrow_mut() {
      Example3X::Foo(foo) => foo.a = 3,
      Example3X::Bar(bar) => bar.a = 4,
    }
  }
  test_example3_x(&example3_x);
  println!("example3_x: {:?}", example3_x);
}

