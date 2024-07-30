//// Reusables

/// Pairs

pub struct Pair {
    pub start_index: usize,
    pub start_value: String,
    pub end_index: usize,
    pub end_value: String,
}

pub struct MutPair {
    pub modified_start_value: String,
    pub ignored_start_value: String,
    pub modified_end_value: String,
    pub ignored_end_value: String,
}

/// Marks

/**
 * Marks are hyper info, including content and wrappers.
 * They are categorized by parsers, not by usage.
 */
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

pub enum MarkSideType {
    Left = 0x40,
    Right = 0x41,
}

pub struct Mark {
    pub pair: Pair,
    pub mark_type: MarkType,
    pub meta: Option<String>, // TODO: AST type enum
}

// TODO: recursive struct

pub struct MutableMark {
    pub mark: Mark,
    pub pair: MutPair,
}

/// Raw marks

pub struct RawLeftMark {
    pub mark: Mark,
    pub code: MarkSideType, // TODO: double check
    pub right_pair: Option<RawRightMark>
}

pub struct RawRightMark {
    pub mark: Mark,
    pub code: MarkSideType, // TODO: double check
}

pub enum RawMark {
    RawLeftMark(RawLeftMark),
    RawRightMark(RawRightMark),
}

#[allow(dead_code)]
pub struct MutRawMark {
    raw_mark: RawMark,
    pair: MutPair,
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
    CodeContent,
    HyperContent,
}

/// Tokens

pub struct CommonToken {
    pub index: usize,
    pub length: usize,

    pub value: String,
    pub space_after: String,

    pub mark: Option<Mark>,
    pub mark_side: Option<MarkSideType>,
}

pub struct MutCommonToken {
    pub token: CommonToken,
    pub modified_value: String,
    pub ignored_value: String,
    pub modified_space_after: String,
    pub ignored_space_after: String,
    // TODO: validations: Validation[]
}

pub struct SingleToken {
    pub token: CommonToken,
    pub token_type: TokenType,
}

pub struct MutSingleToken {
    pub token: MutCommonToken,
    pub token_type: TokenType,
    pub modified_token_type: TokenType,
    pub ignored_token_type: TokenType,
}

pub struct GroupToken {
    pub token: CommonToken,
    pub pair: Pair,
    pub token_type: TokenType,
    pub inner_space_before: String,
    pub children: Vec<Token>,
}

pub struct MutGroupToken {
    pub token: MutCommonToken,
    pub pair: MutPair,
    pub token_type: TokenType,
    pub modified_token_type: TokenType,
    pub ignored_token_type: TokenType,
    pub modified_inner_space_before: String,
    pub ignored_inner_space_before: String,
}

pub enum Token {
    SingleToken(SingleToken),
    GroupToken(GroupToken),
}

pub enum MutToken {
    MutSingleToken(MutSingleToken),
    MutGroupToken(MutGroupToken),
}
