import Foundation

struct Profile: Codable, Identifiable {
    let id: UUID
    var displayName: String
    var profileEmoji: String?
    var coupleId: UUID?
    var createdAt: Date?

    enum CodingKeys: String, CodingKey {
        case id
        case displayName = "display_name"
        case profileEmoji = "profile_emoji"
        case coupleId = "couple_id"
        case createdAt = "created_at"
    }
}

struct Couple: Codable, Identifiable {
    let id: UUID
    let user1Id: UUID
    var user2Id: UUID?
    let inviteCode: String
    var anniversaryDate: String?
    var createdAt: Date?

    enum CodingKeys: String, CodingKey {
        case id
        case user1Id = "user1_id"
        case user2Id = "user2_id"
        case inviteCode = "invite_code"
        case anniversaryDate = "anniversary_date"
        case createdAt = "created_at"
    }

    var isConnected: Bool { user2Id != nil }
}

struct Question: Codable, Identifiable {
    let id: Int
    let text: String
    let category: String
    let sortOrder: Int

    enum CodingKeys: String, CodingKey {
        case id, text, category
        case sortOrder = "sort_order"
    }
}

struct DailyQuestion: Codable, Identifiable {
    let id: UUID
    let coupleId: UUID
    let questionId: Int
    let assignedDate: String
    var createdAt: Date?

    enum CodingKeys: String, CodingKey {
        case id
        case coupleId = "couple_id"
        case questionId = "question_id"
        case assignedDate = "assigned_date"
        case createdAt = "created_at"
    }
}

struct Answer: Codable, Identifiable {
    let id: UUID
    let dailyQuestionId: UUID
    let userId: UUID
    let text: String
    var createdAt: Date?

    enum CodingKeys: String, CodingKey {
        case id, text
        case dailyQuestionId = "daily_question_id"
        case userId = "user_id"
        case createdAt = "created_at"
    }
}

// View-level model for today's question
struct TodayQuestion {
    let dailyQuestionId: UUID
    let questionText: String
    let questionNumber: Int
    let assignedDate: String
    var myAnswer: String?
    var partnerAnswer: String?
}
