import SwiftUI

/// 썸원 스타일의 하트 캐릭터 — 12가지 감정 지원
struct HeartCharacter: View {
    var mood: Mood = .happy
    var size: CGFloat = 120
    var animated: Bool = true

    @State private var bounceOffset: CGFloat = 0
    @State private var blinkScale: CGFloat = 1

    var body: some View {
        ZStack {
            // Shadow
            Ellipse()
                .fill(Color.black.opacity(0.06))
                .frame(width: size * 0.6, height: size * 0.12)
                .offset(y: size * 0.55 + bounceOffset * 0.3)

            // Body + face
            heartBody
                .overlay(face)
                .overlay(accessories)
                .offset(y: bounceOffset)
        }
        .onAppear {
            guard animated else { return }
            withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                bounceOffset = -8
            }
            startBlinking()
        }
    }

    // MARK: - Heart Body
    private var heartBody: some View {
        let (top, bottom) = mood.colors
        return Heart()
            .fill(LinearGradient(colors: [top, bottom], startPoint: .top, endPoint: .bottom))
            .frame(width: size, height: size * 0.9)
            .shadow(color: bottom.opacity(0.3), radius: 6, y: 4)
    }

    // MARK: - Face
    private var face: some View {
        VStack(spacing: size * 0.02) {
            eyes.offset(y: size * 0.08)
            mouth.offset(y: size * 0.1)
        }
    }

    @ViewBuilder
    private var eyes: some View {
        HStack(spacing: size * 0.18) {
            switch mood {
            case .inLove:
                // Heart eyes ❤️
                Text("❤️").font(.system(size: size * 0.12))
                Text("❤️").font(.system(size: size * 0.12))

            case .crying:
                // Teary eyes
                VStack(spacing: 1) {
                    eyeDot
                    RoundedRectangle(cornerRadius: 1)
                        .fill(Color(hex: "88BBEE").opacity(0.6))
                        .frame(width: size * 0.03, height: size * 0.06)
                }
                VStack(spacing: 1) {
                    eyeDot
                    RoundedRectangle(cornerRadius: 1)
                        .fill(Color(hex: "88BBEE").opacity(0.6))
                        .frame(width: size * 0.03, height: size * 0.06)
                }

            case .devilish:
                // Sly eyes (half closed)
                Capsule().fill(Color(hex: "2D2D2D"))
                    .frame(width: size * 0.08, height: size * 0.04)
                Capsule().fill(Color(hex: "2D2D2D"))
                    .frame(width: size * 0.08, height: size * 0.04)

            case .excited:
                // > < squeezed eyes
                Text(">").font(.system(size: size * 0.1, weight: .bold))
                    .foregroundColor(Color(hex: "3D2C2C"))
                Text("<").font(.system(size: size * 0.1, weight: .bold))
                    .foregroundColor(Color(hex: "3D2C2C"))

            case .sick:
                // Dizzy eyes
                Text("×").font(.system(size: size * 0.1, weight: .bold))
                    .foregroundColor(Color(hex: "3D2C2C"))
                Text("×").font(.system(size: size * 0.1, weight: .bold))
                    .foregroundColor(Color(hex: "3D2C2C"))

            case .annoyed:
                // Flat annoyed eyes
                Capsule().fill(Color(hex: "2D2D2D"))
                    .frame(width: size * 0.09, height: size * 0.035)
                Capsule().fill(Color(hex: "2D2D2D"))
                    .frame(width: size * 0.09, height: size * 0.035)

            case .anxious:
                // Wide worried eyes
                VStack(spacing: 0) {
                    Capsule().fill(Color(hex: "2D2D2D"))
                        .frame(width: size * 0.08, height: size * 0.02)
                        .rotationEffect(.degrees(-10))
                    eyeDot
                }
                VStack(spacing: 0) {
                    Capsule().fill(Color(hex: "2D2D2D"))
                        .frame(width: size * 0.08, height: size * 0.02)
                        .rotationEffect(.degrees(10))
                    eyeDot
                }

            default:
                // Normal blinking eyes
                Ellipse().fill(Color(hex: "3D2C2C"))
                    .frame(width: size * 0.07, height: size * 0.08 * blinkScale)
                Ellipse().fill(Color(hex: "3D2C2C"))
                    .frame(width: size * 0.07, height: size * 0.08 * blinkScale)
            }
        }
    }

    private var eyeDot: some View {
        Ellipse()
            .fill(Color(hex: "3D2C2C"))
            .frame(width: size * 0.07, height: size * 0.08)
    }

    @ViewBuilder
    private var mouth: some View {
        ZStack {
            // Blush cheeks (most moods)
            if mood != .devilish && mood != .angry {
                HStack(spacing: size * 0.25) {
                    Circle().fill(mood.blushColor)
                        .frame(width: size * 0.1, height: size * 0.07)
                    Circle().fill(mood.blushColor)
                        .frame(width: size * 0.1, height: size * 0.07)
                }
            }

            // Mouth shape
            switch mood {
            case .inLove, .happy, .playful:
                SmileMouth()
                    .stroke(mouthColor, lineWidth: 2)
                    .frame(width: size * 0.1, height: size * 0.05)
                    .offset(y: size * 0.02)

            case .curious:
                Circle().fill(mouthColor)
                    .frame(width: size * 0.05)
                    .offset(y: size * 0.02)

            case .sad, .anxious:
                // Frown
                SmileMouth()
                    .stroke(mouthColor, lineWidth: 2)
                    .frame(width: size * 0.08, height: size * 0.04)
                    .rotationEffect(.degrees(180))
                    .offset(y: size * 0.02)

            case .crying:
                // Open crying mouth
                Ellipse().fill(mouthColor)
                    .frame(width: size * 0.08, height: size * 0.06)
                    .offset(y: size * 0.02)

            case .devilish:
                // Smirk
                SmileMouth()
                    .stroke(Color.white, lineWidth: 2)
                    .frame(width: size * 0.12, height: size * 0.05)
                    .offset(y: size * 0.02)

            case .excited:
                // Big open smile
                Capsule().fill(mouthColor)
                    .frame(width: size * 0.12, height: size * 0.06)
                    .offset(y: size * 0.02)

            case .sick:
                // Wavy mouth
                WavyMouth()
                    .stroke(mouthColor, lineWidth: 2)
                    .frame(width: size * 0.12, height: size * 0.04)
                    .offset(y: size * 0.02)

            case .annoyed:
                // Flat line
                Capsule().fill(mouthColor)
                    .frame(width: size * 0.1, height: size * 0.02)
                    .offset(y: size * 0.02)

            case .angry:
                // Gritting teeth
                RoundedRectangle(cornerRadius: 2)
                    .fill(mouthColor)
                    .frame(width: size * 0.12, height: size * 0.05)
                    .overlay(
                        HStack(spacing: 2) {
                            ForEach(0..<4, id: \.self) { _ in
                                Rectangle().fill(Color.white)
                                    .frame(width: 1, height: size * 0.03)
                            }
                        }
                    )
                    .offset(y: size * 0.02)
            }
        }
    }

    private var mouthColor: Color {
        switch mood {
        case .devilish: Color(hex: "404040")
        case .angry: Color(hex: "6B3070")
        default: Color(hex: "C44D6A")
        }
    }

    // MARK: - Accessories
    @ViewBuilder
    private var accessories: some View {
        switch mood {
        case .curious:
            // Question mark
            Text("?")
                .font(.system(size: size * 0.15, weight: .bold))
                .foregroundColor(Color(hex: "C09098"))
                .offset(x: size * 0.4, y: -size * 0.15)

        case .devilish:
            // Devil horns
            HStack(spacing: size * 0.35) {
                Triangle()
                    .fill(Color(hex: "404040"))
                    .frame(width: size * 0.1, height: size * 0.12)
                    .rotationEffect(.degrees(-15))
                Triangle()
                    .fill(Color(hex: "404040"))
                    .frame(width: size * 0.1, height: size * 0.12)
                    .rotationEffect(.degrees(15))
            }
            .offset(y: -size * 0.38)

        case .excited:
            // Sparkles
            Text("✦")
                .font(.system(size: size * 0.1))
                .foregroundColor(Color(hex: "FFD700"))
                .offset(x: size * 0.35, y: -size * 0.2)
            Text("✦")
                .font(.system(size: size * 0.07))
                .foregroundColor(Color(hex: "FFD700"))
                .offset(x: -size * 0.38, y: -size * 0.1)

        case .anxious:
            // Sweat drop
            Text("💧")
                .font(.system(size: size * 0.1))
                .offset(x: size * 0.38, y: -size * 0.05)

        case .angry:
            // Speech bubble with symbols
            Text("%#!?")
                .font(.system(size: size * 0.06, weight: .bold))
                .foregroundColor(.white)
                .padding(.horizontal, 6)
                .padding(.vertical, 3)
                .background(Color(hex: "404040").cornerRadius(4))
                .offset(x: size * 0.3, y: -size * 0.3)

        case .playful:
            // Tongue
            Capsule()
                .fill(Color(hex: "FF8888"))
                .frame(width: size * 0.06, height: size * 0.08)
                .offset(y: size * 0.42)

        default:
            EmptyView()
        }
    }

    // MARK: - Blink
    private func startBlinking() {
        Timer.scheduledTimer(withTimeInterval: 3.5, repeats: true) { _ in
            withAnimation(.easeInOut(duration: 0.1)) { blinkScale = 0.1 }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
                withAnimation(.easeInOut(duration: 0.1)) { blinkScale = 1 }
            }
        }
    }
}

