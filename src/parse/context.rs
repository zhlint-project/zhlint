use crate::token::{
  char_type::{get_char_type, CharType, LEFT_BRACKET, LEFT_QUOTATION, NEUTRAL_QUOTATION, RIGHT_QUOTATION, SHORTHAND, SHORTHAND_PAIR},
  token_type::{GroupTokenExtra, Mark, MarkSideType, MarkType, CommonToken, MutToken, Token, TokenExtraType, TokenType},
  type_trait::{char_type_to_token_type, TypeTrait}
};

type TokenPath = Vec<usize>;

#[derive(Debug)]
pub struct ParseContext {
  pub root: Token,
  pub last_group_path: TokenPath,
  pub unresolved_marks_count: usize,
  pub errors: Vec<String>, // TODO: Validation
}

impl ParseContext {
  pub fn new(str: &str) -> Self {
    let root = Token {
      base: CommonToken {
        // id: 0,
        // parent_id: usize::MAX,
        token_type: TokenType::Group,
        index: 0,
        length: str.len(),
        value: str.to_string(),
        space_after: String::from(""),
        mark: None,
      },
      extra: TokenExtraType::Group(GroupTokenExtra {
        start_index: 0,
        start_value: String::from(""),
        end_index: str.len(),
        end_value: String::from(""),
        inner_space_before: String::from(""),
        children: vec![],
      }),
    };
    ParseContext {
      root,
      last_group_path: vec![],
      unresolved_marks_count: 0,
      errors: vec![],
    }  
  }
  pub fn get_last_token(&mut self) -> Option<&mut Token> {
    let mut last_group = &mut self.root;
    for i in &self.last_group_path {
      match last_group.extra {
        TokenExtraType::Group(ref mut extra) => {
          if i < &extra.children.len() {
            last_group = &mut extra.children[*i];
          } else {
            return None;
          }
        },
        _ => return None,
      }
    }
    if let TokenExtraType::Group(ref mut extra) = last_group.extra {
      return extra.children.last_mut();
    }
    None
  }
  pub fn get_last_group(&mut self) -> Option<&mut Token> {
    let mut current = &mut self.root;
    if self.last_group_path.len() == 0 {
      return Some(current);
    }
    for i in &self.last_group_path {
      match current.extra {
        TokenExtraType::Group(ref mut extra) => {
          if i < &extra.children.len() {
            current = &mut extra.children[*i];
          } else {
            return None;
          }
        },
        _ => return None,
      }
    }
    Some(current)
  }

  pub fn add_token(&mut self, token: Token) -> Option<usize> {
    if let Some(last_group) = self.get_last_group() {
      match last_group.extra {
        TokenExtraType::Group(ref mut extra) => {
          extra.children.push(token);
          return Some(extra.children.len() - 1);
        },
        _ => {},
      }
    }
    None
  }

  pub fn add_bracket_token(&mut self, index: usize, c: char, mark_side: MarkSideType) {
    let token = Token {
      base: CommonToken {
        token_type: TokenType::BracketMark,
        index,
        length: 1,
        value: c.to_string(),
        space_after: String::from(""),
        mark: Some(Mark {
          mark_type: MarkType::Brackets,
          mark_side,
        }),
      },
      extra: TokenExtraType::Single,
    };
    self.add_token(token);
  }
  pub fn add_single_punctuation_token(&mut self, index: usize, c: char, token_type: TokenType) {
    let token = Token {
      base: CommonToken {
        token_type,
        index,
        length: 1,
        value: c.to_string(),
        space_after: String::from(""),
        mark: None,
      },
      extra: TokenExtraType::Single,
    };
    self.add_token(token);
  }
  pub fn add_unmatched_token(&mut self, index: usize, c: char) {
    let token = Token {
      base: CommonToken {
        token_type: TokenType::UnmatchedMark,
        index,
        length: 1,
        value: c.to_string(),
        space_after: String::from(""),
        mark: None,
      },
      extra: TokenExtraType::Single,
    };
    self.add_token(token);
  }
  pub fn add_content_token(&mut self, index: usize, c: char, token_type: TokenType) {
    let token = Token {
      base: CommonToken {
        token_type,
        index,
        length: 1, // appendable
        value: c.to_string(), // appendable
        space_after: String::from(""),
        mark: None,
      },
      extra: TokenExtraType::Single,
    };
    self.add_token(token);
  }
  pub fn append_content(&mut self, c: char) {
    if let Some(last_token) = self.get_last_token() {
      last_token.base.length += 1;
      last_token.base.value.push(c);
    }
  }

