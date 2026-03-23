# Sumone

A couples app for the US market — stay connected with your partner through daily questions, a shared pet character, and milestone tracking.

Inspired by the Korean app "썸원" (Sumone), redesigned and localized for American couples.

Built with the **Harness Philosophy**: AI-agent collaboration where constraints drive creativity and small loops drive progress.

## Preview

[Live Preview](https://gilyoungcoder.github.io/sumone/)

## Features (MVP)

- **Email Authentication** — Sign up, sign in, sign out
- **Couple Connection** — Link with your partner via invite code
- **D-day Counter** — Track your anniversary and count the days
- **Daily Questions** — 50 English questions across 5 categories, one per day
- **Pet Character** — A heart character with 12 mood expressions
- **Mood Picker** — Share "Today's Mood" with your partner
- **Profile Management** — Display names, profile photos, settings

## Tech Stack

### Expo (Cross-Platform)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React Native + Expo | Expo Router for file-based navigation |
| Backend | Supabase | Auth, PostgreSQL, Storage, Realtime |
| State | Zustand | Lightweight client state |
| Styling | NativeWind (Tailwind) | Utility-first styling |

### SwiftUI (Native iOS) — Planned

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | SwiftUI | Native iOS UI |
| Architecture | MVVM | Model-View-ViewModel |
| Backend | Supabase | Shared backend with Expo version |

## Project Structure

```
sumone/
├── app/                        # Expo project
│   ├── app/                    # Expo Router pages
│   │   ├── (auth)/             # Login, Register, Onboarding
│   │   ├── (tabs)/             # Main tab screens (Home, etc.)
│   │   └── _layout.tsx         # Root layout
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Buttons, cards, inputs
│   │   ├── pet/                # Pet character components
│   │   └── question/           # Question card components
│   ├── constants/              # Colors, typography, questions
│   ├── lib/                    # Supabase client, utilities
│   ├── stores/                 # Zustand state stores
│   └── assets/                 # Images, fonts
│
├── supabase/                   # Database setup
│   ├── migrations/             # SQL migration files
│   └── seed.sql                # Seed data (questions, etc.)
│
├── docs/                       # Project documentation site
├── agents/                     # AI agent prompts
├── CLAUDE.md                   # Harness philosophy & dev rules
├── DECISIONS.md                # Architecture decision records
└── PROJECT_PLAN.md             # Full project plan & DB schema
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- A [Supabase](https://supabase.com) project

### Expo Version

```bash
# Install dependencies
cd app
npm install

# Create environment file
cp .env.example .env
# Fill in your Supabase URL and anon key

# Start the dev server
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) or press `i` for iOS simulator / `a` for Android emulator.

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration SQL located in `supabase/migrations/` against your database
3. Run `supabase/seed.sql` to populate the initial question data
4. Copy your project URL and anon key into your `.env` file

> **Security Note:** Never expose your `service_role` key in client code. Only the `anon` key should be used on the client side. All tables use Row Level Security (RLS).

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, production-ready |
| `develop` | Integration branch |
| `feature/*` | Individual feature work |

## License

MIT
