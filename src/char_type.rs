use regex::Regex;
// use core::iter::Map;
// use std::collections::HashMap;

/**
 * NOTE:
 * - U+FE41 PRESENTATION FORM FOR VERTICAL LEFT CORNER BRACKET -> U+300C LEFT CORNER BRACKET, etc.
 * - U+2E3A TWO-EM DASH, U+2014 EM DASH x2
 * - U+2026 HORIZONTAL ELLIPSIS, U+22EF MIDLINE HORIZONTAL ELLIPSIS
 * - U+25CF BLACK CIRCLE (emphasis dots), U+2022 BULLET (emphasis dots), U+00B7 MIDDLE DOT (interpuncts),
 *   U+2027 HYPHENATION POINT, U+2022 BULLET, U+30FB KATAKANA MIDDLE DOT
 *
 * Decoration marks:
 * - emphasis dots: U+25CF BLACK CIRCLE, U+2022 BULLET
 * - book title marks: U+FE4F WAVY LOW LINE
 * - proper noun marks: U+FF3F FULLWIDTH LOW LINE
 */

 #[derive(Debug, PartialEq)]
pub enum CharType {
    Space,

    WesternLetter,
    CjkChar,

    // periods, commas, secondary commas, colons, semicolons, exclamation marks, question marks, etc.
    HalfwidthPauseOrStop,
    FullwidthPauseOrStop,

    // single, double, corner, white corner
    // + book title marks
    // left x right
    HalfwidthQuotation,
    FullwidthQuotation,

    // parentheses
    HalfwidthBracket,
    FullwidthBracket,

    // dashes, ellipsis, connector marks, interpuncts, proper noun marks, solidi, etc.
    HalfwidthOtherPunctuation,
    FullwidthOtherPunctuation,

    Unknown,
}

const HALFWIDTH_PAUSE_OR_STOP: [char; 6] = [
    ',', '.', ';', ':', '?', '!',
];
const FULLWIDTH_PAUSE_OR_STOP: [char; 10] = [
    // normal punctuation marks
    '，', '。', '；', '：', '？', '！',
    // special punctuation marks
    '⁈', '⁇', '‼', '⁉',
];
const HALFWIDTH_QUOTATION: [char; 2] = [
    '"', '\'',
];
const FULLWIDTH_QUOTATION: [char; 16] = [
    '“', '”', '‘', '’',
    '《', '》', '〈', '〉',
    '『', '』', '「', '」',
    '【', '】', '〖', '〗',
];
const HALFWIDTH_BRACKET: [char; 6] = [
    '(', ')', '[', ']', '{', '}',
];
const FULLWIDTH_BRACKET: [char; 8] = [
    '（', '）', '〔', '〕', '［', '］', '｛', '｝',
];
const HALFWIDTH_OTHER_PUNCTUATION: [char; 19] = [
    // on-keyboard symbols
    '~', '-', '+', '*', '/', '\\', '%', '=', '&', '|', '`', '<', '>', '@', '#', '$', '^',
    // symbols of death
    '†', '‡'
];
const FULLWIDTH_OTHER_PUNCTUATION: [char; 10] = [
    // U+2E3A TWO-EM DASH, U+2014 EM DASH
    '—', '⸺',
    // U+2026 HORIZONTAL ELLIPSIS, U+22EF MIDLINE HORIZONTAL ELLIPSIS
    '…', '⋯',
    // U+FF5E FULLWIDTH TILDE
    '～',
    // U+25CF BLACK CIRCLE, U+2022 BULLET, U+00B7 MIDDLE DOT,
    // U+2027 HYPHENATION POINT, U+30FB KATAKANA MIDDLE DOT
    '●', '•', '·', '‧', '・'
];

fn is_match(c: char, pattern: &str) -> bool {
    let re = Regex::new(pattern).unwrap();
    re.is_match(&c.to_string())
}

/**
 * Check whether the character is full-width or half-width,
 * content or punctuation, or empty, or space, or emoji etc.
 * Refs:
 * - https://unicode.org/charts/
 * - https://jrgraphix.net/research/unicode.php
 * - https://mathiasbynens.be/notes/javascript-unicode
 * - https://stackoverflow.com/a/21113538
 * - https://www.w3.org/International/clreq/#categories_and_usage_of_punctuation_marks
 */
