-- Script to diagnose and fix authentication issues

-- 1. Check if email confirmation is required (this would block profile creation)
-- Go to: Supabase Dashboard > Authentication > Settings > Email Auth
-- Look for "Enable email confirmations" - if ON, users must verify email before profiles are created

-- 2. Check Row Level Security policies on profiles table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('profiles', 'user_roles')
ORDER BY tablename, policyname;

-- 3. Temporarily disable RLS to test (BE CAREFUL - only for testing)
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

-- 4. Re-enable RLS after fixing
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Create proper insert policies for signup
DROP POLICY IF EXISTS "Users can insert their own profile on signup" ON profiles;
CREATE POLICY "Users can insert their own profile on signup"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own role on signup" ON user_roles;
CREATE POLICY "Users can insert their own role on signup"
ON user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);
