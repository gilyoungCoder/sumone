-- ============================================
-- Sumone US - Initial Database Schema
-- Tables: couples, profiles, questions, daily_questions, answers
-- All tables have RLS enabled with appropriate policies
-- ============================================

-- ============================================
-- 1. TABLES
-- ============================================

-- Couples (created first because profiles references it)
CREATE TABLE couples (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES auth.users(id) NOT NULL,
  user2_id UUID REFERENCES auth.users(id),
  invite_code TEXT UNIQUE NOT NULL,
  anniversary_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (linked to Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT NOT NULL,
  profile_image TEXT,
  couple_id UUID REFERENCES couples(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions catalog
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  sort_order INT NOT NULL
);

-- Daily question assignment per couple
CREATE TABLE daily_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID REFERENCES couples(id) NOT NULL,
  question_id INT REFERENCES questions(id) NOT NULL,
  assigned_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(couple_id, assigned_date)
);

-- Answers to daily questions
CREATE TABLE answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  daily_question_id UUID REFERENCES daily_questions(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(daily_question_id, user_id)
);

-- ============================================
-- 2. INDEXES
-- ============================================

CREATE INDEX idx_profiles_couple_id ON profiles(couple_id);
CREATE INDEX idx_couples_invite_code ON couples(invite_code);
CREATE INDEX idx_daily_questions_couple_date ON daily_questions(couple_id, assigned_date);
CREATE INDEX idx_answers_daily_question ON answers(daily_question_id);

-- ============================================
-- 3. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's couple_id
CREATE OR REPLACE FUNCTION get_my_couple_id()
RETURNS UUID AS $$
  SELECT couple_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ----- profiles -----

-- Anyone in the same couple can read profiles
CREATE POLICY "profiles_select_same_couple" ON profiles
  FOR SELECT USING (
    couple_id IS NULL AND id = auth.uid()
    OR couple_id = get_my_couple_id()
  );

-- Users can insert their own profile
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Users can only update their own profile
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ----- couples -----

-- Only the two people in the couple can see it
CREATE POLICY "couples_select_own" ON couples
  FOR SELECT USING (
    user1_id = auth.uid() OR user2_id = auth.uid()
  );

-- Any authenticated user can create a couple (they become user1)
CREATE POLICY "couples_insert" ON couples
  FOR INSERT WITH CHECK (user1_id = auth.uid());

-- Only couple members can update (e.g. joining, setting anniversary)
CREATE POLICY "couples_update_own" ON couples
  FOR UPDATE USING (
    user1_id = auth.uid() OR user2_id = auth.uid()
  );

-- ----- questions -----

-- All authenticated users can read questions
CREATE POLICY "questions_select_authenticated" ON questions
  FOR SELECT USING (auth.role() = 'authenticated');

-- ----- daily_questions -----

-- Only the couple can see their daily questions
CREATE POLICY "daily_questions_select_own_couple" ON daily_questions
  FOR SELECT USING (couple_id = get_my_couple_id());

-- Only couple members can insert daily questions for their couple
CREATE POLICY "daily_questions_insert_own_couple" ON daily_questions
  FOR INSERT WITH CHECK (couple_id = get_my_couple_id());

-- ----- answers -----

-- Same couple can read each other's answers
CREATE POLICY "answers_select_same_couple" ON answers
  FOR SELECT USING (
    daily_question_id IN (
      SELECT id FROM daily_questions WHERE couple_id = get_my_couple_id()
    )
  );

-- Users can only insert their own answers
CREATE POLICY "answers_insert_own" ON answers
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND daily_question_id IN (
      SELECT id FROM daily_questions WHERE couple_id = get_my_couple_id()
    )
  );

-- ============================================
-- 4. AUTO-CREATE PROFILE ON SIGNUP (trigger)
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'New User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
