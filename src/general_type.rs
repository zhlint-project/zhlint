use crate::char_type::CharType;
use crate::token_type::TokenType;
use crate::token_type::SingleTokenType;
use crate::token_type::NormalContentTokenType;
use crate::token_type::SinglePunctuationType;
use crate::token_type::PauseOrStopType;
use crate::token_type::OtherPunctuationType;
use crate::token_type::BracketType;
use crate::token_type::QuotationType;
use crate::token_type::LetterType;
use crate::token_type::HyperTokenType;
use crate::token_type::GroupTokenType;

#[repr(isize)]
#[derive(Clone, Copy)]
pub enum NonTokenCharType {
    Space = CharType::Space as isize,
    Unknown = CharType::Unknown as isize,
    BracketType(BracketType),
    QuotationType(QuotationType),
}

#[derive(Clone, Copy)]
pub enum GeneralType {
    TokenType(TokenType),
    NonTokenCharType(NonTokenCharType),
}

// pub fn is_non_token(c: char) -> bool {
//     let char_type = get_char_type(c);
//     char_type == CharType::Space ||
//     char_type == CharType::Unknown ||
//     is_bracket(c) ||
//     is_quotation(c)
// }

pub fn is_letter_type(t: GeneralType) -> bool {
  match t {
      GeneralType::TokenType(TokenType::SingleTokenType(
          SingleTokenType::NormalContentTokenType(
              NormalContentTokenType::LetterType(_)
          )
      )) => true,
      _ => false,
  }
}

pub fn is_pause_or_stop_type(t: GeneralType) -> bool {
  match t {
      GeneralType::TokenType(TokenType::SingleTokenType(
          SingleTokenType::NormalContentTokenType(
              NormalContentTokenType::SinglePunctuationType(
                  SinglePunctuationType::PauseOrStopType(_)
              )
          )
      )) => true,
      _ => false,
  }
}

pub fn is_quotation_type(t: GeneralType) -> bool {
  match t {
      GeneralType::NonTokenCharType(NonTokenCharType::QuotationType(_)) => true,
      _ => false,
  }
}

pub fn is_bracket_type(t: GeneralType) -> bool {
  match t {
      GeneralType::NonTokenCharType(NonTokenCharType::BracketType(_)) => true,
      _ => false,
  }
}

pub fn is_other_punctuation_type(t: GeneralType) -> bool {
  match t {
      GeneralType::TokenType(TokenType::SingleTokenType(
          SingleTokenType::NormalContentTokenType(
              NormalContentTokenType::SinglePunctuationType(
                  SinglePunctuationType::OtherPunctuationType(_)
              )
          )
      )) => true,
      _ => false,
  }
}

pub fn is_single_punctuation_type(t: GeneralType) -> bool {
  match t {
      GeneralType::TokenType(TokenType::SingleTokenType(
          SingleTokenType::NormalContentTokenType(
              NormalContentTokenType::SinglePunctuationType(_)
          )
      )) => true,
      _ => false,
  }
}

pub fn is_punctuation_type(t: GeneralType) -> bool {
  is_pause_or_stop_type(t) || is_other_punctuation_type(t) || is_bracket_type(t) || is_quotation_type(t)
}

pub fn is_halfwidth_punctuation_type(t: GeneralType) -> bool {
  match t {
      GeneralType::TokenType(TokenType::SingleTokenType(
          SingleTokenType::NormalContentTokenType(
              NormalContentTokenType::SinglePunctuationType(
                  SinglePunctuationType::PauseOrStopType(
                      PauseOrStopType::HalfwidthPauseOrStop
                  )
              )
          )
      )) => true,
      GeneralType::TokenType(TokenType::SingleTokenType(
          SingleTokenType::NormalContentTokenType(
              NormalContentTokenType::SinglePunctuationType(
                  SinglePunctuationType::OtherPunctuationType(
                      OtherPunctuationType::HalfwidthOtherPunctuation
                  )
              )
          )
      )) => true,
      GeneralType::NonTokenCharType(NonTokenCharType::BracketType(
          BracketType::HalfwidthBracket
      )) => true,
      GeneralType::NonTokenCharType(NonTokenCharType::QuotationType(
          QuotationType::HalfwidthQuotation
      )) => true,
      _ => false,
  }
}

pub fn is_fullwidth_punctuation_type(t: GeneralType) -> bool {
  match t {
      GeneralType::TokenType(TokenType::SingleTokenType(
          SingleTokenType::NormalContentTokenType(
              NormalContentTokenType::SinglePunctuationType(
                  SinglePunctuationType::PauseOrStopType(
                      PauseOrStopType::FullwidthPauseOrStop
                  )
              )
          )
      )) => true,
      GeneralType::TokenType(TokenType::SingleTokenType(
          SingleTokenType::NormalContentTokenType(
              NormalContentTokenType::SinglePunctuationType(
                  SinglePunctuationType::OtherPunctuationType(
                      OtherPunctuationType::FullwidthOtherPunctuation
                  )
              )
          )
      )) => true,
      GeneralType::NonTokenCharType(NonTokenCharType::BracketType(
          BracketType::FullwidthBracket
      )) => true,
      GeneralType::NonTokenCharType(NonTokenCharType::QuotationType(
          QuotationType::FullwidthQuotation
      )) => true,
      _ => false,
  }
}

pub fn is_halfwidth_type(t: GeneralType) -> bool {
  if is_halfwidth_punctuation_type(t) {
      return true;
  }
  match t {
      GeneralType::TokenType(TokenType::SingleTokenType(
          SingleTokenType::NormalContentTokenType(
              NormalContentTokenType::LetterType(
                  LetterType::WesternLetter
              )
          )
      )) => true,
      _ => false,
  }
}

pub fn is_fullwidth_type(t: GeneralType) -> bool {
  if is_fullwidth_punctuation_type(t) {
      return true;
  }
  match t {
      GeneralType::TokenType(TokenType::SingleTokenType(
          SingleTokenType::NormalContentTokenType(
              NormalContentTokenType::LetterType(
                  LetterType::CjkChar
              )
          )
      )) => true,
      _ => false,
  }
}

pub fn is_non_code_visible_type(t: GeneralType) -> bool {
  if is_letter_type(t) || is_single_punctuation_type(t) {
      return true;
  }
  match t {
      GeneralType::TokenType(TokenType::SingleTokenType(
          SingleTokenType::HyperTokenType(
              HyperTokenType::BracketMark
          )
      )) => true,
      GeneralType::TokenType(TokenType::GroupTokenType(
          GroupTokenType::Group
      )) => true,
      _ => false,
  }
}

pub fn is_visible_type(t: GeneralType) -> bool {
  if is_non_code_visible_type(t) {
      return true;
  }
  match t {
      GeneralType::TokenType(TokenType::SingleTokenType(
          SingleTokenType::HyperTokenType(
              HyperTokenType::CodeContent
          )
      )) => true,
      _ => false,
  }
}

pub fn is_invisible_type(t: GeneralType) -> bool {
  match t {
      GeneralType::TokenType(TokenType::SingleTokenType(
          SingleTokenType::HyperTokenType(
              HyperTokenType::HyperMark
          )
      )) => true,
      _ => false,
  }
}

pub fn is_visibility_unknown_type(t: GeneralType) -> bool {
  match t {
      GeneralType::TokenType(TokenType::SingleTokenType(
          SingleTokenType::HyperTokenType(
              HyperTokenType::HyperContent
          )
      )) => true,
      _ => false,
  }
}
