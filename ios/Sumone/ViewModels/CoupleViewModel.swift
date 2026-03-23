import Foundation
import Supabase

@MainActor
class CoupleViewModel: ObservableObject {
    @Published var couple: Couple?
    @Published var partnerName: String?
    @Published var isLoading = false

    private let supabase = SupabaseService.shared

    // MARK: - Fetch Couple

    func fetchCouple(userId: UUID) async {
        isLoading = true
        defer { isLoading = false }

        do {
            // Find couple where user is either user1 or user2
            let couples: [Couple] = try await supabase.db
                .from("couples")
                .select()
                .or("user1_id.eq.\(userId.uuidString),user2_id.eq.\(userId.uuidString)")
                .execute()
                .value

            guard let couple = couples.first else {
                self.couple = nil
                self.partnerName = nil
                return
            }

            self.couple = couple

            // Fetch partner's display name
            let partnerId = couple.user1Id == userId ? couple.user2Id : couple.user1Id
            if let partnerId {
                let partner: Profile = try await supabase.db
                    .from("profiles")
                    .select()
                    .eq("id", value: partnerId.uuidString)
                    .single()
                    .execute()
                    .value
                self.partnerName = partner.displayName
            }
        } catch {
            self.couple = nil
            self.partnerName = nil
        }
    }

    // MARK: - Create Couple

    func createCouple(userId: UUID) async -> String? {
        isLoading = true
        defer { isLoading = false }

        let code = generateInviteCode()

        do {
            let newCouple: Couple = try await supabase.db
                .from("couples")
                .insert([
                    "user1_id": userId.uuidString,
                    "invite_code": code
                ])
                .select()
                .single()
                .execute()
                .value

            // Update profile with couple_id
            try await supabase.db
                .from("profiles")
                .update(["couple_id": newCouple.id.uuidString])
                .eq("id", value: userId.uuidString)
                .execute()

            self.couple = newCouple
            return code
        } catch {
            return nil
        }
    }

    // MARK: - Join Couple

    func joinCouple(userId: UUID, inviteCode: String) async -> String? {
        isLoading = true
        defer { isLoading = false }

        do {
            // Find couple by invite code that still has no partner
            let matches: [Couple] = try await supabase.db
                .from("couples")
                .select()
                .eq("invite_code", value: inviteCode.uppercased())
                .is("user2_id", value: "null")
                .execute()
                .value

            guard let target = matches.first else {
                return "Invalid code or already used"
            }

            // Prevent joining your own couple
            if target.user1Id == userId {
                return "You can't join your own couple"
            }

            // Set user2_id on the couple
            let updated: Couple = try await supabase.db
                .from("couples")
                .update(["user2_id": userId.uuidString])
                .eq("id", value: target.id.uuidString)
                .select()
                .single()
                .execute()
                .value

            // Update profile with couple_id
            try await supabase.db
                .from("profiles")
                .update(["couple_id": updated.id.uuidString])
                .eq("id", value: userId.uuidString)
                .execute()

            self.couple = updated
            return nil // success
        } catch {
            return error.localizedDescription
        }
    }

    // MARK: - Anniversary

    func setAnniversary(date: Date) async {
        guard let coupleId = couple?.id else { return }

        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        let dateString = formatter.string(from: date)

        do {
            let updated: Couple = try await supabase.db
                .from("couples")
                .update(["anniversary_date": dateString])
                .eq("id", value: coupleId.uuidString)
                .select()
                .single()
                .execute()
                .value
            self.couple = updated
        } catch {
            // Silent fail — could add error handling later
        }
    }

    var dDayCount: Int? {
        guard let dateString = couple?.anniversaryDate else { return nil }
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        guard let anniversary = formatter.date(from: dateString) else { return nil }
        let days = Calendar.current.dateComponents([.day], from: anniversary, to: Date()).day
        return days
    }

    // MARK: - Helpers

    private func generateInviteCode() -> String {
        // Exclude ambiguous characters: 0, O, 1, I, L
        let chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
        return String((0..<6).map { _ in chars.randomElement()! })
    }
}
