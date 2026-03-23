import SwiftUI

struct OnboardingView: View {
    @EnvironmentObject var authVM: AuthViewModel

    @State private var selectedEmoji = "😊"
    @State private var displayName = ""
    @State private var isAppearing = false

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 16), count: 4)

    var body: some View {
        ZStack {
            Color.theme.background.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 32) {
                    Spacer().frame(height: 40)

                    // Welcome Title
                    VStack(spacing: 8) {
                        Text("Welcome to SumOne!")
                            .font(AppFont.title)
                            .foregroundColor(.theme.text)

                        Text("Let's set up your profile")
                            .font(AppFont.body)
                            .foregroundColor(.theme.textSecondary)
                    }
                    .opacity(isAppearing ? 1 : 0)
                    .offset(y: isAppearing ? 0 : 20)

                    // Selected Avatar Preview
                    Text(selectedEmoji)
                        .font(.system(size: 72))
                        .scaleEffect(isAppearing ? 1 : 0.5)

                    // Avatar Grid
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Choose your avatar")
                            .font(AppFont.headline)
                            .foregroundColor(.theme.text)

                        LazyVGrid(columns: columns, spacing: 16) {
                            ForEach(EmojiAvatars.all, id: \.self) { emoji in
                                Text(emoji)
                                    .font(.system(size: 36))
                                    .frame(width: 60, height: 60)
                                    .background(
                                        selectedEmoji == emoji
                                            ? Color.theme.primaryLight.opacity(0.3)
                                            : Color.theme.surface
                                    )
                                    .cornerRadius(16)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 16)
                                            .stroke(
                                                selectedEmoji == emoji
                                                    ? Color.theme.primary
                                                    : Color.theme.border,
                                                lineWidth: selectedEmoji == emoji ? 2 : 1
                                            )
                                    )
                                    .onTapGesture {
                                        withAnimation(.spring(response: 0.3)) {
                                            selectedEmoji = emoji
                                        }
                                    }
                            }
                        }
                    }
                    .padding(.horizontal, 8)

                    // Display Name Field
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Display name")
                            .font(AppFont.caption)
                            .foregroundColor(.theme.textSecondary)

                        TextField("Your name", text: $displayName)
                            .padding()
                            .background(Color.theme.surface)
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color.theme.border, lineWidth: 1)
                            )
                    }

                    // Error Message
                    if let error = authVM.errorMessage {
                        Text(error)
                            .font(AppFont.caption)
                            .foregroundColor(.theme.error)
                    }

                    // Let's Go Button
                    Button {
                        Task {
                            await authVM.updateProfile(
                                displayName: displayName,
                                emoji: selectedEmoji
                            )
                        }
                    } label: {
                        Text("Let's Go!")
                            .font(AppFont.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(Color.theme.primary)
                            .cornerRadius(16)
                    }
                    .disabled(displayName.isEmpty)
                    .opacity(displayName.isEmpty ? 0.6 : 1)

                    Spacer()
                }
                .padding(.horizontal, 24)
            }
        }
        .onAppear {
            // Pre-fill name from sign-up if available
            if let profile = authVM.profile {
                displayName = profile.displayName
            }
            withAnimation(.easeOut(duration: 0.6)) {
                isAppearing = true
            }
        }
    }
}
