-- Check if vendor_profiles table exists and its structure
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('profiles', 'user_roles', 'vendor_profiles')
AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Check actual data
SELECT * FROM profiles LIMIT 5;
SELECT * FROM user_roles LIMIT 5;
SELECT * FROM vendor_profiles LIMIT 5;
