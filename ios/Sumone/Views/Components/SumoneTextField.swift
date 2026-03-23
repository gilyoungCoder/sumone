import SwiftUI

struct SumoneTextField: View {
    let placeholder: String
    @Binding var text: String
    var isSecure: Bool = false
    var error: String? = nil

    @FocusState private var isFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Group {
                if isSecure {
                    SecureField(placeholder, text: $text)
                } else {
                    TextField(placeholder, text: $text)
                }
            }
            .focused($isFocused)
            .font(AppFont.body)
            .foregroundColor(Color.theme.text)
            .padding(.horizontal, 20)
            .padding(.vertical, 16)
            .background(Color.theme.surface)
            .cornerRadius(16)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(borderColor, lineWidth: 1.5)
            )

            if let error, !error.isEmpty {
                Text(error)
                    .font(AppFont.small)
                    .foregroundColor(Color.theme.error)
                    .padding(.horizontal, 4)
            }
        }
    }

    private var borderColor: Color {
        if let error, !error.isEmpty {
            return Color.theme.error
        }
        return isFocused ? Color.theme.primary : Color.theme.border
    }
}
