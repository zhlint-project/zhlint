use super::{char_type::CharType, token_type::TokenType};

pub fn char_type_to_token_type(char_type: CharType) -> Option<TokenType> {
  match char_type {
    CharType::WesternLetter => Some(TokenType::WesternLetter),
    CharType::CjkChar => Some(TokenType::CjkChar),
    CharType::HalfwidthPauseOrStop => Some(TokenType::HalfwidthPauseOrStop),
    CharType::FullwidthPauseOrStop => Some(TokenType::FullwidthPauseOrStop),
    CharType::HalfwidthOtherPunctuation => Some(TokenType::HalfwidthOtherPunctuation),
    CharType::FullwidthOtherPunctuation => Some(TokenType::FullwidthOtherPunctuation),
    _ => None,
  }
}

pub trait TypeTrait {
  fn is_letter(&self) -> bool;
  fn is_pause_or_stop(&self) -> bool;
  fn is_quotation(&self) -> bool;
  fn is_bracket(&self) -> bool;
  fn is_other_punctuation(&self) -> bool;
  fn is_single_punctuation(&self) -> bool;
  fn is_punctuation(&self) -> bool;
  fn is_halfwidth_punctuation(&self) -> bool;
  fn is_fullwidth_punctuation(&self) -> bool;
  fn is_halfwidth(&self) -> bool;
  fn is_fullwidth(&self) -> bool;
  fn is_normal_content(&self) -> bool;
  fn is_single(&self) -> bool;
  fn is_group(&self) -> bool;
  fn is_non_code_visible(&self) -> bool;
  fn is_visible(&self) -> bool;
  fn is_invisible(&self) -> bool;
  fn is_visibility_unknown(&self) -> bool;
}

impl TypeTrait for CharType {
  fn is_letter(&self) -> bool {
    match self {
      CharType::WesternLetter => true,
      CharType::CjkChar => true,
      _ => false,
    }
  }

  fn is_pause_or_stop(&self) -> bool {
    match self {
      CharType::HalfwidthPauseOrStop => true,
      CharType::FullwidthPauseOrStop => true,
      _ => false,
    }
  }

  fn is_quotation(&self) -> bool {
    match self {
      CharType::HalfwidthQuotation => true,
      CharType::FullwidthQuotation => true,
      _ => false,
    }
  }

  fn is_bracket(&self) -> bool {
    match self {
      CharType::HalfwidthBracket => true,
      CharType::FullwidthBracket => true,
      _ => false,
    }
  }

  fn is_other_punctuation(&self) -> bool {
    match self {
      CharType::HalfwidthOtherPunctuation => true,
      CharType::FullwidthOtherPunctuation => true,
      _ => false,
    }
  }

  fn is_single_punctuation(&self) -> bool {
    match self {
      CharType::HalfwidthPauseOrStop => true,
      CharType::FullwidthPauseOrStop => true,
      CharType::HalfwidthOtherPunctuation => true,
      CharType::FullwidthOtherPunctuation => true,
      _ => false,
    }
  }

  fn is_punctuation(&self) -> bool {
    match self {
      CharType::HalfwidthPauseOrStop => true,
      CharType::FullwidthPauseOrStop => true,
      CharType::HalfwidthBracket => true,
      CharType::FullwidthBracket => true,
      CharType::HalfwidthQuotation => true,
      CharType::FullwidthQuotation => true,
      CharType::HalfwidthOtherPunctuation => true,
      CharType::FullwidthOtherPunctuation => true,
      _ => false,
    }
  }

  fn is_halfwidth_punctuation(&self) -> bool {
    match self {
      CharType::HalfwidthPauseOrStop => true,
      CharType::HalfwidthBracket => true,
      CharType::HalfwidthQuotation => true,
      CharType::HalfwidthOtherPunctuation => true,
      _ => false,
    }
  }

  fn is_fullwidth_punctuation(&self) -> bool {
    match self {
      CharType::FullwidthPauseOrStop => true,
      CharType::FullwidthBracket => true,
      CharType::FullwidthQuotation => true,
      CharType::FullwidthOtherPunctuation => true,
      _ => false,
    }
  }

  fn is_halfwidth(&self) -> bool {
    match self {
      CharType::WesternLetter => true,
      CharType::HalfwidthPauseOrStop => true,
      CharType::HalfwidthBracket => true,
      CharType::HalfwidthQuotation => true,
      CharType::HalfwidthOtherPunctuation => true,
      _ => false,
    }
  }