  pub fn add_group_token(&mut self, index: usize, c: char) {
    let token = Token {
      base: CommonToken {
        token_type: TokenType::Group,
        index,
        length: usize::MAX, // undetermined
        value: String::from(""), // skipped
        space_after: String::from(""),
        mark: None,
      },
      extra: TokenExtraType::Group(GroupTokenExtra {
        start_index: index,
        start_value: c.to_string(),
        end_index: usize::MAX, // undetermined
        end_value: String::from(""), // undetermined
        inner_space_before: String::from(""),
        children: vec![],
      }),
    };
    let last_group_index = self.add_token(token);
    if let Some(index) = last_group_index {
      self.last_group_path.push(index);
    }
  }
  pub fn finish_group_token(&mut self, index: usize, c: char) {
    if let Some(last_group) = self.get_last_group() {
      last_group.base.length = index - last_group.base.index + 1;
      match last_group.extra {
        TokenExtraType::Group(ref mut extra) => {
          extra.end_index = index;
          extra.end_value = c.to_string();
        },
        _ => {},
      }
    }
    self.last_group_path.pop();
  }

  pub fn is_shorthand(&mut self, c: char, next_c: Option<char>) -> bool {
    if !SHORTHAND.contains(&c) {
      return false;
    }
    let last_token = self.get_last_token();
    if last_token.is_none() {
      return false;
    }
    if last_token.unwrap().base.token_type != TokenType::WesternLetter {
      return false;
    }
    if next_c.is_none() {
      return false;
    }
    let next_char_type = get_char_type(next_c.unwrap());
    if next_char_type == CharType::WesternLetter || next_char_type == CharType::Space {
      let last_group = self.get_last_group();
      if last_group.is_none() {
        return true;
      }
      if let TokenExtraType::Group(extra) = &last_group.unwrap().extra {
        if SHORTHAND_PAIR.contains_key(&extra.start_value.chars().nth(0).unwrap()) {
          return true;
        }
      }
    }
    return true;
  }

  pub fn handle_letter(&mut self, index: usize, c: char, char_type: CharType) {
    if let Some(token_type) = char_type_to_token_type(char_type) {
      if let Some(last_token) = self.get_last_token() {
        if last_token.base.token_type == token_type {
          return self.append_content(c);
        }
      }
      self.add_content_token(index, c, token_type);
    }
  }
  pub fn handle_punctuation(&mut self, index: usize, c: char, char_type: CharType) {
    if char_type.is_bracket() {
      if LEFT_BRACKET.contains(&c) {
        self.add_bracket_token(index, c, MarkSideType::Left);
        self.unresolved_marks_count += 1;
      } else {
        if self.unresolved_marks_count > 0 {
          self.unresolved_marks_count -= 1;
          self.add_bracket_token(index, c, MarkSideType::Right);
        } else {
          self.add_unmatched_token(index, c);
          // TODO: self.add_error(i, "Unmatched right bracket");
        }
      }
      return;
    }
    if char_type.is_quotation() {
      if LEFT_QUOTATION.contains(&c) {
        self.add_group_token(index, c);
      }
      if RIGHT_QUOTATION.contains(&c) {
        if self.get_last_group().is_some() {
          self.finish_group_token(index, c);
        } else {
          self.add_unmatched_token(index, c);
          // TODO: self.add_error(i, "Unmatched right quotation");
        }
      }
      if NEUTRAL_QUOTATION.contains(&c) {
        if let Some(last_group) = self.get_last_group() {
          if let TokenExtraType::Group(ref mut extra) = last_group.extra {
            if extra.start_value == c.to_string() {
              return self.finish_group_token(index, c);
            }
          }
        }
        self.add_group_token(index, c);
      }
      return;
    }
    if let Some(token_type) = char_type_to_token_type(char_type) {
      self.add_single_punctuation_token(index, c, token_type)
    }
  }
  pub fn handle_spaces(&mut self, spaces: &str) {
    if let Some(last_group) = self.get_last_group() {
      if let TokenExtraType::Group(ref mut last_group_extra) = last_group.extra {
        if let Some(last_token) = last_group_extra.children.last_mut() {
          last_token.base.space_after = String::from(spaces);
        } else {
          last_group_extra.inner_space_before = String::from(spaces);
        }
      }
    }
  }
}

#[derive(Debug)]
pub struct ParseResult {
  pub root: Token,
  pub offset: usize,
  pub errors: Vec<String>, // TODO: Validation
}

#[derive(Debug)]
pub struct MutParseResult {
  pub root: MutToken,
  pub offset: usize,
  pub errors: Vec<String>, // TODO: Validation
}

impl ParseResult {
  pub fn to_mut(&self) -> MutParseResult {
    MutParseResult {
      root: self.root.to_mut(),
      offset: self.offset,
      errors: self.errors.clone(),
    }
  }
}
