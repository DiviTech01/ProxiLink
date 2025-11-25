-- Fix RLS policies to allow authenticated users to read data

-- DROP all existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own roles" ON user_roles;
DROP POLICY IF EXISTS "Authenticated users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can read all roles" ON user_roles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to read all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read all roles" ON user_roles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;

-- DROP vendor_profiles policies
DROP POLICY IF EXISTS "Users can read own vendor profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Authenticated users can read all vendor profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON user_roles;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON vendor_profiles;

-- CREATE simple policies that allow authenticated users full access
CREATE POLICY "Allow all for authenticated users" 
ON profiles FOR ALL
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" 
ON user_roles FOR ALL
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all for authenticated users" 
ON vendor_profiles FOR ALL
TO authenticated 
USING (true)
WITH CHECK (true);

-- Verify policies are active
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'user_roles', 'vendor_profiles')
ORDER BY tablename, policyname;
