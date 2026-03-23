import SwiftUI

/// 12가지 감정 하트 (원본 썸원 "오늘의 기분" 참고)
enum Mood: String, CaseIterable, Codable, Identifiable {
    case inLove       // 하트눈, 빨간/핑크 — 무료
    case happy        // 미소, 핑크 — 무료
    case curious      // 물음표, 연핑크 — 무료
    case sad          // 슬픈눈, 더스티핑크 — 무료
    case crying        // 울음, 라벤더 — 무료
    case devilish     // 뿔달린, 그레이 — 무료
    case playful      // 혀내밀기, 노랑 — 프리미엄
    case excited      // 별, 오렌지 — 프리미엄
    case anxious      // 땀, 연핑크 — 프리미엄
    case sick         // 아픈, 초록 — 프리미엄
    case annoyed      // 짜증, 파랑 — 프리미엄
    case angry        // 욕, 보라 — 프리미엄

    var id: String { rawValue }

    var label: String {
        switch self {
        case .inLove: "In Love"
        case .happy: "Happy"
        case .curious: "Curious"
        case .sad: "Sad"
        case .crying: "Crying"
        case .devilish: "Mischievous"
        case .playful: "Playful"
        case .excited: "Excited"
        case .anxious: "Anxious"
        case .sick: "Sick"
        case .annoyed: "Annoyed"
        case .angry: "Angry"
        }
    }

    var isPremium: Bool {
        switch self {
        case .inLove, .happy, .curious, .sad, .crying, .devilish:
            return false
        default:
            return true
        }
    }

    /// 하트 색상 그라데이션 (위, 아래)
    var colors: (Color, Color) {
        switch self {
        case .inLove:   (Color(hex: "FF8FA8"), Color(hex: "FF5C7A"))
        case .happy:    (Color(hex: "FFB4C6"), Color(hex: "FF8FA8"))
        case .curious:  (Color(hex: "FFCDD8"), Color(hex: "FFB0C0"))
        case .sad:      (Color(hex: "D4A8B0"), Color(hex: "C09098"))
        case .crying:   (Color(hex: "B8A8D8"), Color(hex: "9888C0"))
        case .devilish: (Color(hex: "888888"), Color(hex: "606060"))
        case .playful:  (Color(hex: "FFD88A"), Color(hex: "FFC04A"))
        case .excited:  (Color(hex: "FFB060"), Color(hex: "FF8830"))
        case .anxious:  (Color(hex: "FFDDE5"), Color(hex: "FFC0D0"))
        case .sick:     (Color(hex: "A8D8A8"), Color(hex: "80C080"))
        case .annoyed:  (Color(hex: "88B8E0"), Color(hex: "6098C8"))
        case .angry:    (Color(hex: "C088D0"), Color(hex: "9860A8"))
        }
    }

    var blushColor: Color {
        let (_, bottom) = colors
        return bottom.opacity(0.4)
    }
}
