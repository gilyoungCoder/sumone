import SwiftUI

@main
struct SumoneApp: App {
    @StateObject private var authVM = AuthViewModel()
    @StateObject private var coupleVM = CoupleViewModel()
    @StateObject private var questionVM = QuestionViewModel()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(authVM)
                .environmentObject(coupleVM)
                .environmentObject(questionVM)
        }
    }
}
