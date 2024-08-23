//// Reusables

/// Marks

/**
 * Marks are hyper info, including content and wrappers.
 * They are categorized by parsers, not by usage.
 */
#[derive(Debug, Clone)]
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

#[derive(Debug, Clone)]
pub enum MarkSideType {
  Left = 0x40,
  Right = 0x41,
}

#[derive(Debug, Clone)]
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
pub struct CommonToken {
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
pub enum TokenExtraType {
  Single,
  Group(GroupTokenExtra<Token>),
}

#[derive(Debug)]
pub struct Token {
  pub base: CommonToken,
  pub extra: TokenExtraType,
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
  pub ignored_inner_space_before: bool,
}

#[derive(Debug)]
pub enum MutTokenExtraType {
  Single(MutTokenExtra),
  Group(GroupTokenExtra<MutToken>, MutGroupTokenExtra),
}

#[derive(Debug)]
pub struct MutToken {
  pub base: CommonToken,
  pub extra: MutTokenExtraType,
}

impl Token {
  pub fn to_mut(&self) -> MutToken {
    let base = CommonToken {
      token_type: self.base.token_type,
      index: self.base.index,
      length: self.base.length,
      value: self.base.value.clone(),
      space_after: self.base.space_after.clone(),
      mark: self.base.mark.clone(),
    };
    let extra = match &self.extra {
      TokenExtraType::Single => MutTokenExtraType::Single(MutTokenExtra {
        modified_token_type: base.token_type,
        ignored_token_type: false,
        modified_value: base.value.clone(),
        ignored_value: false,
        modified_space_after: base.space_after.clone(),
        ignored_space_after: false,
      }),
      TokenExtraType::Group(ref group_extra) => MutTokenExtraType::Group(
        GroupTokenExtra {
          children: group_extra.children.iter().map(|child| child.to_mut()).collect(),
          start_index: group_extra.start_index,
          start_value: group_extra.start_value.clone(),
          end_index: group_extra.end_index,
          end_value: group_extra.end_value.clone(),
          inner_space_before: group_extra.inner_space_before.clone(),
        },
        MutGroupTokenExtra {
          modified_start_value: group_extra.start_value.clone(),
          ignored_start_value: false,
          modified_end_value: group_extra.end_value.clone(),
          ignored_end_value: false,
          modified_token_type: base.token_type,
          ignored_token_type: false,
          modified_inner_space_before: group_extra.inner_space_before.clone(),
          ignored_inner_space_before: false,
        },
      ),
    };
    MutToken {
      base,
      extra,
    }
  }
}