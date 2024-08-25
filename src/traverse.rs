use crate::{parse::context::MutParseResult, token::token_type::{MutToken, MutTokenExtraType}};

// TODO: better traverse function

pub fn traverse(data: &mut MutParseResult, lint: fn(&mut MutToken)) {
  iterate(&mut data.root, lint)
}

fn iterate(token: &mut MutToken, lint: fn(&mut MutToken)) {  
  lint(token);
  match &mut token.extra {
    MutTokenExtraType::Group(extra, _mut_extra) => {
      let len = extra.children.len();
      for index in 0..len {
        iterate(&mut extra.children[index], lint);
      }
    },
    _ => {},
  }
}