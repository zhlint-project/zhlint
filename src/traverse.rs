use crate::{parse::context::MutParseResult, token::token_type::{MutToken, MutTokenExtraType}};

pub fn traverse(data: &mut MutParseResult, lint: fn(&mut MutToken, usize, &MutToken)) {
  iterate(&mut data.root, lint)
}

fn iterate(token: &mut MutToken, _lint: fn(&mut MutToken, usize, &MutToken)) {  
  match &mut token.extra {
    MutTokenExtraType::Group(extra, _mut_extra) => {
      extra.children.iter_mut().enumerate().for_each(|(_index, _child)| {
        // TODO:
        // lint(child, index, token);
        // iterate(child, lint);
      });
    },
    _ => {},
  }
}