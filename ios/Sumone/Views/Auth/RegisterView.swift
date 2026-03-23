import SwiftUI

struct RegisterView: View {
    @EnvironmentObject var authVM: AuthViewModel
    @Environment(\.dismiss) private var dismiss

    @State private var name = ""
    @State private var email = ""
    @State private var password = ""

    private var passwordStrength: PasswordStrength {
        PasswordStrength.evaluate(password)
    }

    var body: some View {
        ZStack {
            Color.theme.background.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 32) {
                    Spacer().frame(height: 40)

                    // Logo
                    VStack(spacing: 8) {
                        Text("SumOne")
                            .font(AppFont.logo())
                            .italic()
                            .foregroundColor(.theme.primary)

                        Text("Start your love story")
                            .font(AppFont.body)
                            .foregroundColor(.theme.textSecondary)
                    }

                    Spacer().frame(height: 12)

                    // Input Fields
                    VStack(spacing: 16) {
                        TextField("Your name", text: $name)
                            .textContentType(.name)
                            .padding()
                            .background(Color.theme.surface)
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color.theme.border, lineWidth: 1)
                            )

                        TextField("Email", text: $email)
                            .textContentType(.emailAddress)
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)
                            .padding()
                            .background(Color.theme.surface)
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color.theme.border, lineWidth: 1)
                            )

                        VStack(alignment: .leading, spacing: 8) {
                            SecureField("Password", text: $password)
                                .textContentType(.newPassword)
                                .padding()
                                .background(Color.theme.surface)
                                .cornerRadius(16)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.theme.border, lineWidth: 1)
                                )

                            // Strength Indicator
                            if !password.isEmpty {
                                HStack(spacing: 6) {
                                    ForEach(0..<3, id: \.self) { index in
                                        RoundedRectangle(cornerRadius: 2)
                                            .fill(index < passwordStrength.level
                                                  ? passwordStrength.color
                                                  : Color.theme.border)
                                            .frame(height: 4)
                                    }

                                    Text(passwordStrength.label)
                                        .font(AppFont.small)
                                        .foregroundColor(passwordStrength.color)
                                }
                            }
                        }
                    }

                    // Error Message
                    if let error = authVM.errorMessage {
                        Text(error)
                            .font(AppFont.caption)
                            .foregroundColor(.theme.error)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                    }

                    // Create Account Button
                    Button {
                        Task { await authVM.signUp(email: email, password: password, name: name) }
                    } label: {
                        Group {
                            if authVM.isLoading {
                                ProgressView()
                                    .tint(.white)
                            } else {
                                Text("Create Account")
                                    .font(AppFont.headline)
                            }
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(Color.theme.primary)
                        .cornerRadius(16)
                    }
                    .disabled(!isFormValid || authVM.isLoading)
                    .opacity(isFormValid ? 1 : 0.6)

                    // Sign In Link
                    Button {
                        dismiss()
                    } label: {
                        HStack(spacing: 4) {
                            Text("Already have an account?")
                                .foregroundColor(.theme.textSecondary)
                            Text("Sign In")
                                .foregroundColor(.theme.primary)
                                .fontWeight(.semibold)
                        }
                        .font(AppFont.caption)
                    }

                    Spacer()
                }
                .padding(.horizontal, 24)
            }
        }
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button { dismiss() } label: {
                    Image(systemName: "chevron.left")
                        .foregroundColor(.theme.text)
                }
            }
        }
    }

    private var isFormValid: Bool {
        !name.isEmpty && !email.isEmpty && password.count >= 6
    }
}

// MARK: - Password Strength

private enum PasswordStrength {
    case weak, medium, strong

    var level: Int {
        switch self {
        case .weak: return 1
        case .medium: return 2
        case .strong: return 3
        }
    }

    var label: String {
        switch self {
        case .weak: return "Weak"
        case .medium: return "Medium"
        case .strong: return "Strong"
        }
    }

    var color: Color {
        switch self {
        case .weak: return .theme.error
        case .medium: return .theme.accent
        case .strong: return .theme.success
        }
    }

    static func evaluate(_ password: String) -> PasswordStrength {
        if password.count >= 10 { return .strong }
        if password.count >= 6 { return .medium }
        return .weak
    }
}
