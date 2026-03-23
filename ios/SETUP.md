# Sumone iOS - Setup Guide

## Prerequisites
- Xcode 15+
- macOS Sonoma+
- Supabase project (see supabase/ folder for schema)

## Setup Steps

### 1. Create Xcode Project
1. Open Xcode → File → New → Project → iOS → App
2. Product Name: Sumone
3. Organization Identifier: com.sumone
4. Interface: SwiftUI
5. Language: Swift
6. Delete the default ContentView.swift

### 2. Add Source Files
Copy all files from `ios/Sumone/` into your Xcode project:
- App/ (SumoneApp.swift, RootView.swift, MainTabView.swift)
- Models/
- Views/
- ViewModels/
- Services/
- Utils/

### 3. Add Supabase SDK
File → Add Package Dependencies → Enter:
`https://github.com/supabase/supabase-swift`
Add package: Supabase

### 4. Configure Supabase
Add to Info.plist:
- SUPABASE_URL: your project URL
- SUPABASE_ANON_KEY: your anon key

### 5. Run
Select iPhone simulator → Run (Cmd+R)

## Supabase Setup
Run the SQL migration in `supabase/migrations/` on your Supabase project.
Then run `supabase/seed.sql` for question data.