pub fn get_char_type(c: char) -> CharType {
    // space
    if is_match(c, "\\s") {
        return CharType::Space;
    }

    // punctuation marks
    if HALFWIDTH_PAUSE_OR_STOP.contains(&c) {
        return CharType::HalfwidthPauseOrStop;
    } else if FULLWIDTH_PAUSE_OR_STOP.contains(&c) {
        return CharType::FullwidthPauseOrStop;
    } else if HALFWIDTH_QUOTATION.contains(&c) {
        return CharType::HalfwidthQuotation;
    } else if FULLWIDTH_QUOTATION.contains(&c) {
        return CharType::FullwidthQuotation;
    } else if HALFWIDTH_BRACKET.contains(&c) {
        return CharType::HalfwidthBracket;
    } else if FULLWIDTH_BRACKET.contains(&c) {
        return CharType::FullwidthBracket;
    } else if HALFWIDTH_OTHER_PUNCTUATION.contains(&c) {
        return CharType::HalfwidthOtherPunctuation;
    } else if FULLWIDTH_OTHER_PUNCTUATION.contains(&c) {
        return CharType::FullwidthOtherPunctuation;
    }

    // 0-9
    if is_match(c, "[0-9]") {
        return CharType::WesternLetter;
    }

    // Basic Latin
    if is_match(c, "[\\u0020-\\u007F]") {
        return CharType::WesternLetter;
    }

    // Latin-1 Supplement
    if is_match(c, "[\\u00A0-\\u00FF]") {
        return CharType::WesternLetter;
    }
    // Latin Extended-A
    if is_match(c, "[\\u0100-\\u017F]") {
        return CharType::WesternLetter;
    }
    // Latin Extended-B
    if is_match(c, "[\\u0180-\\u024F]") {
        return CharType::WesternLetter;
    }
    // Greek and Coptic
    if is_match(c, "[\\u0370-\\u03FF]") {
        return CharType::WesternLetter;
    }

    // CJK Unified Ideographs
    if is_match(c, "[\\u4E00-\\u9FFF]") {
        return CharType::CjkChar
    }
    // CJK Unified Ideographs Extension A
    if is_match(c, "[\\u3400-\\u4DBF]") {
        return CharType::CjkChar
    }
    // CJK Unified Ideographs Extension B
    if is_match(c, "[\\ud840-\\ud868][\\udc00-\\udfff]|\\ud869[\\udc00-\\uded6]") {
        return CharType::CjkChar
    }
    // CJK Unified Ideographs Extension C
    if is_match(c, "\\ud869[\\udf00-\\udfff]|[\\ud86a-\\ud86c][\\udc00-\\udfff]|\\ud86d[\\udc00-\\udf34]") {
        return CharType::CjkChar
    }
    // CJK Unified Ideographs Extension D
    if is_match(c, "\\ud86d[\\udf40-\\udfff]|\\ud86e[\\udc00-\\udc1d]") {
        return CharType::CjkChar
    }
    // CJK Compatibility Ideographs
    if is_match(c, "[\\uF900-\\uFAFF]") {
        return CharType::CjkChar
    }
    // CJK Compatibility Forms
    if is_match(c, "[\\uFE30-\\uFE4F]") {
        return CharType::CjkChar
    }
    // CJK Radicals Supplement
    if is_match(c, "[\\u2E80-\\u2EFF]") {
        return CharType::CjkChar
    }
    // Private Use Area (part)
    if is_match(c, "[\\uE815-\\uE864]") {
        return CharType::CjkChar
    }
    // CJK Unified Ideographs Extension B
    if is_match(c, "[\\u{20000}-\\u{2A6DF}]") {
        return CharType::CjkChar
    }
    // CJK Compatibility Ideographs Supplement
    if is_match(c, "[\\u{2F800}-\\u{2FA1F}]") {
        return CharType::CjkChar
    }

    // CJK Symbols and Punctuation
    if is_match(c, "[\\u3000-\\u303F]") {
        return CharType::FullwidthOtherPunctuation
    }

    return CharType::Unknown;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_char_type() {
        assert_eq!(get_char_type(' '), CharType::Space);
        assert_eq!(get_char_type('a'), CharType::WesternLetter);
        assert_eq!(get_char_type('A'), CharType::WesternLetter);
        assert_eq!(get_char_type('0'), CharType::WesternLetter);
        assert_eq!(get_char_type('9'), CharType::WesternLetter);
        assert_eq!(get_char_type(','), CharType::HalfwidthPauseOrStop);
        assert_eq!(get_char_type('.'), CharType::HalfwidthPauseOrStop);
        assert_eq!(get_char_type(';'), CharType::HalfwidthPauseOrStop);
        assert_eq!(get_char_type(':'), CharType::HalfwidthPauseOrStop);
        assert_eq!(get_char_type('?'), CharType::HalfwidthPauseOrStop);
        assert_eq!(get_char_type('!'), CharType::HalfwidthPauseOrStop);
        assert_eq!(get_char_type('，'), CharType::FullwidthPauseOrStop);
        assert_eq!(get_char_type('。'), CharType::FullwidthPauseOrStop);
        assert_eq!(get_char_type('；'), CharType::FullwidthPauseOrStop);
        assert_eq!(get_char_type('：'), CharType::FullwidthPauseOrStop);
        assert_eq!(get_char_type('？'), CharType::FullwidthPauseOrStop);
        assert_eq!(get_char_type('！'), CharType::FullwidthPauseOrStop);
        assert_eq!(get_char_type('⁈'), CharType::FullwidthPauseOrStop);
        assert_eq!(get_char_type('⁇'), CharType::FullwidthPauseOrStop);
        assert_eq!(get_char_type('‼'), CharType::FullwidthPauseOrStop);
        assert_eq!(get_char_type('⁉'), CharType::FullwidthPauseOrStop);
        assert_eq!(get_char_type('"'), CharType::HalfwidthQuotation);
        assert_eq!(get_char_type('\''), CharType::HalfwidthQuotation);
        assert_eq!(get_char_type('“'), CharType::FullwidthQuotation);
        assert_eq!(get_char_type('”'), CharType::FullwidthQuotation);
        assert_eq!(get_char_type('‘'), CharType::FullwidthQuotation);
        assert_eq!(get_char_type('’'), CharType::FullwidthQuotation);
    }
}

