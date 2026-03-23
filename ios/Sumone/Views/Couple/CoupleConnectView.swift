import SwiftUI

struct CoupleConnectView: View {
    @EnvironmentObject var coupleVM: CoupleViewModel
    @EnvironmentObject var authVM: AuthViewModel
    @Environment(\.dismiss) private var dismiss

    @State private var generatedCode: String?
    @State private var joinCode = ""
    @State private var errorMessage: String?
    @State private var showSuccess = false

    var body: some View {
        ZStack {
            Color.theme.background.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 32) {
                    // Subtitle
                    Text("Share your invite code\nor enter your partner's code")
                        .font(AppFont.body)
                        .foregroundStyle(Color.theme.textSecondary)
                        .multilineTextAlignment(.center)
                        .padding(.top, 8)

                    // MARK: - Create Section
                    createSection

                    // Divider with "OR"
                    orDivider

                    // MARK: - Join Section
                    joinSection

                    if let error = errorMessage {
                        Text(error)
                            .font(AppFont.caption)
                            .foregroundStyle(Color.theme.error)
                    }
                }
                .padding(24)
            }
        }
        .navigationTitle("Connect Partner")
        .navigationBarTitleDisplayMode(.inline)
        .alert("Connected! 💕", isPresented: $showSuccess) {
            Button("OK") { dismiss() }
        } message: {
            Text("You and your partner are now connected!")
        }
    }

    // MARK: - Create Invite Code

    private var createSection: some View {
        VStack(spacing: 16) {
            Text("Create Invite Code")
                .font(AppFont.headline)
                .foregroundStyle(Color.theme.text)

            if let code = generatedCode {
                Text(code)
                    .font(.system(size: 32, weight: .bold, design: .monospaced))
                    .tracking(8)
                    .foregroundStyle(Color.theme.primary)
                    .padding(.vertical, 16)

                Text("Share this code with your partner")
                    .font(AppFont.caption)
                    .foregroundStyle(Color.theme.textSecondary)
            } else {
                Button {
                    Task { await generateCode() }
                } label: {
                    Text("Generate Code")
                        .font(AppFont.headline)
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 48)
                        .background(Color.theme.primary)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .disabled(coupleVM.isLoading)
            }
        }
        .padding(20)
        .background(Color.theme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(Color.theme.border, lineWidth: 1)
        )
    }

    // MARK: - OR Divider

    private var orDivider: some View {
        HStack {
            Rectangle()
                .fill(Color.theme.border)
                .frame(height: 1)
            Text("OR")
                .font(AppFont.caption)
                .foregroundStyle(Color.theme.textLight)
                .padding(.horizontal, 12)
            Rectangle()
                .fill(Color.theme.border)
                .frame(height: 1)
        }
    }

    // MARK: - Join With Code

    private var joinSection: some View {
        VStack(spacing: 16) {
            Text("Join with Code")
                .font(AppFont.headline)
                .foregroundStyle(Color.theme.text)

            TextField("", text: $joinCode)
                .font(.system(size: 28, weight: .bold, design: .monospaced))
                .tracking(6)
                .multilineTextAlignment(.center)
                .textInputAutocapitalization(.characters)
                .autocorrectionDisabled()
                .frame(height: 56)
                .background(Color.theme.background)
                .clipShape(RoundedRectangle(cornerRadius: 14))
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(Color.theme.border, lineWidth: 1)
                )
                .onChange(of: joinCode) { _, newValue in
                    // Limit to 6 characters
                    if newValue.count > 6 {
                        joinCode = String(newValue.prefix(6))
                    }
                }

            Button {
                Task { await joinWithCode() }
            } label: {
                Text("Connect")
                    .font(AppFont.headline)
                    .foregroundStyle(Color.theme.primary)
                    .frame(maxWidth: .infinity)
                    .frame(height: 48)
                    .background(Color.clear)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                    .overlay(
                        RoundedRectangle(cornerRadius: 14)
                            .stroke(Color.theme.primary, lineWidth: 2)
                    )
            }
            .disabled(joinCode.count < 6 || coupleVM.isLoading)
            .opacity(joinCode.count < 6 ? 0.5 : 1)
        }
        .padding(20)
        .background(Color.theme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(Color.theme.border, lineWidth: 1)
        )
    }

    // MARK: - Actions

    private func generateCode() async {
        guard let userId = authVM.session?.user.id else { return }
        errorMessage = nil
        generatedCode = await coupleVM.createCouple(userId: userId)
        if generatedCode == nil {
            errorMessage = "Failed to create invite code. Please try again."
        }
    }

    private func joinWithCode() async {
        guard let userId = authVM.session?.user.id else { return }
        errorMessage = nil
        let error = await coupleVM.joinCouple(userId: userId, inviteCode: joinCode)
        if let error {
            errorMessage = error
        } else {
            showSuccess = true
        }
    }
}
