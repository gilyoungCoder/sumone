import SwiftUI

/// "오늘의 기분" 선택 화면 — 원본 썸원 참고
struct MoodPickerView: View {
    @Binding var selectedMood: Mood?
    @Environment(\.dismiss) private var dismiss

    @State private var tempSelection: Mood?

    let columns = [
        GridItem(.flexible()),
        GridItem(.flexible()),
        GridItem(.flexible()),
    ]

    var body: some View {
        VStack(spacing: 0) {
            // Header
            header

            // Content
            ScrollView {
                VStack(spacing: 24) {
                    Text("How are you feeling today?")
                        .font(.system(size: 16))
                        .foregroundColor(.theme.textSecondary)
                        .padding(.top, 24)

                    // Mood grid
                    LazyVGrid(columns: columns, spacing: 20) {
                        ForEach(Mood.allCases) { mood in
                            moodCell(mood)
                        }
                    }
                    .padding(.horizontal, 24)
                }
            }

            // Buttons
            bottomButtons
        }
        .background(Color.theme.background)
        .onAppear {
            tempSelection = selectedMood
        }
    }

    // MARK: - Header
    private var header: some View {
        ZStack {
            Color(hex: "4A4A4A")
            VStack(spacing: 4) {
                Text("Sumone")
                    .font(.system(size: 28, weight: .regular, design: .serif))
                    .italic()
                    .foregroundColor(.white)
                Text("Today's Mood")
                    .font(.system(size: 14))
                    .foregroundColor(.white.opacity(0.8))
            }
            .padding(.vertical, 16)

            HStack {
                Button { dismiss() } label: {
                    Image(systemName: "arrow.left")
                        .foregroundColor(.white)
                        .font(.title3)
                }
                Spacer()
                Button {
                    selectedMood = tempSelection
                    dismiss()
                } label: {
                    Image(systemName: "checkmark")
                        .foregroundColor(.white)
                        .font(.title3)
                }
            }
            .padding(.horizontal, 20)
        }
        .frame(height: 80)
    }

    // MARK: - Mood Cell
    private func moodCell(_ mood: Mood) -> some View {
        VStack(spacing: 6) {
            ZStack {
                HeartCharacter(mood: mood, size: 80, animated: false)

                // Premium lock badge
                if mood.isPremium {
                    VStack {
                        Spacer()
                        HStack {
                            Spacer()
                            Image(systemName: "lock.fill")
                                .font(.system(size: 10))
                                .foregroundColor(.white)
                                .padding(4)
                                .background(Color.theme.accent)
                                .clipShape(Circle())
                        }
                    }
                    .frame(width: 80, height: 72)
                }

                // Selection ring
                if tempSelection == mood {
                    Heart()
                        .stroke(Color.theme.primary, lineWidth: 3)
                        .frame(width: 84, height: 76)
                }
            }

            Text(mood.label)
                .font(.system(size: 11))
                .foregroundColor(.theme.textSecondary)
        }
        .onTapGesture {
            if !mood.isPremium {
                withAnimation(.spring(response: 0.3)) {
                    tempSelection = mood
                }
            }
        }
        .opacity(mood.isPremium ? 0.6 : 1)
    }

    // MARK: - Bottom Buttons
    private var bottomButtons: some View {
        HStack(spacing: 12) {
            Button {
                dismiss()
            } label: {
                Text("Cancel")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.theme.text)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.theme.border, lineWidth: 1)
                    )
            }

            Button {
                selectedMood = tempSelection
                dismiss()
            } label: {
                Text("Confirm")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(tempSelection != nil ? .white : .theme.textLight)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(tempSelection != nil ? Color.theme.primary : Color.theme.border)
                    )
            }
            .disabled(tempSelection == nil)
        }
        .padding(20)
    }
}

#Preview {
    MoodPickerView(selectedMood: .constant(.happy))
}