// MARK: - Shapes

struct Heart: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width
        let h = rect.height
        path.move(to: CGPoint(x: w * 0.5, y: h * 0.25))
        path.addCurve(
            to: CGPoint(x: w * 0.5, y: h * 0.85),
            control1: CGPoint(x: w * -0.05, y: h * -0.15),
            control2: CGPoint(x: w * 0.0, y: h * 0.6)
        )
        path.addCurve(
            to: CGPoint(x: w * 0.5, y: h * 0.25),
            control1: CGPoint(x: w * 1.0, y: h * 0.6),
            control2: CGPoint(x: w * 1.05, y: h * -0.15)
        )
        return path
    }
}

struct SmileMouth: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: 0, y: 0))
        path.addQuadCurve(
            to: CGPoint(x: rect.width, y: 0),
            control: CGPoint(x: rect.width * 0.5, y: rect.height)
        )
        return path
    }
}

struct WavyMouth: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: 0, y: rect.midY))
        path.addCurve(
            to: CGPoint(x: rect.width, y: rect.midY),
            control1: CGPoint(x: rect.width * 0.3, y: 0),
            control2: CGPoint(x: rect.width * 0.7, y: rect.height)
        )
        return path
    }
}

struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: 0))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.addLine(to: CGPoint(x: 0, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

// MARK: - Preview
#Preview("All Moods") {
    ScrollView {
        LazyVGrid(columns: [.init(), .init(), .init()], spacing: 24) {
            ForEach(Mood.allCases) { mood in
                VStack(spacing: 8) {
                    HeartCharacter(mood: mood, size: 90, animated: false)
                    Text(mood.label)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding()
    }
    .background(Color(hex: "FFF8F0"))
}
