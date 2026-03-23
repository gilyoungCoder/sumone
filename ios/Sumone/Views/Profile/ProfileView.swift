import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authVM: AuthViewModel
    @EnvironmentObject var coupleVM: CoupleViewModel

    @State private var showSignOutAlert = false
    @State private var showDatePicker = false
    @State private var selectedDate = Date()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Header
                Text("My Page")
                    .font(.system(size: 28, weight: .bold))
                    .italic()
                    .foregroundColor(Color.theme.text)
                    .padding(.top, 16)

                // Profile Card
                profileCard

                // Settings Menu
                settingsCard

                // Sign Out
                Button {
                    showSignOutAlert = true
                } label: {
                    Text("Sign Out")
                        .font(AppFont.body)
                        .foregroundColor(Color.theme.error)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                }

                // Version
                Text("Sumone v1.0.0 (MVP)")
                    .font(AppFont.small)
                    .foregroundColor(Color.theme.textLight)
                    .frame(maxWidth: .infinity)
                    .padding(.bottom, 32)
            }
            .padding(.horizontal, 20)
        }
        .background(Color.theme.background.ignoresSafeArea())
        .alert("Sign Out", isPresented: $showSignOutAlert) {
            Button("Cancel", role: .cancel) {}
            Button("Sign Out", role: .destructive) {
                Task { await authVM.signOut() }
            }
        } message: {
            Text("Are you sure you want to sign out?")
        }
        .sheet(isPresented: $showDatePicker) {
            anniversaryPicker
        }
    }

    // MARK: - Profile Card

    private var profileCard: some View {
        VStack(spacing: 12) {
            Text(authVM.profile?.profileEmoji ?? "😊")
                .font(.system(size: 48))

            Text(authVM.session?.user.email ?? "")
                .font(AppFont.body)
                .foregroundColor(Color.theme.textSecondary)

            if coupleVM.couple?.isConnected == true,
               let partnerName = coupleVM.partnerName {
                Text("❤️ Connected with \(partnerName)")
                    .font(AppFont.caption)
                    .foregroundColor(Color.theme.primary)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(24)
        .background(Color.theme.surface)
        .cornerRadius(16)
    }

    // MARK: - Settings Card

    private var settingsCard: some View {
        VStack(spacing: 0) {
            settingsRow(
                label: "Couple Connection",
                value: coupleVM.couple?.isConnected == true ? "Connected" : "Not connected"
            )

            Divider().background(Color.theme.border)

            Button {
                if let dateString = coupleVM.couple?.anniversaryDate {
                    let formatter = DateFormatter()
                    formatter.dateFormat = "yyyy-MM-dd"
                    if let date = formatter.date(from: dateString) {
                        selectedDate = date
                    }
                }
                showDatePicker = true
            } label: {
                settingsRow(
                    label: "Anniversary",
                    value: formattedAnniversary
                )
            }

            Divider().background(Color.theme.border)

            settingsRow(label: "Notifications", value: "Coming soon")

            Divider().background(Color.theme.border)

            settingsRow(label: "Language", value: "English")
        }
        .background(Color.theme.surface)
        .cornerRadius(16)
    }

    private func settingsRow(label: String, value: String) -> some View {
        HStack {
            Text(label)
                .font(AppFont.body)
                .foregroundColor(Color.theme.text)
            Spacer()
            Text(value)
                .font(AppFont.caption)
                .foregroundColor(Color.theme.textSecondary)
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
    }

    private var formattedAnniversary: String {
        guard let dateString = coupleVM.couple?.anniversaryDate else {
            return "Not set"
        }
        let input = DateFormatter()
        input.dateFormat = "yyyy-MM-dd"
        guard let date = input.date(from: dateString) else { return "Not set" }
        let output = DateFormatter()
        output.dateStyle = .medium
        return output.string(from: date)
    }

    // MARK: - Anniversary Picker

    private var anniversaryPicker: some View {
        NavigationView {
            VStack {
                DatePicker(
                    "Anniversary",
                    selection: $selectedDate,
                    displayedComponents: .date
                )
                .datePickerStyle(.graphical)
                .tint(Color.theme.primary)
                .padding()

                Spacer()
            }
            .navigationTitle("Set Anniversary")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { showDatePicker = false }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        Task { await coupleVM.setAnniversary(date: selectedDate) }
                        showDatePicker = false
                    }
                    .fontWeight(.semibold)
                }
            }
        }
    }
}
