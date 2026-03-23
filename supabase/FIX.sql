-- FIX 1: 트리거 재생성 (회원가입 에러 수정)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
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

-- FIX 2: 질문 데이터 삽입 (이미 있으면 무시)
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
('If we could live anywhere in the world for a year, where would you choose?', 'future', 50)
ON CONFLICT DO NOTHING;
