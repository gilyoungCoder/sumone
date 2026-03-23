import SwiftUI

struct HomeView: View {
    @EnvironmentObject var coupleVM: CoupleViewModel
    @EnvironmentObject var authVM: AuthViewModel

    var body: some View {
        NavigationStack {
            ZStack {
                Color.theme.background.ignoresSafeArea()

                if coupleVM.isLoading {
                    ProgressView()
                } else if let couple = coupleVM.couple {
                    connectedView(couple: couple)
                } else {
                    noCoupleView
                }
            }
            .onAppear {
                guard let userId = authVM.session?.user.id else { return }
                Task { await coupleVM.fetchCouple(userId: userId) }
            }
        }
    }

    // MARK: - No Couple

    private var noCoupleView: some View {
        VStack(spacing: 32) {
            Spacer()

            Text("SumOne")
                .font(AppFont.logo(48))
                .foregroundStyle(Color.theme.primary)

            VStack(spacing: 12) {
                Text("Connect with your partner")
                    .font(AppFont.headline)
                    .foregroundStyle(Color.theme.text)

                Text("Start answering questions together\nand grow closer every day")
                    .font(AppFont.body)
                    .foregroundStyle(Color.theme.textSecondary)
                    .multilineTextAlignment(.center)
            }

            NavigationLink(destination: CoupleConnectView()) {
                Text("Get Started")
                    .font(AppFont.headline)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
                    .background(Color.theme.primary)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
            }
            .padding(.horizontal, 40)

            Spacer()
        }
        .padding()
    }

    // MARK: - Connected Couple

    private func connectedView(couple: Couple) -> some View {
        VStack(spacing: 0) {
            if couple.isConnected {
                // Header: partner name + d-day
                VStack(spacing: 4) {
                    HStack(spacing: 6) {
                        Text("You")
                            .font(AppFont.body)
                            .foregroundStyle(Color.theme.text)
                        Text("❤️")
                        Text(coupleVM.partnerName ?? "Partner")
                            .font(AppFont.body)
                            .foregroundStyle(Color.theme.text)
                    }

                    if let days = coupleVM.dDayCount {
                        Text("Day \(days)")
                            .font(.system(size: 36, weight: .bold, design: .serif))
                            .italic()
                            .foregroundStyle(Color.theme.primary)
                    }
                }
                .padding(.top, 24)
                .padding(.bottom, 16)

                // Pet room
                PetRoomView()
                    .padding(.horizontal, 24)

                Spacer()

                // Bottom greeting
                Text(PetMessages.random)
                    .font(AppFont.caption)
                    .foregroundStyle(Color.theme.textSecondary)
                    .padding(.bottom, 24)
            } else {
                // Waiting for partner
                waitingView(code: couple.inviteCode)
            }
        }
    }

    // MARK: - Waiting for Partner

    private func waitingView(code: String) -> some View {
        VStack(spacing: 24) {
            Spacer()

            Text("SumOne")
                .font(AppFont.logo(36))
                .foregroundStyle(Color.theme.primary)

            Text("Your invite code")
                .font(AppFont.body)
                .foregroundStyle(Color.theme.textSecondary)

            Text(code)
                .font(.system(size: 36, weight: .bold, design: .monospaced))
                .tracking(8)
                .foregroundStyle(Color.theme.primary)
                .padding(.vertical, 20)
                .padding(.horizontal, 32)
                .background(Color.theme.surface)
                .clipShape(RoundedRectangle(cornerRadius: 16))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.theme.border, lineWidth: 1)
                )

            Text("Waiting for partner...")
                .font(AppFont.caption)
                .foregroundStyle(Color.theme.textLight)

            Spacer()
        }
        .padding()
    }
}
