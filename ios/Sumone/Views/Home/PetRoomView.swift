import SwiftUI

struct PetRoomView: View {
    @State private var petMessage = PetMessages.random
    @State private var bounceOffset: CGFloat = 0

    private let timer = Timer.publish(every: 10, on: .main, in: .common).autoconnect()

    var body: some View {
        ZStack {
            // Gingham / checkered background
            ginghamBackground

            // Decorative emojis
            decorativeEmojis

            // Pet + speech bubble
            VStack(spacing: 8) {
                // Speech bubble
                speechBubble

                // Pet heart with bounce
                Text("💗")
                    .font(.system(size: 80))
                    .offset(y: bounceOffset)
                    .onAppear {
                        withAnimation(
                            .easeInOut(duration: 1.2)
                            .repeatForever(autoreverses: true)
                        ) {
                            bounceOffset = -10
                        }
                    }
            }
        }
        .frame(maxWidth: 320)
        .aspectRatio(1, contentMode: .fit)
        .clipShape(RoundedRectangle(cornerRadius: 24))
        .onReceive(timer) { _ in
            withAnimation(.easeInOut(duration: 0.4)) {
                petMessage = PetMessages.random
            }
        }
    }

    // MARK: - Gingham Pattern

    private var ginghamBackground: some View {
        Canvas { context, size in
            let cellSize: CGFloat = 24
            let cols = Int(size.width / cellSize) + 1
            let rows = Int(size.height / cellSize) + 1

            // Base warm color
            context.fill(
                Path(CGRect(origin: .zero, size: size)),
                with: .color(Color.theme.surfaceWarm)
            )

            // Horizontal stripes
            for row in 0..<rows where row % 2 == 0 {
                let rect = CGRect(
                    x: 0,
                    y: CGFloat(row) * cellSize,
                    width: size.width,
                    height: cellSize
                )
                context.fill(
                    Path(rect),
                    with: .color(Color.theme.primary.opacity(0.06))
                )
            }

            // Vertical stripes
            for col in 0..<cols where col % 2 == 0 {
                let rect = CGRect(
                    x: CGFloat(col) * cellSize,
                    y: 0,
                    width: cellSize,
                    height: size.height
                )
                context.fill(
                    Path(rect),
                    with: .color(Color.theme.primary.opacity(0.06))
                )
            }
        }
    }

    // MARK: - Decorative Emojis

    private var decorativeEmojis: some View {
        GeometryReader { geo in
            let w = geo.size.width
            let h = geo.size.height

            Text("🏕️")
                .font(.system(size: 28))
                .position(x: w * 0.15, y: h * 0.18)

            Text("🖼️")
                .font(.system(size: 24))
                .position(x: w * 0.85, y: h * 0.15)

            Text("🌿")
                .font(.system(size: 26))
                .position(x: w * 0.82, y: h * 0.85)
        }
    }

    // MARK: - Speech Bubble

    private var speechBubble: some View {
        Text(petMessage)
            .font(AppFont.caption)
            .foregroundStyle(Color.theme.text)
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.white.opacity(0.9))
            )
            .transition(.opacity)
            .id(petMessage) // re-render on change
    }
}
