-- Check if profile and role exist for your new user
SELECT 
  u.id,
  u.email,
  p.full_name,
  p.phone,
  ur.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'divineokonitu02@gmail.com';

-- If no results, insert them
INSERT INTO profiles (id, full_name, phone)
VALUES ('64abbe83-daec-4f1a-8db8-8908bd664ce1', 'D Itu02', '+2348080766745')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role)
VALUES ('64abbe83-daec-4f1a-8db8-8908bd664ce1', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Check again
SELECT 
  u.id,
  u.email,
  p.full_name,
  ur.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'divineokonitu02@gmail.com';
