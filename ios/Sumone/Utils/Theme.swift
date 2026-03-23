import SwiftUI

// MARK: - Color Theme
extension Color {
    static let theme = ColorTheme()
}

struct ColorTheme {
    let primary = Color(hex: "FF6B8A")
    let primaryLight = Color(hex: "FFB4C6")
    let primaryDark = Color(hex: "E84D6E")

    let background = Color(hex: "FFF8F0")
    let surface = Color.white
    let surfaceWarm = Color(hex: "FFF3E0")

    let text = Color(hex: "2D2D2D")
    let textSecondary = Color(hex: "8E8E8E")
    let textLight = Color(hex: "BDBDBD")

    let accent = Color(hex: "FFD54F")
    let heart = Color(hex: "FF4D6A")
    let border = Color(hex: "F0E8E0")

    let success = Color(hex: "4CAF50")
    let error = Color(hex: "FF5252")
}

// MARK: - Hex Color Init
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Typography
struct AppFont {
    static func logo(_ size: CGFloat = 42) -> Font {
        .system(size: size, weight: .bold, design: .serif)
    }
    static let title = Font.system(size: 28, weight: .bold)
    static let headline = Font.system(size: 20, weight: .semibold)
    static let body = Font.system(size: 16, weight: .regular)
    static let caption = Font.system(size: 14, weight: .regular)
    static let small = Font.system(size: 12, weight: .regular)
}
