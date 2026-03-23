-- Allow authenticated users to find a couple by invite code (for joining)
-- Only exposes couples that still have an open slot (user2_id IS NULL)
CREATE POLICY "couples_select_by_invite_code" ON couples
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND user2_id IS NULL
  );
