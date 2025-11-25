-- Re-enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;

-- Create proper RLS policies that allow authenticated users to access data
CREATE POLICY "authenticated_all_access" ON profiles 
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all_access" ON user_roles 
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all_access" ON vendor_profiles 
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Verify RLS is enabled and policies exist
SELECT 
  t.tablename, 
  t.rowsecurity as rls_enabled,
  COUNT(p.policyname) as policy_count
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename
WHERE t.schemaname = 'public' 
AND t.tablename IN ('profiles', 'user_roles', 'vendor_profiles')
GROUP BY t.tablename, t.rowsecurity
ORDER BY t.tablename;

-- Show all policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('profiles', 'user_roles', 'vendor_profiles')
ORDER BY tablename, policyname;
