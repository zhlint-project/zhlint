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
  Single = 0x42,
}

#[derive(Debug, Clone)]
pub struct Mark {
  pub mark_type: MarkType,
  pub mark_side: MarkSideType,
}

/// Token Types

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum TokenType {
  // regular tokens
  WesternLetter,
  CjkChar,
  HalfwidthPauseOrStop,
  FullwidthPauseOrStop,
  HalfwidthOtherPunctuation,
  FullwidthOtherPunctuation,

  // special tokens
  Group, // e.g. “”
  BracketMark, // e.g. ()

  // hyper tokens
  HyperMark, // Markdown mark pair e.g. ** __ ~~
  CodeMark, // Markdown code e.g. `xxx`
  HyperContent, // Markdown content, Markdown connectors, HTML tags

  // unexpected tokens
  UnmatchedMark, // TODO: adapt other type trait logics
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

impl MutToken {
  pub fn to_string(&self) -> String {
    let mut s = String::new();
    match &self.extra {
      MutTokenExtraType::Single(mut_extra) => {
        if mut_extra.ignored_value {
          s.push_str(self.base.value.as_str());
        } else {
          s.push_str(mut_extra.modified_value.as_str());
        }
        if mut_extra.ignored_space_after {
          s.push_str(self.base.space_after.as_str());
        } else {
          s.push_str(mut_extra.modified_space_after.as_str());
        }
      },
      MutTokenExtraType::Group(extra, mut_extra) => {
        if mut_extra.ignored_start_value {
          s.push_str(extra.start_value.as_str());
        } else {
          s.push_str(mut_extra.modified_start_value.as_str());
        }
        if mut_extra.ignored_inner_space_before {
          s.push_str(extra.inner_space_before.as_str());
        } else {
          s.push_str(mut_extra.modified_inner_space_before.as_str());
        }
        for child in extra.children.iter() {
          s.push_str(child.to_string().as_str());
        }
        if mut_extra.ignored_end_value {
          s.push_str(extra.end_value.as_str());
        } else {
          s.push_str(mut_extra.modified_end_value.as_str());
        }
      },
    }
    s
  }
}