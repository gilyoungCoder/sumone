import Foundation
import Supabase

@MainActor
class QuestionViewModel: ObservableObject {
    @Published var todayQuestion: TodayQuestion?
    @Published var isLoading = false
    @Published var isSubmitting = false
    @Published var errorMessage: String?

    private let supabase = SupabaseService.shared

    private var todayString: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: Date())
    }

    // MARK: - Fetch Today's Question

    func fetchTodayQuestion(coupleId: UUID, userId: UUID) async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            let dailyQuestion = try await getOrCreateDailyQuestion(coupleId: coupleId)

            // Get question text
            let question: Question = try await supabase.db
                .from("questions")
                .select()
                .eq("id", value: dailyQuestion.questionId)
                .single()
                .execute()
                .value

            // Get partner ID
            let couple: Couple = try await supabase.db
                .from("couples")
                .select()
                .eq("id", value: coupleId.uuidString)
                .single()
                .execute()
                .value

            let partnerId = couple.user1Id == userId ? couple.user2Id : couple.user1Id

            // Fetch answers for this daily question
            let answers: [Answer] = try await supabase.db
                .from("answers")
                .select()
                .eq("daily_question_id", value: dailyQuestion.id.uuidString)
                .execute()
                .value

            let myAnswer = answers.first(where: { $0.userId == userId })?.text
            let partnerAnswer = partnerId != nil
                ? answers.first(where: { $0.userId == partnerId })?.text
                : nil

            todayQuestion = TodayQuestion(
                dailyQuestionId: dailyQuestion.id,
                questionText: question.text,
                questionNumber: question.sortOrder,
                assignedDate: dailyQuestion.assignedDate,
                myAnswer: myAnswer,
                partnerAnswer: partnerAnswer
            )
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    // MARK: - Submit Answer

    func submitAnswer(text: String, userId: UUID) async {
        guard let questionId = todayQuestion?.dailyQuestionId else { return }
        isSubmitting = true
        errorMessage = nil
        defer { isSubmitting = false }

        do {
            try await supabase.db
                .from("answers")
                .insert([
                    "daily_question_id": questionId.uuidString,
                    "user_id": userId.uuidString,
                    "text": text
                ])
                .execute()

            todayQuestion?.myAnswer = text

            // Try to fetch partner's answer
            await fetchPartnerAnswer(userId: userId)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    // MARK: - Fetch Partner Answer

    func fetchPartnerAnswer(userId: UUID) async {
        guard let questionId = todayQuestion?.dailyQuestionId else { return }

        do {
            let answers: [Answer] = try await supabase.db
                .from("answers")
                .select()
                .eq("daily_question_id", value: questionId.uuidString)
                .neq("user_id", value: userId.uuidString)
                .execute()
                .value

            todayQuestion?.partnerAnswer = answers.first?.text
        } catch {
            // Partner may not have answered yet
        }
    }

    // MARK: - Private Helpers

    private func getOrCreateDailyQuestion(coupleId: UUID) async throws -> DailyQuestion {
        // Check if today's question already exists
        let existing: [DailyQuestion] = try await supabase.db
            .from("daily_questions")
            .select()
            .eq("couple_id", value: coupleId.uuidString)
            .eq("assigned_date", value: todayString)
            .execute()
            .value

        if let found = existing.first {
            return found
        }

        // Get all question IDs already used by this couple
        let usedQuestions: [DailyQuestion] = try await supabase.db
            .from("daily_questions")
            .select()
            .eq("couple_id", value: coupleId.uuidString)
            .execute()
            .value

        let usedIds = Set(usedQuestions.map(\.questionId))

        // Get next unused question by sort_order
        let allQuestions: [Question] = try await supabase.db
            .from("questions")
            .select()
            .order("sort_order")
            .execute()
            .value

        guard let nextQuestion = allQuestions.first(where: { !usedIds.contains($0.id) }) else {
            // All questions used — wrap around to first
            guard let first = allQuestions.first else {
                throw QuestionError.noQuestionsAvailable
            }
            return try await insertDailyQuestion(coupleId: coupleId, questionId: first.id)
        }

        return try await insertDailyQuestion(coupleId: coupleId, questionId: nextQuestion.id)
    }

    private func insertDailyQuestion(coupleId: UUID, questionId: Int) async throws -> DailyQuestion {
        let inserted: DailyQuestion = try await supabase.db
            .from("daily_questions")
            .insert([
                "couple_id": coupleId.uuidString,
                "question_id": "\(questionId)",
                "assigned_date": todayString
            ])
            .select()
            .single()
            .execute()
            .value
        return inserted
    }
}

enum QuestionError: LocalizedError {
    case noQuestionsAvailable

    var errorDescription: String? {
        switch self {
        case .noQuestionsAvailable:
            return "No questions available."
        }
    }
}
