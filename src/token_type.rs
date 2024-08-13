//// Reusables

/// Marks

/**
 * Marks are hyper info, including content and wrappers.
 * They are categorized by parsers, not by usage.
 */
#[derive(Debug)]
pub enum MarkType {
  /**
   * Brackets
   */
  Brackets = 0x30,
  /**
   * Inline Markdown marks
   */
  Hyper = 0x31,
  /**
   * - \`xxx\`
   * - &lt;code&gt;xxx&lt;/code&gt;
   * - Hexo/VuePress container
   * - Other html code
   */
  Raw = 0x32,
}

#[derive(Debug)]
pub enum MarkSideType {
  Left = 0x40,
  Right = 0x41,
}

#[derive(Debug)]
pub struct Mark {
  pub mark_type: MarkType,
  pub mark_side: MarkSideType,
  pub meta: Option<String>, // TODO: AST type enum
}

/// Hyper token types

/**
 * TODO: paired html tags should be hyper mark
 */
pub enum HyperTokenType {
  /**
   * Brackets
   */
  BracketMark = 0x50,
  /**
   * Inline Markdown marks
   */
  HyperMark = 0x51,

  /**
   * - \`xxx\`
   * - &lt;code&gt;xxx&lt;/code&gt;
   */
  CodeContent = 0x52,
  /**
   * - Hexo/VuePress container
   * - Other html code
   */
  HyperContent = 0x53,

  /**
   * Unpaired brackets/quotations
   */
  Unmatched = 0x54,
  /**
   * For indeterminate tokens
   */
  Indeterminate = 0x55,
}

/// Token Types

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum TokenType {
  WesternLetter,
  CjkChar,
  HalfwidthPauseOrStop,
  FullwidthPauseOrStop,
  HalfwidthOtherPunctuation,
  FullwidthOtherPunctuation,
  Group,
  BracketMark,
  HyperMark,
  UnmatchedMark, // TODO: adapt other type trait logics
  CodeContent,
  HyperContent,
}

/// Tokens

#[derive(Debug)]
pub struct NewCommonToken {
  // pub id: usize,
  // pub parent_id: usize,

  pub token_type: TokenType,

  pub index: usize,
  pub length: usize,

  pub value: String,
  pub space_after: String,

  pub mark: Option<Mark>,
}

#[derive(Debug)]
pub struct GroupTokenExtra<T> {
  pub start_index: usize,
  pub start_value: String,
  pub end_index: usize,
  pub end_value: String,
  pub inner_space_before: String,
  pub children: Vec<T>,
}

#[derive(Debug)]
pub enum NewTokenExtraType {
  Single,
  Group(GroupTokenExtra<NewToken>),
}

#[derive(Debug)]
pub struct NewToken {
  pub base: NewCommonToken,
  pub extra: NewTokenExtraType,
}

#[derive(Debug)]
pub struct MutTokenExtra {
  pub modified_token_type: TokenType,
  pub ignored_token_type: bool,
  pub modified_value: String,
  pub ignored_value: bool,
  pub modified_space_after: String,
  pub ignored_space_after: bool,
}

#[derive(Debug)]
pub struct MutGroupTokenExtra {
  pub modified_start_value: String,
  pub ignored_start_value: bool,
  pub modified_end_value: String,
  pub ignored_end_value: bool,
  pub modified_token_type: TokenType,
  pub ignored_token_type: bool,
  pub modified_inner_space_before: String,
  pub ignored_inner_space_before: String,
}

#[derive(Debug)]
pub enum NewMutTokenExtraType {
  Single(MutTokenExtra),
  Group(GroupTokenExtra<NewMutToken>, MutGroupTokenExtra),
}

#[derive(Debug)]
pub struct NewMutToken {
  pub token: NewCommonToken,
  pub extra: NewMutTokenExtraType,
}