// Char

pub const LEFT_BRACKET: [char; 7] = ['(', '[', '{', '（', '〔', '［', '｛'];
pub const RIGHT_BRACKET: [char; 7] = [')', ']', '}', '）', '〕', '］', '｝'];
pub const LEFT_QUOTATION: [char; 8] = ['“', '‘', '《', '〈', '『', '「', '【', '〖'];
pub const RIGHT_QUOTATION: [char; 8] = ['”', '’', '》', '〉', '』', '」', '】', '〗'];
pub const NEUTRAL_QUOTATION: [char; 2] = ['"', '\''];

// TODO: hashmap
// const SHORTHAND_PAIR: HashMap<char, char> = [
//     ('’', '‘'),
//     ('\'', '\''),
// ].iter().cloned().collect();

const FULLWIDTH_PAIRS: [char; 24] = [
    '“', '”', '‘', '’',
    '（', '）', '〔', '〕', '［', '］', '｛', '｝',
    '《', '》', '〈', '〉',
    '『', '』', '「', '」', '【', '】', '〖', '〗',
];

pub fn is_fullwidth_pair(c: char) -> bool {
    FULLWIDTH_PAIRS.contains(&c)
}

// Reusable

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

// Mark

/**
 * Marks are hyper info, including content and wrappers.
 * They are categorized by parsers, not by usage.
 */
pub enum MarkType {
    /**
     * Brackets
     */
    Brackets,
    /**
     * Inline Markdown marks
     */
    Hyper,
    /**
     * - \`xxx\`
     * - &lt;code&gt;xxx&lt;/code&gt;
     * - Hexo/VuePress container
     * - Other html code
     */
    Raw,
}

