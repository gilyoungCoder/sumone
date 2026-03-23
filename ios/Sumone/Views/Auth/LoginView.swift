import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authVM: AuthViewModel

    @State private var email = ""
    @State private var password = ""
    @State private var showForgotPassword = false
    @State private var resetEmail = ""
    @State private var resetSent = false

    var body: some View {
        NavigationStack {
            ZStack {
                Color.theme.background.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 32) {
                        Spacer().frame(height: 60)

                        // Logo
                        VStack(spacing: 8) {
                            Text("SumOne")
                                .font(AppFont.logo())
                                .italic()
                                .foregroundColor(.theme.primary)

                            Text("Your story, together")
                                .font(AppFont.body)
                                .foregroundColor(.theme.textSecondary)
                        }

                        Spacer().frame(height: 20)

                        // Input Fields
                        VStack(spacing: 16) {
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

                            SecureField("Password", text: $password)
                                .textContentType(.password)
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
                                .multilineTextAlignment(.center)
                                .padding(.horizontal)
                        }

                        // Sign In Button
                        Button {
                            Task { await authVM.signIn(email: email, password: password) }
                        } label: {
                            Group {
                                if authVM.isLoading {
                                    ProgressView()
                                        .tint(.white)
                                } else {
                                    Text("Sign In")
                                        .font(AppFont.headline)
                                }
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(Color.theme.primary)
                            .cornerRadius(16)
                        }
                        .disabled(email.isEmpty || password.isEmpty || authVM.isLoading)
                        .opacity(email.isEmpty || password.isEmpty ? 0.6 : 1)

                        // Forgot Password
                        Button {
                            resetEmail = email
                            showForgotPassword = true
                        } label: {
                            Text("Forgot password?")
                                .font(AppFont.caption)
                                .foregroundColor(.theme.textSecondary)
                        }

                        // Sign Up Link
                        NavigationLink {
                            RegisterView()
                        } label: {
                            HStack(spacing: 4) {
                                Text("Don't have an account?")
                                    .foregroundColor(.theme.textSecondary)
                                Text("Sign Up")
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
            .alert("Reset Password", isPresented: $showForgotPassword) {
                TextField("Email", text: $resetEmail)
                Button("Send") {
                    Task {
                        await authVM.resetPassword(email: resetEmail)
                        resetSent = true
                    }
                }
                Button("Cancel", role: .cancel) {}
            } message: {
                Text("Enter your email to receive a password reset link.")
            }
            .alert("Check Your Email", isPresented: $resetSent) {
                Button("OK") {}
            } message: {
                Text("If an account exists with that email, you'll receive a reset link.")
            }
        }
    }
}
