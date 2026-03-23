-- =============================================
-- SUMONE - FULL DATABASE SETUP
-- Copy this entire file into Supabase SQL Editor and click Run
-- URL: https://supabase.com/dashboard/project/yybiqpidheapmwvwfqjn/sql/new
-- =============================================

-- 1. TABLES
CREATE TABLE couples (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES auth.users(id) NOT NULL,
  user2_id UUID REFERENCES auth.users(id),
  invite_code TEXT UNIQUE NOT NULL,
  anniversary_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT NOT NULL,
  profile_image TEXT,
  couple_id UUID REFERENCES couples(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  question_number INT NOT NULL
);

CREATE TABLE daily_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID REFERENCES couples(id) NOT NULL,
  question_id INT REFERENCES questions(id) NOT NULL,
  assigned_date DATE NOT NULL,
  user1_id UUID REFERENCES auth.users(id),
  user2_id UUID REFERENCES auth.users(id),
  user1_answer TEXT,
  user2_answer TEXT,
  user1_answered_at TIMESTAMPTZ,
  user2_answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(couple_id, assigned_date)
);

-- 2. INDEXES
CREATE INDEX idx_profiles_couple_id ON profiles(couple_id);
CREATE INDEX idx_couples_invite_code ON couples(invite_code);
CREATE INDEX idx_daily_questions_couple_date ON daily_questions(couple_id, assigned_date);
CREATE INDEX idx_daily_questions_user1 ON daily_questions(user1_id);
CREATE INDEX idx_daily_questions_user2 ON daily_questions(user2_id);

-- 3. ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_my_couple_id()
RETURNS UUID AS $$
  SELECT couple_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "profiles_select_same_couple" ON profiles
  FOR SELECT USING (
    couple_id IS NULL AND id = auth.uid()
    OR couple_id = get_my_couple_id()
  );
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "couples_select_own" ON couples
  FOR SELECT USING (user1_id = auth.uid() OR user2_id = auth.uid());
CREATE POLICY "couples_insert" ON couples
  FOR INSERT WITH CHECK (user1_id = auth.uid());
CREATE POLICY "couples_update_own" ON couples
  FOR UPDATE USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "questions_select_authenticated" ON questions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "daily_questions_select_own_couple" ON daily_questions
  FOR SELECT USING (couple_id = get_my_couple_id());
CREATE POLICY "daily_questions_insert_own_couple" ON daily_questions
  FOR INSERT WITH CHECK (couple_id = get_my_couple_id());
CREATE POLICY "daily_questions_update_own_couple" ON daily_questions
  FOR UPDATE USING (couple_id = get_my_couple_id());

-- 4. AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'New User')
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 5. SEED DATA - 50 English Questions
INSERT INTO questions (question_text, category, question_number) VALUES
('What made you smile today?', 'general', 1),
('What''s one thing you appreciate about me that you haven''t said lately?', 'general', 2),
('How are you really feeling right now?', 'general', 3),
('What''s something small I do that makes your day better?', 'general', 4),
('If you could change one thing about your daily routine, what would it be?', 'general', 5),
('What song reminds you of us?', 'general', 6),
('What''s the best compliment you''ve ever received?', 'general', 7),
('What''s something you wish we did more often?', 'general', 8),
('How would you describe our relationship in three words?', 'general', 9),
('What''s one thing that always cheers you up when you''re down?', 'general', 10),
('What''s your biggest fear about the future?', 'deep', 11),
('What does "home" mean to you?', 'deep', 12),
('What''s a belief you held strongly that has changed over time?', 'deep', 13),
('What''s the hardest thing you''ve never told me about?', 'deep', 14),
('If you could give your younger self one piece of advice, what would it be?', 'deep', 15),
('What do you think is the most important quality in a partner?', 'deep', 16),
('What''s something you''re still learning to accept about yourself?', 'deep', 17),
('How do you want to be remembered by the people you love?', 'deep', 18),
('What moment in your life shaped who you are the most?', 'deep', 19),
('What does unconditional love look like to you?', 'deep', 20),
('If we swapped lives for a day, what''s the first thing you''d do as me?', 'fun', 21),
('What''s the weirdest food combo you secretly love?', 'fun', 22),
('If we had a couples'' reality show, what would it be called?', 'fun', 23),
('What''s your guilty pleasure that you''re not actually guilty about?', 'fun', 24),
('If you could have any superpower but only use it in our relationship, what would it be?', 'fun', 25),
('What''s the most embarrassing thing you''ve done to impress me?', 'fun', 26),
('If we were characters in a movie, what genre would it be?', 'fun', 27),
('What''s a skill you wish you could magically master overnight?', 'fun', 28),
('If you could eat only one cuisine for the rest of your life, what would it be?', 'fun', 29),
('What would your entrance song be if you walked into every room with theme music?', 'fun', 30),
('What''s your favorite memory of us together?', 'memory', 31),
('When did you first realize you had feelings for me?', 'memory', 32),
('What''s the funniest thing that''s happened to us as a couple?', 'memory', 33),
('What''s a trip or adventure we''ve had that you''ll never forget?', 'memory', 34),
('What''s the best meal we''ve shared together?', 'memory', 35),
('What moment made you think "this is the person I want to be with"?', 'memory', 36),
('What''s a small moment between us that means more than you''ve ever said?', 'memory', 37),
('What''s your favorite photo of us and why?', 'memory', 38),
('What''s something I said once that you still think about?', 'memory', 39),
('What was the best surprise you''ve ever given or received from me?', 'memory', 40),
('Where do you see us in five years?', 'future', 41),
('What''s a dream vacation you want us to take together?', 'future', 42),
('What kind of home do you imagine us living in someday?', 'future', 43),
('What''s a new hobby or activity you''d love for us to try together?', 'future', 44),
('If money wasn''t an issue, how would our life look different?', 'future', 45),
('What tradition do you want us to create as a couple?', 'future', 46),
('What''s one goal you want us to accomplish together this year?', 'future', 47),
('How do you want us to grow together as a couple?', 'future', 48),
('What''s something you''re excited about in our future?', 'future', 49),
('If we could live anywhere in the world for a year, where would you choose?', 'future', 50);
