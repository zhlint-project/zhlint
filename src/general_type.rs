use crate::{char_type::CharType, token_type::NewTokenType};

pub fn char_type_to_token_type(char_type: CharType) -> Option<NewTokenType> {
    match char_type {
        CharType::WesternLetter => Some(NewTokenType::WesternLetter),
        CharType::CjkChar => Some(NewTokenType::CjkChar),
        CharType::HalfwidthPauseOrStop => Some(NewTokenType::HalfwidthPauseOrStop),
        CharType::FullwidthPauseOrStop => Some(NewTokenType::FullwidthPauseOrStop),
        CharType::HalfwidthOtherPunctuation => Some(NewTokenType::HalfwidthOtherPunctuation),
        CharType::FullwidthOtherPunctuation => Some(NewTokenType::FullwidthOtherPunctuation),
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

impl TypeTrait for NewTokenType {
    fn is_letter(&self) -> bool {
        match self {
            NewTokenType::WesternLetter => true,
            NewTokenType::CjkChar => true,
            _ => false,
        }
    }

    fn is_pause_or_stop(&self) -> bool {
        match self {
            NewTokenType::HalfwidthPauseOrStop => true,
            NewTokenType::FullwidthPauseOrStop => true,
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
            NewTokenType::HalfwidthOtherPunctuation => true,
            NewTokenType::FullwidthOtherPunctuation => true,
            _ => false,
        }
    }

    fn is_single_punctuation(&self) -> bool {
        match self {
            NewTokenType::HalfwidthPauseOrStop => true,
            NewTokenType::FullwidthPauseOrStop => true,
            NewTokenType::HalfwidthOtherPunctuation => true,
            NewTokenType::FullwidthOtherPunctuation => true,
            _ => false,
        }
    }

    fn is_punctuation(&self) -> bool {
        match self {
            NewTokenType::HalfwidthPauseOrStop => true,
            NewTokenType::FullwidthPauseOrStop => true,
            NewTokenType::HalfwidthOtherPunctuation => true,
            NewTokenType::FullwidthOtherPunctuation => true,
            _ => false,
        }
    }

    fn is_halfwidth_punctuation(&self) -> bool {
        match self {
            NewTokenType::HalfwidthPauseOrStop => true,
            NewTokenType::HalfwidthOtherPunctuation => true,
            _ => false,
        }
    }

    fn is_fullwidth_punctuation(&self) -> bool {
        match self {
            NewTokenType::FullwidthPauseOrStop => true,
            NewTokenType::FullwidthOtherPunctuation => true,
            _ => false,
        }
    }

    fn is_halfwidth(&self) -> bool {
        match self {
            NewTokenType::WesternLetter => true,
            NewTokenType::HalfwidthPauseOrStop => true,
            NewTokenType::HalfwidthOtherPunctuation => true,
            _ => false,
        }
    }

    fn is_fullwidth(&self) -> bool {
        match self {
            NewTokenType::CjkChar => true,
            NewTokenType::FullwidthPauseOrStop => true,
            NewTokenType::FullwidthOtherPunctuation => true,
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
            NewTokenType::BracketMark => true,
            NewTokenType::HyperMark => true,
            NewTokenType::CodeContent => true,
            NewTokenType::HyperContent => true,
            _ => false,
        }
    }

    fn is_group(&self) -> bool {
        match self {
            NewTokenType::Group => true,
            _ => false,
        }
    }

    fn is_non_code_visible(&self) -> bool {
        match self {
            NewTokenType::WesternLetter => true,
            NewTokenType::CjkChar => true,
            NewTokenType::HalfwidthPauseOrStop => true,
            NewTokenType::FullwidthPauseOrStop => true,
            NewTokenType::HalfwidthOtherPunctuation => true,
            NewTokenType::FullwidthOtherPunctuation => true,
            NewTokenType::BracketMark => true,
            NewTokenType::Group => true,
            _ => false,
        }
    }

    fn is_visible(&self) -> bool {
        if self.is_non_code_visible() {
            return true;
        }
        match self {
            NewTokenType::CodeContent => true,
            _ => false,
        }
    }

    fn is_invisible(&self) -> bool {
        match self {
            NewTokenType::HyperMark => true,
            _ => false,
        }
    }

    fn is_visibility_unknown(&self) -> bool {
        match self {
            NewTokenType::HyperContent => true,
            _ => false,
        }
    }

}

// pub fn get_halfwidth_token_type(token_type: TokenType) -> TokenType {
//     match token_type {
//         TokenType::SingleTokenType(
//             SingleTokenType::NormalContentTokenType(
//                 NormalContentTokenType::LetterType(
//                     LetterType::CjkChar
//                 )
//             )
//         ) => TokenType::SingleTokenType(
//             SingleTokenType::NormalContentTokenType(
//                 NormalContentTokenType::LetterType(
//                     LetterType::WesternLetter
//                 )
//             )
//         ),
//         TokenType::SingleTokenType(
//             SingleTokenType::NormalContentTokenType(
//                 NormalContentTokenType::SinglePunctuationType(
//                     SinglePunctuationType::PauseOrStopType(
//                         PauseOrStopType::FullwidthPauseOrStop
//                     )
//                 )
//             )
//         ) => TokenType::SingleTokenType(
//             SingleTokenType::NormalContentTokenType(
//                 NormalContentTokenType::SinglePunctuationType(
//                     SinglePunctuationType::PauseOrStopType(
//                         PauseOrStopType::HalfwidthPauseOrStop
//                     )
//                 )
//             )
//         ),
//         TokenType::SingleTokenType(
//             SingleTokenType::NormalContentTokenType(
//                 NormalContentTokenType::SinglePunctuationType(
//                     SinglePunctuationType::OtherPunctuationType(
//                         OtherPunctuationType::FullwidthOtherPunctuation
//                     )
//                 )
//             )
//         ) => TokenType::SingleTokenType(
//             SingleTokenType::NormalContentTokenType(
//                 NormalContentTokenType::SinglePunctuationType(
//                     SinglePunctuationType::OtherPunctuationType(
//                         OtherPunctuationType::HalfwidthOtherPunctuation
//                     )
//                 )
//             )
//         ),
//         _ => token_type,
//     }
// }

// pub fn get_fullwidth_token_type(token_type: TokenType) -> TokenType {
//     match token_type {
//         TokenType::SingleTokenType(
//             SingleTokenType::NormalContentTokenType(
//                 NormalContentTokenType::LetterType(
//                     LetterType::WesternLetter
//                 )
//             )
//         ) => TokenType::SingleTokenType(
//             SingleTokenType::NormalContentTokenType(
//                 NormalContentTokenType::LetterType(
//                     LetterType::CjkChar
//                 )
//             )
//         ),
//         TokenType::SingleTokenType(
//             SingleTokenType::NormalContentTokenType(
//                 NormalContentTokenType::SinglePunctuationType(
//                     SinglePunctuationType::PauseOrStopType(
//                         PauseOrStopType::HalfwidthPauseOrStop
//                     )
//                 )
//             )
//         ) => TokenType::SingleTokenType(
//             SingleTokenType::NormalContentTokenType(
//                 NormalContentTokenType::SinglePunctuationType(
//                     SinglePunctuationType::PauseOrStopType(
//                         PauseOrStopType::FullwidthPauseOrStop
//                     )
//                 )
//             )
//         ),
//         TokenType::SingleTokenType(
//             SingleTokenType::NormalContentTokenType(
//                 NormalContentTokenType::SinglePunctuationType(
//                     SinglePunctuationType::OtherPunctuationType(
//                         OtherPunctuationType::HalfwidthOtherPunctuation
//                     )
//                 )
//             )
//         ) => TokenType::SingleTokenType(
//             SingleTokenType::NormalContentTokenType(
//                 NormalContentTokenType::SinglePunctuationType(
//                     SinglePunctuationType::OtherPunctuationType(
//                         OtherPunctuationType::FullwidthOtherPunctuation
//                     )
//                 )
//             )
//         ),
//         _ => token_type,
//     }
// }

