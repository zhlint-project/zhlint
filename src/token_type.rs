use crate::char_type::CharType;

//// Reusables

/// Pairs

#[allow(dead_code)]
pub struct Pair {
    start_index: usize,
    start_value: String,
    end_index: usize,
    end_value: String,
}

#[allow(dead_code)]
pub struct MutPair {
    modified_start_value: String,
    ignored_start_value: String,
    modified_end_value: String,
    ignored_end_value: String,
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

#[allow(dead_code)]
pub struct Mark {
    pair: Pair,
    mark_type: MarkType,
    meta: Option<String>, // TODO: AST type enum
}

// TODO: recursive struct

#[allow(dead_code)]
pub struct MutableMark {
    mark: Mark,
    pair: MutPair,
}

/// Raw marks

#[allow(dead_code)]
pub struct RawLeftMark {
    mark: Mark,
    code: MarkSideType, // TODO: double check
    right_pair: Option<RawRightMark>
}

#[allow(dead_code)]
pub struct RawRightMark {
    mark: Mark,
    code: MarkSideType, // TODO: double check
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

//// Token types

/// Token types (basic)

#[derive(Clone, Copy)]
pub enum LetterType {
    WesternLetter = CharType::WesternLetter as isize,
    CjkChar = CharType::CjkChar as isize,
}

#[derive(Clone, Copy)]
pub enum PauseOrStopType {
    HalfwidthPauseOrStop = CharType::HalfwidthPauseOrStop as isize,
    FullwidthPauseOrStop = CharType::FullwidthPauseOrStop as isize,
}

#[derive(Clone, Copy)]
pub enum QuotationType {
    HalfwidthQuotation = CharType::HalfwidthQuotation as isize,
    FullwidthQuotation = CharType::FullwidthQuotation as isize,
}

#[derive(Clone, Copy)]
pub enum BracketType {
    HalfwidthBracket = CharType::HalfwidthBracket as isize,
    FullwidthBracket = CharType::FullwidthBracket as isize,
}

#[derive(Clone, Copy)]
pub enum OtherPunctuationType {
    HalfwidthOtherPunctuation = CharType::HalfwidthOtherPunctuation as isize,
    FullwidthOtherPunctuation = CharType::FullwidthOtherPunctuation as isize,
}

/// Token types by combination

#[derive(Clone, Copy)]
pub enum SinglePunctuationType {
    PauseOrStopType(PauseOrStopType),
    OtherPunctuationType(OtherPunctuationType),
}

pub enum PunctuationType {
    SinglePunctuationType(SinglePunctuationType),
    BracketType(BracketType),
}

#[derive(Clone, Copy)]
pub enum NormalContentTokenType {
    LetterType(LetterType),
    SinglePunctuationType(SinglePunctuationType),
}

/// Token types by width

pub enum HalfwidthPunctuationType {
    HalfwidthPauseOrStop = CharType::HalfwidthPauseOrStop as isize,
    HalfwidthBracket = CharType::HalfwidthBracket as isize,
    HalfwidthQuotation = CharType::HalfwidthQuotation as isize,
    HalfwidthOtherPunctuation = CharType::HalfwidthOtherPunctuation as isize,
}

pub enum FullwidthPunctuationType {
    FullwidthPauseOrStop = CharType::FullwidthPauseOrStop as isize,
    FullwidthBracket = CharType::FullwidthBracket as isize,
    FullwidthQuotation = CharType::FullwidthQuotation as isize,
    FullwidthOtherPunctuation = CharType::FullwidthOtherPunctuation as isize,
}

#[repr(isize)]
pub enum HalfwidthTokenType {
    WesternLetter = CharType::WesternLetter as isize,
    HalfwidthPunctuationType(HalfwidthPunctuationType),
}

#[repr(isize)]
pub enum FullwidthTokenType {
    CjkChar = CharType::CjkChar as isize,
    FullwidthPunctuationType(FullwidthPunctuationType),
}

/// Hyper token types

/**
 * TODO: paired html tags should be hyper mark
 */
#[derive(Copy, Clone)]
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

/// Top-level token types

#[derive(Copy, Clone)]
pub enum GroupTokenType {
    Group = 0x60,
}

#[derive(Clone, Copy)]
pub enum SingleTokenType {
    NormalContentTokenType(NormalContentTokenType),
    HyperTokenType(HyperTokenType),
}

#[derive(Clone, Copy)]
pub enum TokenType {
    SingleTokenType(SingleTokenType),
    GroupTokenType(GroupTokenType),
}

#[repr(isize)]
pub enum NonCodeVisibleTokenType {
    BracketMark = HyperTokenType::BracketMark as isize,
    Group = GroupTokenType::Group as isize,
    NormalContentTokenType(NormalContentTokenType),
}

#[repr(isize)]
pub enum VisibleTokenType {
    CodeContent = HyperTokenType::CodeContent as isize,
    NonCodeVisibleTokenType(NonCodeVisibleTokenType),
}

pub enum InvisibleTokenType {
    HyperMark = HyperTokenType::HyperMark as isize,
}

pub enum VisibilityUnknownTokenType {
    HyperContent = HyperTokenType::HyperContent as isize,
}

/// Token type utils for width

pub fn get_halfwidth_token_type(token_type: TokenType) -> TokenType {
    match token_type {
        TokenType::SingleTokenType(
            SingleTokenType::NormalContentTokenType(
                NormalContentTokenType::LetterType(
                    LetterType::CjkChar
                )
            )
        ) => TokenType::SingleTokenType(
            SingleTokenType::NormalContentTokenType(
                NormalContentTokenType::LetterType(
                    LetterType::WesternLetter
                )
            )
        ),
        TokenType::SingleTokenType(
            SingleTokenType::NormalContentTokenType(
                NormalContentTokenType::SinglePunctuationType(
                    SinglePunctuationType::PauseOrStopType(
                        PauseOrStopType::FullwidthPauseOrStop
                    )
                )
            )
        ) => TokenType::SingleTokenType(
            SingleTokenType::NormalContentTokenType(
                NormalContentTokenType::SinglePunctuationType(
                    SinglePunctuationType::PauseOrStopType(
                        PauseOrStopType::HalfwidthPauseOrStop
                    )
                )
            )
        ),
        TokenType::SingleTokenType(
            SingleTokenType::NormalContentTokenType(
                NormalContentTokenType::SinglePunctuationType(
                    SinglePunctuationType::OtherPunctuationType(
                        OtherPunctuationType::FullwidthOtherPunctuation
                    )
                )
            )
        ) => TokenType::SingleTokenType(
            SingleTokenType::NormalContentTokenType(
                NormalContentTokenType::SinglePunctuationType(
                    SinglePunctuationType::OtherPunctuationType(
                        OtherPunctuationType::HalfwidthOtherPunctuation
                    )
                )
            )
        ),
        _ => token_type,
    }
}

pub fn get_fullwidth_token_type(token_type: TokenType) -> TokenType {
    match token_type {
        TokenType::SingleTokenType(
            SingleTokenType::NormalContentTokenType(
                NormalContentTokenType::LetterType(
                    LetterType::WesternLetter
                )
            )
        ) => TokenType::SingleTokenType(
            SingleTokenType::NormalContentTokenType(
                NormalContentTokenType::LetterType(
                    LetterType::CjkChar
                )
            )
        ),
        TokenType::SingleTokenType(
            SingleTokenType::NormalContentTokenType(
                NormalContentTokenType::SinglePunctuationType(
                    SinglePunctuationType::PauseOrStopType(
                        PauseOrStopType::HalfwidthPauseOrStop
                    )
                )
            )
        ) => TokenType::SingleTokenType(
            SingleTokenType::NormalContentTokenType(
                NormalContentTokenType::SinglePunctuationType(
                    SinglePunctuationType::PauseOrStopType(
                        PauseOrStopType::FullwidthPauseOrStop
                    )
                )
            )
        ),
        TokenType::SingleTokenType(
            SingleTokenType::NormalContentTokenType(
                NormalContentTokenType::SinglePunctuationType(
                    SinglePunctuationType::OtherPunctuationType(
                        OtherPunctuationType::HalfwidthOtherPunctuation
                    )
                )
            )
        ) => TokenType::SingleTokenType(
            SingleTokenType::NormalContentTokenType(
                NormalContentTokenType::SinglePunctuationType(
                    SinglePunctuationType::OtherPunctuationType(
                        OtherPunctuationType::FullwidthOtherPunctuation
                    )
                )
            )
        ),
        _ => token_type,
    }
}

//// Tokens

#[allow(dead_code)]
pub struct CommonToken {
    index: usize,
    length: usize,

