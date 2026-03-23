import Foundation
import Supabase

// Supabase client singleton
class SupabaseService {
    static let shared = SupabaseService()

    let client: SupabaseClient

    private init() {
        guard let url = Bundle.main.infoDictionary?["SUPABASE_URL"] as? String,
              let key = Bundle.main.infoDictionary?["SUPABASE_ANON_KEY"] as? String else {
            fatalError("Missing Supabase config in Info.plist")
        }
        client = SupabaseClient(
            supabaseURL: URL(string: url)!,
            supabaseKey: key
        )
    }

    var auth: AuthClient { client.auth }
    var db: PostgrestClient { client.database }
}

// MARK: - Convenience
extension SupabaseService {
    var currentUserId: UUID? {
        try? client.auth.session.user.id
    }
}
