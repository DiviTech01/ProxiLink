-- First, see what policies exist
SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('profiles', 'user_roles', 'vendor_profiles');

-- Now drop ALL policies on these tables
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN ('profiles', 'user_roles', 'vendor_profiles')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- Create new simple policies
CREATE POLICY "allow_all_authenticated" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON user_roles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_authenticated" ON vendor_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Verify
SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('profiles', 'user_roles', 'vendor_profiles');