    value: String,
    space_after: String,

    mark: Option<Mark>,
    mark_side: Option<MarkSideType>,
}

#[allow(dead_code)]
pub struct MutCommonToken {
    token: CommonToken,
    modified_value: String,
    ignored_value: String,
    modified_space_after: String,
    ignored_space_after: String,
    // TODO: validations: Validation[]
}

#[allow(dead_code)]
pub struct SingleToken {
    token: CommonToken,
    token_type: SingleTokenType,
}

#[allow(dead_code)]
pub struct MutSingleToken {
    token: MutCommonToken,
    token_type: SingleTokenType,
    modified_token_type: SingleTokenType,
    ignored_token_type: SingleTokenType,
}

#[allow(dead_code)]
pub struct GroupToken {
    token: CommonToken,
    pair: Pair,
    token_type: GroupTokenType,
    inner_space_before: String,
    // TODO: Array<Token>
}

#[allow(dead_code)]
pub struct MutGroupToken {
    token: MutCommonToken,
    pair: MutPair,
    token_type: GroupTokenType,
    modified_token_type: GroupTokenType,
    ignored_token_type: GroupTokenType,
    modified_inner_space_before: String,
    ignored_inner_space_before: String,
}

pub enum Token {
    SingleToken(SingleToken),
    GroupToken(GroupToken),
}

pub enum MutToken {
    MutSingleToken(MutSingleToken),
    MutGroupToken(MutGroupToken),
}