pub enum MarkSideType {
    Left,
    Right,
}

#[allow(dead_code)]
pub struct Mark {
    pair: Pair,
    mark_type: MarkType,
    meta: Option<String>, // TODO: AST type enum
}

// TODO: recursive struct

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
pub struct MutableMark {
    mark: Mark,
    pair: MutPair,
}

#[allow(dead_code)]
pub struct MutRawMark {
    raw_mark: RawMark,
    pair: MutPair,
}

// Token type

pub enum LetterType {
    WesternLetter = CharType::WesternLetter as isize,
    CjkChar = CharType::CjkChar as isize,
}

pub enum PauseOrStopType {
    HalfwidthPauseOrStop = CharType::HalfwidthPauseOrStop as isize,
    FullwidthPauseOrStop = CharType::FullwidthPauseOrStop as isize,
}

pub enum QuotationType {
    HalfwidthQuotation = CharType::HalfwidthQuotation as isize,
    FullwidthQuotation = CharType::FullwidthQuotation as isize,
}

pub enum BracketType {
    HalfwidthBracket = CharType::HalfwidthBracket as isize,
    FullwidthBracket = CharType::FullwidthBracket as isize,
}

pub enum OtherPunctuationType {
    HalfwidthOtherPunctuation = CharType::HalfwidthOtherPunctuation as isize,
    FullwidthOtherPunctuation = CharType::FullwidthOtherPunctuation as isize,
}

pub enum SinglePunctuationType {
    PauseOrStopType(PauseOrStopType),
    OtherPunctuationType(OtherPunctuationType),
}

pub enum PunctuationType {
    SinglePunctuationType(SinglePunctuationType),
    BracketType(BracketType),
}

pub enum NormalContentTokenType {
    LetterType(LetterType),
    SinglePunctuationType(SinglePunctuationType),
}

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

/**
 * TODO: paired html tags should be hyper mark
 */
pub enum HyperTokenType {
    /**
     * Brackets
     */
    BracketMark,
    /**
     * Inline Markdown marks
     */
    HyperMark,

    /**
     * - \`xxx\`
     * - &lt;code&gt;xxx&lt;/code&gt;
     */
    CodeContent,
    /**
     * - Hexo/VuePress container
     * - Other html code
     */
    HyperContent,

    /**
     * Unpaired brackets/quotations
     */
    Unmatched,
    /**
     * For indeterminate tokens
     */
    Indeterminate,
}

pub enum GroupTokenType {
    Group,
}

pub enum SingleTokenType {
    NormalContentTokenType(NormalContentTokenType),
    HyperTokenType(HyperTokenType),
}

pub enum TokenType {
    SingleTokenType(SingleTokenType),
    GroupTokenType(GroupTokenType),
}

#[repr(isize)]
pub enum NonTokenCharType {
    Space = CharType::Space as isize,
    Unknown = CharType::Unknown as isize,
    BracketType(BracketType),
    QuotationType(QuotationType),
}

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

#[repr(isize)]
enum NonCodeVisibleTokenType {
    BracketMark = HyperTokenType::BracketMark as isize,
    Group = GroupTokenType::Group as isize,
    NormalContentTokenType(NormalContentTokenType),
}

#[repr(isize)]
enum VisibleTokenType {
    CodeContent = HyperTokenType::CodeContent as isize,
    NonCodeVisibleTokenType(NonCodeVisibleTokenType),
}

enum InvisibleTokenType {
    HyperMark = HyperTokenType::HyperMark as isize,
}

enum VisibilityUnknownTokenType {
    HyperContent = HyperTokenType::HyperContent as isize,
}

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

// Token

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

pub struct SingleToken {
    token: CommonToken,
    token_type: SingleTokenType,
}

pub struct MutSingleToken {
    token: MutCommonToken,
    token_type: SingleTokenType,
    modified_token_type: SingleTokenType,
    ignored_token_type: SingleTokenType,
}

pub struct GroupToken {
    token: CommonToken,
    pair: Pair,
    token_type: GroupTokenType,
    inner_space_before: String,
    // TODO: Array<Token>
}

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
