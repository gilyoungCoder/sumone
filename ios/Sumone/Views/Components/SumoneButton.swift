import SwiftUI

enum SumoneButtonVariant {
    case primary, secondary, ghost
}

struct SumoneButton: View {
    let title: String
    var variant: SumoneButtonVariant = .primary
    var isLoading: Bool = false
    let action: () -> Void

    @State private var isPressed = false

    var body: some View {
        Button(action: action) {
            ZStack {
                if isLoading {
                    ProgressView()
                        .tint(foregroundColor)
                } else {
                    Text(title)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(foregroundColor)
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 52)
            .background(backgroundColor)
            .cornerRadius(16)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(borderColor, lineWidth: variant == .secondary ? 1.5 : 0)
            )
        }
        .scaleEffect(isPressed ? 0.98 : 1.0)
        .animation(.easeInOut(duration: 0.1), value: isPressed)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in isPressed = true }
                .onEnded { _ in isPressed = false }
        )
        .disabled(isLoading)
    }

    private var backgroundColor: Color {
        switch variant {
        case .primary: return Color.theme.primary
        case .secondary: return Color.theme.surface
        case .ghost: return .clear
        }
    }

    private var foregroundColor: Color {
        switch variant {
        case .primary: return .white
        case .secondary: return Color.theme.primary
        case .ghost: return Color.theme.primary
        }
    }

    private var borderColor: Color {
        switch variant {
        case .secondary: return Color.theme.primary
        default: return .clear
        }
    }
}
