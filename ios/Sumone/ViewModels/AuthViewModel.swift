import Foundation
import Supabase

@MainActor
class AuthViewModel: ObservableObject {
    @Published var session: Session?
    @Published var profile: Profile?
    @Published var isLoading = true
    @Published var errorMessage: String?

    private let supabase = SupabaseService.shared
    private var authStateTask: Task<Void, Never>?

    init() {
        // Check existing session
        session = try? supabase.auth.session
        listenToAuthChanges()
    }

    deinit {
        authStateTask?.cancel()
    }

    // MARK: - Auth State Listener

    private func listenToAuthChanges() {
        authStateTask = Task { [weak self] in
            guard let self else { return }
            for await (event, session) in supabase.auth.authStateChanges {
                guard !Task.isCancelled else { return }
                self.session = session

                switch event {
                case .initialSession:
                    if session != nil {
                        await self.fetchProfile()
                    }
                    self.isLoading = false
                case .signedIn:
                    await self.fetchProfile()
                case .signedOut:
                    self.profile = nil
                default:
                    break
                }
            }
        }
    }

    // MARK: - Sign Up

    func signUp(email: String, password: String, name: String) async {
        errorMessage = nil
        isLoading = true
        defer { isLoading = false }

        do {
            let result = try await supabase.auth.signUp(
                email: email,
                password: password
            )

            guard let userId = result.session?.user.id else {
                errorMessage = "Account created. Please check your email to verify."
                return
            }

            // Create profile row
            try await supabase.db
                .from("profiles")
                .insert([
                    "id": userId.uuidString,
                    "display_name": name
                ])
                .execute()

            session = result.session
            await fetchProfile()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    // MARK: - Sign In

    func signIn(email: String, password: String) async {
        errorMessage = nil
        isLoading = true
        defer { isLoading = false }

        do {
            let session = try await supabase.auth.signIn(
                email: email,
                password: password
            )
            self.session = session
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    // MARK: - Sign Out

    func signOut() async {
        do {
            try await supabase.auth.signOut()
            session = nil
            profile = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    // MARK: - Fetch Profile

    func fetchProfile() async {
        guard let userId = supabase.currentUserId else { return }

        do {
            let profile: Profile = try await supabase.db
                .from("profiles")
                .select()
                .eq("id", value: userId.uuidString)
                .single()
                .execute()
                .value
            self.profile = profile
        } catch {
            // Profile might not exist yet (onboarding)
            self.profile = nil
        }
    }

    // MARK: - Update Profile

    func updateProfile(displayName: String, emoji: String) async {
        guard let userId = supabase.currentUserId else { return }
        errorMessage = nil

        do {
            let updated: Profile = try await supabase.db
                .from("profiles")
                .update([
                    "display_name": displayName,
                    "profile_emoji": emoji
                ])
                .eq("id", value: userId.uuidString)
                .select()
                .single()
                .execute()
                .value
            self.profile = updated
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    // MARK: - Reset Password

    func resetPassword(email: String) async {
        errorMessage = nil
        do {
            try await supabase.auth.resetPasswordForEmail(email)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
