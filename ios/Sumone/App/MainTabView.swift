import SwiftUI

struct MainTabView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "house.fill")
                }

            QuestionsView()
                .tabItem {
                    Label("Q&A", systemImage: "heart.text.square.fill")
                }

            ProfileView()
                .tabItem {
                    Label("My", systemImage: "person.fill")
                }
        }
        .tint(.theme.primary)
    }
}