  fn is_fullwidth(&self) -> bool {
    match self {
      CharType::CjkChar => true,
      CharType::FullwidthPauseOrStop => true,
      CharType::FullwidthBracket => true,
      CharType::FullwidthQuotation => true,
      CharType::FullwidthOtherPunctuation => true,
      _ => false,
    }
  }

  fn is_normal_content(&self) -> bool {
    false
  }

  fn is_single(&self) -> bool {
    false
  }

  fn is_group(&self) -> bool {
    false
  }

  fn is_non_code_visible(&self) -> bool {
    false
  }

  fn is_visible(&self) -> bool {
    false
  }

  fn is_invisible(&self) -> bool {
    false
  }

  fn is_visibility_unknown(&self) -> bool {
    false
  }

}

impl TypeTrait for TokenType {
  fn is_letter(&self) -> bool {
    match self {
      TokenType::WesternLetter => true,
      TokenType::CjkChar => true,
      _ => false,
    }
  }

  fn is_pause_or_stop(&self) -> bool {
    match self {
      TokenType::HalfwidthPauseOrStop => true,
      TokenType::FullwidthPauseOrStop => true,
      _ => false,
    }
  }

  fn is_quotation(&self) -> bool {
    false
  }

  fn is_bracket(&self) -> bool {
    false
  }

  fn is_other_punctuation(&self) -> bool {
    match self {
      TokenType::HalfwidthOtherPunctuation => true,
      TokenType::FullwidthOtherPunctuation => true,
      _ => false,
    }
  }

  fn is_single_punctuation(&self) -> bool {
    match self {
      TokenType::HalfwidthPauseOrStop => true,
      TokenType::FullwidthPauseOrStop => true,
      TokenType::HalfwidthOtherPunctuation => true,
      TokenType::FullwidthOtherPunctuation => true,
      _ => false,
    }
  }

  fn is_punctuation(&self) -> bool {
    match self {
      TokenType::HalfwidthPauseOrStop => true,
      TokenType::FullwidthPauseOrStop => true,
      TokenType::HalfwidthOtherPunctuation => true,
      TokenType::FullwidthOtherPunctuation => true,
      _ => false,
    }
  }

  fn is_halfwidth_punctuation(&self) -> bool {
    match self {
      TokenType::HalfwidthPauseOrStop => true,
      TokenType::HalfwidthOtherPunctuation => true,
      _ => false,
    }
  }

  fn is_fullwidth_punctuation(&self) -> bool {
    match self {
      TokenType::FullwidthPauseOrStop => true,
      TokenType::FullwidthOtherPunctuation => true,
      _ => false,
    }
  }

  fn is_halfwidth(&self) -> bool {
    match self {
      TokenType::WesternLetter => true,
      TokenType::HalfwidthPauseOrStop => true,
      TokenType::HalfwidthOtherPunctuation => true,
      _ => false,
    }
  }

  fn is_fullwidth(&self) -> bool {
    match self {
      TokenType::CjkChar => true,
      TokenType::FullwidthPauseOrStop => true,
      TokenType::FullwidthOtherPunctuation => true,
      _ => false,
    }
  }

  fn is_normal_content(&self) -> bool {
    if self.is_letter() || self.is_single_punctuation() {
      return true;
    }
    false
  }

  fn is_single(&self) -> bool {
    if self.is_normal_content() {
      return true;
    }
    match self {
      TokenType::BracketMark => true,
      TokenType::HyperMark => true,
      TokenType::CodeContent => true,
      TokenType::HyperContent => true,
      _ => false,
    }
  }

  fn is_group(&self) -> bool {
    match self {
      TokenType::Group => true,
      _ => false,
    }
  }

  fn is_non_code_visible(&self) -> bool {
    match self {
      TokenType::WesternLetter => true,
      TokenType::CjkChar => true,
      TokenType::HalfwidthPauseOrStop => true,
      TokenType::FullwidthPauseOrStop => true,
      TokenType::HalfwidthOtherPunctuation => true,
      TokenType::FullwidthOtherPunctuation => true,
      TokenType::BracketMark => true,
      TokenType::Group => true,
      _ => false,
    }
  }

  fn is_visible(&self) -> bool {
    if self.is_non_code_visible() {
      return true;
    }
    match self {
      TokenType::CodeContent => true,
      _ => false,
    }
  }

  fn is_invisible(&self) -> bool {
    match self {
      TokenType::HyperMark => true,
      _ => false,
    }
  }

  fn is_visibility_unknown(&self) -> bool {
    match self {
      TokenType::HyperContent => true,
      _ => false,
    }
  }

}
