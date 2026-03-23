import SwiftUI

struct RootView: View {
    @EnvironmentObject var authVM: AuthViewModel

    var body: some View {
        Group {
            if authVM.isLoading {
                SplashView()
            } else if authVM.session == nil {
                LoginView()
            } else if authVM.profile == nil {
                OnboardingView()
            } else {
                MainTabView()
            }
        }
        .animation(.easeInOut, value: authVM.session != nil)
    }
}

struct SplashView: View {
    var body: some View {
        ZStack {
            Color.theme.background.ignoresSafeArea()
            VStack(spacing: 8) {
                Text("SumOne")
                    .font(.system(size: 42, weight: .bold, design: .serif))
                    .italic()
                    .foregroundColor(.theme.primary)
                Text("Your story, together")
                    .font(.subheadline)
                    .foregroundColor(.theme.textSecondary)
            }
        }
    }
}
