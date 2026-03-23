import Foundation

struct PetMessages {
    static let all = [
        "Have a wonderful day! ☀️",
        "I love seeing you two together 💕",
        "Don't forget to tell them you love them!",
        "You two are the cutest! 🥰",
        "What are you grateful for today?",
        "Send your partner a sweet message!",
        "Today is a great day to make memories!",
        "Remember why you fell in love 💗",
        "A little kindness goes a long way!",
        "You're doing amazing, sweetie!",
        "Time for today's question! 📝",
        "Love grows when you share it ✨",
        "Have you hugged them today?",
        "Every day with you is special!",
        "Keep that beautiful smile! 😊",
        "Adventures await you two! 🌈",
        "Home is wherever you are together 🏠",
        "Your love story is my favorite! 📖",
        "Sprinkle some love today! 💫",
        "Together is the best place to be!",
    ]

    static var random: String {
        all.randomElement() ?? "Have a great day!"
    }
}

struct EmojiAvatars {
    static let all = ["😊", "😎", "🥰", "😄", "🤗", "😇", "🐱", "🐶", "🦊", "🐰", "🐻", "🐼"]
}
