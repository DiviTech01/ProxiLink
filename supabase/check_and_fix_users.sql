-- Check all users in auth.users
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- Check which users have profiles
SELECT 
  u.id,
  u.email,
  p.full_name,
  p.phone
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Check which users have roles
SELECT 
  u.id,
  u.email,
  ur.role
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;

-- Fix missing profiles - Creates profiles for all users who don't have one
INSERT INTO profiles (id, full_name, phone)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', 'User'),
  COALESCE(u.raw_user_meta_data->>'phone', '')
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Fix missing roles - Assigns 'user' role to everyone who doesn't have one
INSERT INTO user_roles (user_id, role)
SELECT 
  u.id,
  'user'::app_role
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Grant yourself admin role (replace with YOUR email)
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'your-email@example.com'  -- CHANGE THIS TO YOUR EMAIL
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify everything is fixed
SELECT 
  u.email,
  p.full_name,
  ur.role,
  u.email_confirmed_at IS NOT NULL as email_verified
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;
