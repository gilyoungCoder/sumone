import SwiftUI

struct QuestionsView: View {
    @EnvironmentObject var questionVM: QuestionViewModel
    @EnvironmentObject var authVM: AuthViewModel
    @EnvironmentObject var coupleVM: CoupleViewModel

    @State private var answerText = ""
    @State private var showPartnerAnswer = false

    var body: some View {
        ZStack {
            Color.theme.background
                .ignoresSafeArea()

            if authVM.profile?.coupleId == nil {
                emptyStateView
            } else if questionVM.isLoading {
                ProgressView()
            } else if let question = questionVM.todayQuestion {
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 20) {
                        headerView
                        questionCard(question)
                        myAnswerCard(question)
                        partnerAnswerCard(question)
                        bottomButtons(question)
                        Spacer(minLength: 40)
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 16)
                }
            }
        }
        .task {
            await loadQuestion()
        }
    }

    // MARK: - Header

    private var headerView: some View {
        VStack(spacing: 4) {
            Text("SumOne")
                .font(.system(size: 28, weight: .bold, design: .serif))
                .italic()
                .foregroundColor(Color.theme.primary)

            Text("Daily Question")
                .font(AppFont.caption)
                .foregroundColor(Color.theme.textSecondary)
        }
    }

    // MARK: - Question Card

    private func questionCard(_ question: TodayQuestion) -> some View {
        VStack(spacing: 16) {
            heartsRow(question)

            Text(question.questionText)
                .font(.system(size: 22, weight: .bold))
                .foregroundColor(Color.theme.text)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 8)

            Text("#\(question.questionNumber) Question · \(formattedDate(question.assignedDate))")
                .font(AppFont.small)
                .foregroundColor(Color.theme.textLight)
        }
        .padding(24)
        .frame(maxWidth: .infinity)
        .background(Color.theme.surface)
        .cornerRadius(20)
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(Color.theme.border, lineWidth: 1)
        )
    }

    private func heartsRow(_ question: TodayQuestion) -> some View {
        HStack(spacing: 12) {
            Text(question.myAnswer != nil ? "❤️" : "🤍")
                .font(.system(size: 24))
            Text(question.partnerAnswer != nil ? "❤️" : "🤍")
                .font(.system(size: 24))
        }
    }

    // MARK: - My Answer Card

    private func myAnswerCard(_ question: TodayQuestion) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(authVM.profile?.displayName ?? "Me")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(Color.theme.text)

            if let myAnswer = question.myAnswer {
                Text(myAnswer)
                    .font(AppFont.body)
                    .foregroundColor(Color.theme.text)
                    .frame(maxWidth: .infinity, alignment: .leading)
            } else {
                TextEditor(text: $answerText)
                    .font(AppFont.body)
                    .frame(minHeight: 100)
                    .scrollContentBackground(.hidden)
                    .padding(8)
                    .background(Color.theme.background)
                    .cornerRadius(12)

                Button {
                    Task { await submitAnswer() }
                } label: {
                    if questionVM.isSubmitting {
                        ProgressView()
                            .tint(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                    } else {
                        Text("Submit")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                    }
                }
                .background(answerText.trimmingCharacters(in: .whitespaces).isEmpty
                    ? Color.theme.primaryLight
                    : Color.theme.primary)
                .cornerRadius(12)
                .disabled(answerText.trimmingCharacters(in: .whitespaces).isEmpty || questionVM.isSubmitting)
            }
        }
        .padding(20)
        .frame(maxWidth: .infinity)
        .background(Color.theme.surface)
        .cornerRadius(20)
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(Color.theme.border, lineWidth: 1)
        )
    }

    // MARK: - Partner Answer Card

    private func partnerAnswerCard(_ question: TodayQuestion) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(partnerName)
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(Color.theme.text)

            Group {
                if question.myAnswer == nil {
                    // Haven't answered yet — blur partner section
                    Text("Answer first to see partner's response")
                        .font(.system(size: 14, weight: .regular, design: .serif))
                        .italic()
                        .foregroundColor(Color.theme.textLight)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.vertical, 20)
                } else if let partnerAnswer = question.partnerAnswer {
                    Text(partnerAnswer)
                        .font(AppFont.body)
                        .foregroundColor(Color.theme.text)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .opacity(showPartnerAnswer ? 1 : 0)
                        .onAppear {
                            withAnimation(.easeIn(duration: 0.6)) {
                                showPartnerAnswer = true
                            }
                        }
                } else {
                    Text("Partner hasn't answered yet...")
                        .font(AppFont.caption)
                        .foregroundColor(Color.theme.textSecondary)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.vertical, 20)
                }
            }
        }
        .padding(20)
        .frame(maxWidth: .infinity)
        .background(Color.theme.surface)
        .cornerRadius(20)
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(Color.theme.border, lineWidth: 1)
        )
        .opacity(question.myAnswer == nil ? 0.5 : 1)
    }

    // MARK: - Bottom Buttons

    @ViewBuilder
    private func bottomButtons(_ question: TodayQuestion) -> some View {
        if question.myAnswer != nil {
            VStack(spacing: 12) {
                if question.partnerAnswer == nil {
                    Button {
                        // Nudge action placeholder
                    } label: {
                        Text("Nudge 👈")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(Color.theme.primary)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Color.theme.primaryLight.opacity(0.3))
                            .cornerRadius(12)
                    }
                }

                Button {
                    // Chat action placeholder
                } label: {
                    Text("Chat about this 💬")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(Color.theme.primary)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color.theme.primaryLight.opacity(0.3))
                        .cornerRadius(12)
                }
            }
        }
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 16) {
            Text("💕")
                .font(.system(size: 48))
            Text("Connect with your partner first")
                .font(AppFont.headline)
                .foregroundColor(Color.theme.text)
            Text("Link your accounts to start answering daily questions together.")
                .font(AppFont.body)
                .foregroundColor(Color.theme.textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
        }
    }

    // MARK: - Helpers

    private var partnerName: String {
        coupleVM.partnerName ?? "Partner"
    }

    private func formattedDate(_ dateString: String) -> String {
        // "yyyy-MM-dd" -> "YYYY.MM.DD"
        dateString.replacingOccurrences(of: "-", with: ".")
    }

    private func loadQuestion() async {
        guard let coupleId = authVM.profile?.coupleId,
              let userId = SupabaseService.shared.currentUserId else { return }
        await questionVM.fetchTodayQuestion(coupleId: coupleId, userId: userId)
    }

    private func submitAnswer() async {
        guard let userId = SupabaseService.shared.currentUserId else { return }
        let trimmed = answerText.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        await questionVM.submitAnswer(text: trimmed, userId: userId)
        answerText = ""
    }
}

#Preview {
    QuestionsView()
        .environmentObject(QuestionViewModel())
        .environmentObject(AuthViewModel())
        .environmentObject(CoupleViewModel())
}
