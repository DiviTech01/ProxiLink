-- Run this in Supabase SQL Editor to create your profile and admin role

-- Insert profile for existing user
INSERT INTO profiles (id, full_name, phone)
VALUES ('1add1254-c5f5-4eae-bb66-9be952444dd8', 'Divine Itu', '0000000000')
ON CONFLICT (id) DO NOTHING;

-- Insert admin role
INSERT INTO user_roles (user_id, role)
VALUES ('1add1254-c5f5-4eae-bb66-9be952444dd8', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify
SELECT 
  u.email,
  p.full_name,
  ur.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'd.itu@alustudent.com';
