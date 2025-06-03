-- SQL script to create admin user
-- Run this in Supabase SQL Editor

-- First, create a test admin user (replace with your email)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'admin@cropcatch.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin User"}',
  false,
  'authenticated'
);

-- Then create the profile with admin role
INSERT INTO public.profiles (
  id,
  full_name,
  role,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@cropcatch.com'),
  'Admin User',
  'admin',
  now()
);

-- Alternative: Update existing user to admin
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL_HERE');
